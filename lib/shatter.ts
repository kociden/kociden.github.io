import { hash, reduced } from './util';

/*
 * 「シャッター」ページ遷移（実験的な HTML-in-Canvas API を使う）
 * ・遷移の瞬間に、今見えている画面（#root の複製）を <canvas layoutsubtree> の子として描かせ、
 *   その描画結果を WebGL テクスチャに 1 回だけ転送する。
 * ・テクスチャを放射状のヒビ（同心円 × 放射線）で三角形の破片に分け、着弾点から外へ吹き飛ばす。
 * ・破片の下ではすでに新しいページに切り替わっている（mid を最初のフレームで呼ぶ）。
 * ・API が無い / 視差効果を減らす設定 / 失敗したときは 'failed' を返し、呼び出し側が従来のカットインに戻す。
 */

export type ShatterResult = 'done' | 'aborted' | 'failed';

// --- 実験的 API の最小限の型 ---
type ElementCanvas = HTMLCanvasElement & {
  requestPaint?: () => void;
  onpaint: ((ev: Event) => void) | null;
};
type GL = WebGLRenderingContext & {
  texElementSubImage2D?: (target: number, level: number, x: number, y: number, el: Element) => void;
  texElementImage2D?: (target: number, level: number, ifmt: number, fmt: number, type: number, el: Element) => void;
};

const DUR = 760;          // 全体（ms）
const CRACK = 0.13;       // 先頭のこの割合は「ヒビが走るだけ」で、破片はまだ動かない
const SPOKES = 18;        // 放射状のヒビの本数
const RINGS = 8;          // 同心円のヒビの段数 → 破片は SPOKES * (2 * RINGS - 1) = 270 枚
const PAINT_TIMEOUT = 500;  // これまでに描画結果が取れなければ諦めてカットインへ
const STRIDE = 14;        // pos2 ctr2 edge3 kind3 rnd4

/** HTML-in-Canvas + WebGL のテクスチャ転送が使えて、動きを減らす設定でもないか */
export function canShatter(): boolean {
  if (typeof window === 'undefined' || reduced() || document.hidden) return false;
  if (!('requestPaint' in HTMLCanvasElement.prototype)) return false;
  if (typeof CanvasRenderingContext2D === 'undefined' || !('drawElementImage' in CanvasRenderingContext2D.prototype)) return false;
  const protos = [window.WebGL2RenderingContext?.prototype, window.WebGLRenderingContext?.prototype];
  return protos.some((p) => !!p && ('texElementSubImage2D' in p || 'texElementImage2D' in p));
}

// 着弾点: 直前のクリック位置（キーボード操作ならフォーカス中の要素、無ければ画面中央やや右上）
let lastPointer = { x: 0, y: 0, at: -1e9 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => { lastPointer = { x: e.clientX, y: e.clientY, at: performance.now() }; }, { capture: true, passive: true });
}
function impactPoint(w: number, h: number): [number, number] {
  if (performance.now() - lastPointer.at < 1200) return [lastPointer.x, lastPointer.y];
  const a = document.activeElement;
  if (a && a !== document.body && a instanceof HTMLElement) {
    const r = a.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (r.width > 0 && x >= 0 && x <= w && y >= 0 && y <= h) return [x, y];
  }
  return [w * 0.56, h * 0.44];
}

/* ------------------------------------------------------------------ */
/* 今の画面の複製                                                       */
/* ------------------------------------------------------------------ */

// 動いている要素は「その瞬間の見た目」を inline に写す（複製側はアニメーションを止めるため）
const FROZEN = ['transform', 'translate', 'rotate', 'scale', 'opacity', 'clip-path', 'left', 'top', 'width', 'height', 'color', 'background-color'] as const;

function snapshot(w: number, h: number): { snap: HTMLDivElement; scrolls: [HTMLElement, number, number][] } | null {
  const root = document.getElementById('root');
  if (!root) return null;
  const copy = root.cloneNode(true) as HTMLElement;
  copy.removeAttribute('id');
  copy.className = 'fx-root';

  // 元と複製を同じ順で歩き、アニメーション中の値・横スクロール位置を写す
  const animated = new Set<Element>();
  for (const a of document.getAnimations()) {
    const t = (a.effect as KeyframeEffect | null)?.target;
    if (t && root.contains(t)) animated.add(t);
  }
  const scrolls: [HTMLElement, number, number][] = [];
  const src = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const dst = document.createTreeWalker(copy, NodeFilter.SHOW_ELEMENT);
  for (let s = src.nextNode() as HTMLElement | null, d = dst.nextNode() as HTMLElement | null; s && d;
    s = src.nextNode() as HTMLElement | null, d = dst.nextNode() as HTMLElement | null) {
    if (animated.has(s)) {
      const cs = getComputedStyle(s);
      for (const p of FROZEN) d.style.setProperty(p, cs.getPropertyValue(p));
    }
    if (s.scrollLeft || s.scrollTop) scrolls.push([d, s.scrollLeft, s.scrollTop]);
  }
  // 画面全体にかかる演出・読み上げ用の要素は除く。id は本物と重複しないよう消す
  copy.querySelectorAll('.cutin, .skip, #announce').forEach((n) => n.remove());
  copy.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
  copy.querySelectorAll('img[loading]').forEach((n) => n.setAttribute('loading', 'eager'));
  // 他の演出（glitch メニュー・ink reveal）の canvas は複製すると中身が描かれないので、同じ class / style の div に開いて中身をそのまま見せる
  copy.querySelectorAll('canvas').forEach((c) => {
    if (!c.hasAttribute('layoutsubtree') && c.getAttribute('content') !== 'drawable') return;
    const box = document.createElement('div');
    box.className = c.className;
    box.style.cssText = c.style.cssText;
    if (!box.style.display) box.style.display = 'block';
    while (c.firstChild) box.appendChild(c.firstChild);
    c.replaceWith(box);
  });
  // 入れ子の drawable は親のスナップショットから抜けてしまうので外す
  copy.querySelectorAll('[drawable]').forEach((n) => n.removeAttribute('drawable'));

  const snap = document.createElement('div');
  snap.className = 'fx-snap';
  snap.setAttribute('drawable', '');
  snap.inert = true;
  snap.style.width = w + 'px';
  snap.style.height = h + 'px';
  snap.appendChild(copy);
  return { snap, scrolls };
}

/* ------------------------------------------------------------------ */
/* 破片メッシュ                                                         */
/* ------------------------------------------------------------------ */

/** 着弾点まわりに放射状のヒビを入れ、三角形に割る。外側の破片から順に並べる（内側が手前に描かれる） */
function buildShards(w: number, h: number, ix: number, iy: number, seed: number) {
  const maxd = Math.max(Math.hypot(ix, iy), Math.hypot(w - ix, iy), Math.hypot(ix, h - iy), Math.hypot(w - ix, h - iy)) * 1.08;
  const rnd = (n: number) => (hash(seed * 7919 + n) % 100000) / 100000;
  const dt = (Math.PI * 2) / SPOKES;
  const rot0 = rnd(1) * dt;
  // pts[k][s]: k 段目の円上、s 本目のヒビ上の点（ゆらぎ付き）。辺の種類を決めるため k / s も持つ
  type Pt = [number, number, number, number];
  const pts: Pt[][] = [];
  for (let k = 0; k < RINGS; k++) {
    const row: Pt[] = [];
    const base = maxd * Math.pow((k + 1) / RINGS, 1.55);
    const gap = base - (k ? maxd * Math.pow(k / RINGS, 1.55) : 0);
    for (let s = 0; s < SPOKES; s++) {
      const n = 100 + k * 64 + s;
      const a = rot0 + s * dt + (rnd(n) - 0.5) * dt * 0.55;
      const r = k === RINGS - 1 ? base * 1.15 : base + (rnd(n + 9000) - 0.5) * gap * 0.5;
      row.push([ix + Math.cos(a) * r, iy + Math.sin(a) * r, k, s]);
    }
    pts.push(row);
  }
  const tris: Pt[][] = [];
  for (let k = RINGS - 1; k >= 1; k--) {
    for (let s = 0; s < SPOKES; s++) {
      const s2 = (s + 1) % SPOKES;
      const a = pts[k - 1][s], b = pts[k - 1][s2], c = pts[k][s2], d = pts[k][s];
      if (rnd(5000 + k * 64 + s) < 0.5) tris.push([a, b, c], [a, c, d]);
      else tris.push([a, b, d], [b, c, d]);
    }
  }
  const hit: Pt = [ix, iy, -1, -1];
  for (let s = 0; s < SPOKES; s++) tris.push([hit, pts[0][s], pts[0][(s + 1) % SPOKES]]);

  const data = new Float32Array(tris.length * 3 * STRIDE);
  let o = 0;
  tris.forEach((t, i) => {
    const cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
    const area2 = Math.abs((t[1][0] - t[0][0]) * (t[2][1] - t[0][1]) - (t[2][0] - t[0][0]) * (t[1][1] - t[0][1]));
    const r = [rnd(20000 + i * 4), rnd(20001 + i * 4), rnd(20002 + i * 4), rnd(20003 + i * 4)];
    // 各頂点の対辺の種類: 放射状のヒビ 1 / 同心円のヒビ .7 / 四角形を割った対角線 0（割れる瞬間まで見せない）
    const kind = [0, 1, 2].map((v) => {
      const q = t[(v + 1) % 3], u = t[(v + 2) % 3];
      if (q[3] === u[3] || q[2] < 0 || u[2] < 0) return 1;
      return q[2] === u[2] ? 0.7 : 0;
    });
    for (let v = 0; v < 3; v++) {
      const p = t[v], q = t[(v + 1) % 3], u = t[(v + 2) % 3];
      const hgt = area2 / Math.max(1e-3, Math.hypot(q[0] - u[0], q[1] - u[1])); // 対辺までの距離（px）
      data.set([p[0], p[1], cx, cy, v === 0 ? hgt : 0, v === 1 ? hgt : 0, v === 2 ? hgt : 0, kind[0], kind[1], kind[2], r[0], r[1], r[2], r[3]], o);
      o += STRIDE;
    }
  });
  return { data, count: tris.length * 3, maxd };
}

/* ------------------------------------------------------------------ */
/* シェーダ                                                             */
/* ------------------------------------------------------------------ */

const VS = `
attribute vec2 a_pos; attribute vec2 a_ctr; attribute vec3 a_edge; attribute vec3 a_kind; attribute vec4 a_rnd;
uniform vec2 u_view; uniform vec2 u_hit; uniform float u_t; uniform float u_maxd; uniform vec2 u_shake;
varying vec2 v_uv; varying vec3 v_edge; varying vec3 v_kind; varying float v_light; varying float v_alpha; varying float v_life; varying float v_scale;
vec3 rotA(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c); }
void main() {
  vec2 d = a_ctr - u_hit; float dist = length(d);
  vec2 dir = dist > 0.5 ? d / dist : vec2(0.0, -1.0);
  float nd = clamp(dist / u_maxd, 0.0, 1.0);
  float delay = nd * 0.2;
  float lt = clamp((u_t - ${CRACK.toFixed(2)} - delay) / (1.0 - ${CRACK.toFixed(2)} - delay), 0.0, 1.0);
  float e = 1.0 - pow(1.0 - lt, 1.9);
  vec3 axis = normalize(vec3(cos(a_rnd.x * 6.2832), sin(a_rnd.x * 6.2832), a_rnd.y - 0.5));
  float ang = (a_rnd.z * 2.0 - 1.0) * (3.0 + 5.0 * (1.0 - nd)) * e;
  vec3 local = rotA(vec3(a_pos - a_ctr, 0.0), axis, ang);
  vec3 n = rotA(vec3(0.0, 0.0, 1.0), axis, ang);
  float speed = u_maxd * (0.16 + 0.5 * (1.0 - nd)) * mix(0.7, 1.3, a_rnd.w);
  vec2 off = dir * speed * e + vec2(0.0, u_view.y * 0.85) * lt * lt;
  float z = local.z + (1.0 - nd) * mix(250.0, 650.0, a_rnd.y) * e;
  vec2 p = a_ctr + off + local.xy + u_shake;
  float persp = 1400.0; float s = persp / (persp - min(z, 900.0));
  p = u_view * 0.5 + (p - u_view * 0.5) * s;
  gl_Position = vec4(p.x / u_view.x * 2.0 - 1.0, 1.0 - p.y / u_view.y * 2.0, 0.0, 1.0);
  v_uv = a_pos / u_view;
  v_edge = a_edge;
  v_kind = a_kind;
  v_light = n.z * 0.5 + 0.5 + 0.35 * dot(n.xy, normalize(vec2(-0.6, -0.8)));
  v_alpha = 1.0 - smoothstep(0.55, 1.0, lt);
  v_life = lt;
  v_scale = s;
}`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_tex; uniform float u_t; uniform vec2 u_hit; uniform float u_maxd; uniform vec2 u_view;
varying vec2 v_uv; varying vec3 v_edge; varying vec3 v_kind; varying float v_light; varying float v_alpha; varying float v_life; varying float v_scale;
const vec3 RED = vec3(0.91, 0.07, 0.18);
float vmax(vec3 v) { return max(max(v.x, v.y), v.z); }
void main() {
  vec4 tex = texture2D(u_tex, v_uv);
  vec3 col = tex.rgb;
  vec3 ed3 = v_edge * v_scale;                         // 3 辺それぞれまでの距離 px
  float ed = min(min(ed3.x, ed3.y), ed3.z);
  float dHit = length(v_uv * u_view - u_hit);
  // 1) ヒビが走る: 着弾点から外へ。放射状のヒビが先、同心円のヒビが少し遅れて入る
  float front = smoothstep(0.0, ${CRACK.toFixed(2)} * 0.85, u_t) * u_maxd * 1.15;
  vec3 f3 = front * (0.45 + 0.55 * v_kind);
  vec3 vis = step(0.01, v_kind) * (vec3(1.0) - smoothstep(f3 - 60.0, f3, vec3(dHit)));
  float core = vmax((vec3(1.0) - smoothstep(0.35, 1.0, ed3)) * vis);
  float halo = vmax((vec3(1.0) - smoothstep(1.0, 2.6, ed3)) * vis);
  float glow = vmax((vec3(1.0) - smoothstep(1.5, 6.0, ed3)) * vis * v_kind);
  // 2) 割れたあと: 傾きで明暗、断面は赤、光が当たる辺は白く光る
  float sep = smoothstep(0.0, 0.1, v_life);
  float pre = 1.0 - sep;
  col = mix(col, RED, glow * 0.45 * pre);
  col = mix(col, vec3(0.03), halo * pre);
  col = mix(col, vec3(1.0, 0.97, 0.95), core * 0.9 * pre);
  col *= mix(1.0, 0.55 + 0.6 * v_light, sep);
  float rim = 1.0 - smoothstep(0.0, 3.0, ed);
  col = mix(col, RED, rim * sep);
  col = mix(col, vec3(1.0, 0.96, 0.94), (1.0 - smoothstep(0.0, 1.2, ed)) * sep * smoothstep(0.7, 1.0, v_light));
  col += vec3(1.0) * pow(clamp(v_light, 0.0, 1.0), 14.0) * 0.45 * sep;
  // 3) 着弾の白い閃光（最初のフレームは元の画面と同じ見た目にするため 0 から立ち上げる）
  float fl = smoothstep(0.0, 0.02, u_t) * exp(-max(u_t - 0.02, 0.0) * 26.0);
  float flash = fl * (exp(-dHit / (u_maxd * 0.07)) + 0.18 * exp(-dHit / (u_maxd * 0.4)));
  col = mix(col, vec3(1.0), clamp(flash * 1.3, 0.0, 1.0));
  float a = tex.a * v_alpha;
  gl_FragColor = vec4(col * a, a);
}`;

// 破片の後ろで一瞬だけ光る赤い網点（新しいページはその下）
const BG_VS = `attribute vec2 a_q; void main() { gl_Position = vec4(a_q, 0.0, 1.0); }`;
const BG_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float u_t; uniform vec2 u_hit; uniform float u_maxd; uniform float u_dpr; uniform vec2 u_view;
void main() {
  vec2 px = vec2(gl_FragCoord.x, u_view.y * u_dpr - gl_FragCoord.y) / u_dpr;
  float d = length(px - u_hit) / u_maxd;
  vec2 cell = fract(px / 7.0) - 0.5;
  float dt = 1.0 - smoothstep(0.24, 0.34, length(cell));
  float k = (1.0 - smoothstep(${CRACK.toFixed(2)}, 0.55, u_t)) * step(${CRACK.toFixed(2)}, u_t) * (1.0 - smoothstep(0.1, 1.0, d) * 0.6);
  vec3 col = mix(vec3(0.91, 0.07, 0.18), vec3(0.56, 0.04, 0.11), dt * 0.7);
  float a = k * 0.88;
  gl_FragColor = vec4(col * a, a);
}`;

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram();
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    gl.attachShader(p!, s);
    return s;
  };
  const a = mk(gl.VERTEX_SHADER, vs), b = mk(gl.FRAGMENT_SHADER, fs);
  gl.linkProgram(p!);
  gl.deleteShader(a);
  gl.deleteShader(b);
  if (!p || !gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p!) || 'link');
  return p;
}

/* ------------------------------------------------------------------ */
/* 再生                                                                 */
/* ------------------------------------------------------------------ */

let current: { abort: () => void } | null = null;
let runs = 0;

/**
 * 画面を割って遷移する。mid は破片の下でページを差し替える瞬間（最初のフレーム）に 1 度だけ呼ばれる。
 * 'failed' のときは mid は呼ばれていない（呼び出し側がカットインに切り替える）。
 */
export function shatter(mid: (() => void) | null): Promise<ShatterResult> {
  current?.abort();
  if (!canShatter()) return Promise.resolve('failed');

  const w = document.documentElement.clientWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const shot = snapshot(w, h);
  if (!shot) return Promise.resolve('failed');
  const { snap, scrolls } = shot;

  const canvas = document.createElement('canvas') as ElementCanvas;
  canvas.className = 'fx-shatter';
  canvas.setAttribute('layoutsubtree', '');
  canvas.setAttribute('content', 'drawable');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const gl = (canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true })
    || canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true })) as GL | null;
  if (!gl) return Promise.resolve('failed');

  const [ix, iy] = impactPoint(w, h);
  const seed = ++runs;
  let midCalled = false;
  let raf = 0;
  const timers: number[] = [];
  let res: (r: ShatterResult) => void = () => {};
  const done = new Promise<ShatterResult>((r) => { res = r; });

  const gpu: { prog?: WebGLProgram; bg?: WebGLProgram; buf?: WebGLBuffer | null; quad?: WebGLBuffer | null; tex?: WebGLTexture | null } = {};
  const finish = (r: ShatterResult) => {
    if (current !== handle) return;
    current = null;
    cancelAnimationFrame(raf);
    timers.forEach((t) => window.clearTimeout(t));
    canvas.onpaint = null;
    try {
      if (gpu.prog) gl.deleteProgram(gpu.prog);
      if (gpu.bg) gl.deleteProgram(gpu.bg);
      if (gpu.buf) gl.deleteBuffer(gpu.buf);
      if (gpu.quad) gl.deleteBuffer(gpu.quad);
      if (gpu.tex) gl.deleteTexture(gpu.tex);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { /* 片付けの失敗は無視 */ }
    canvas.remove();
    res(r);
  };
  const handle = { abort: () => finish(midCalled ? 'done' : 'aborted') };
  current = handle;

  // --- GL の準備（失敗したらカットインへ） ---
  let draw: (t: number) => void;
  try {
    const mesh = buildShards(w, h, ix, iy, seed);
    gpu.prog = program(gl, VS, FS);
    gpu.bg = program(gl, BG_VS, BG_FS);
    gpu.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gpu.buf);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.data, gl.STATIC_DRAW);
    gpu.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gpu.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gpu.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, gpu.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const P = gpu.prog, B = gpu.bg;
    const at = (n: string) => gl.getAttribLocation(P, n);
    const attrs: [number, number, number][] = [[at('a_pos'), 2, 0], [at('a_ctr'), 2, 2], [at('a_edge'), 3, 4], [at('a_kind'), 3, 7], [at('a_rnd'), 4, 10]];
    const aq = gl.getAttribLocation(B, 'a_q');
    const u = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const U = { view: u(P, 'u_view'), hit: u(P, 'u_hit'), t: u(P, 'u_t'), maxd: u(P, 'u_maxd'), shake: u(P, 'u_shake'), tex: u(P, 'u_tex') };
    const UB = { t: u(B, 'u_t'), hit: u(B, 'u_hit'), maxd: u(B, 'u_maxd'), dpr: u(B, 'u_dpr'), view: u(B, 'u_view') };

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    draw = (t: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // 背景の赤い閃光
      gl.useProgram(B);
      gl.bindBuffer(gl.ARRAY_BUFFER, gpu.quad!);
      gl.enableVertexAttribArray(aq);
      gl.vertexAttribPointer(aq, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(UB.t, t); gl.uniform2f(UB.hit, ix, iy); gl.uniform1f(UB.maxd, mesh.maxd);
      gl.uniform1f(UB.dpr, canvas.height / h); gl.uniform2f(UB.view, w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.disableVertexAttribArray(aq);
      // 破片
      gl.useProgram(P);
      gl.bindBuffer(gl.ARRAY_BUFFER, gpu.buf!);
      for (const [loc, size, off] of attrs) {
        if (loc < 0) continue;
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE * 4, off * 4);
      }
      // 着弾直後の小さな揺れ
      const sk = t < CRACK ? (1 - t / CRACK) * 7 : 0;
      gl.uniform2f(U.view, w, h); gl.uniform2f(U.hit, ix, iy); gl.uniform1f(U.t, t); gl.uniform1f(U.maxd, mesh.maxd);
      gl.uniform2f(U.shake, Math.sin(t * 190) * sk, Math.cos(t * 150) * sk * 0.6);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gpu.tex!);
      gl.uniform1i(U.tex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
      for (const [loc] of attrs) if (loc >= 0) gl.disableVertexAttribArray(loc);
    };
  } catch {
    finish('failed');
    return done;
  }

  // --- 子要素の描画結果をテクスチャへ（paint イベントの中で 1 回だけ） ---
  const upload = () => {
    gl.bindTexture(gl.TEXTURE_2D, gpu.tex!);
    gl.getError();
    if (gl.texElementSubImage2D) {
      const dp = window.devicePixelRatio || 1;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, Math.round(w * dp), Math.round(h * dp), 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, snap);
      if (gl.getError() === gl.NO_ERROR) return true;
    }
    if (gl.texElementImage2D) {
      gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snap);
      return gl.getError() === gl.NO_ERROR;
    }
    return false;
  };

  const hold = () => (window as unknown as { __fxShatterT?: number }).__fxShatterT; // デバッグ用: 進行度を固定
  const run = () => {
    let t0 = 0;
    const tick = (now: number) => {
      if (current !== handle) return;
      if (!midCalled) {
        // 最初のフレーム: 破片はまだ元の位置（= 元の画面と同じ見た目）。この下でページを差し替える
        midCalled = true;
        t0 = now;
        try { mid?.(); } catch (e) { window.setTimeout(() => { throw e; }); }
      }
      const fixed = hold();
      const t = typeof fixed === 'number' ? fixed : Math.min(1, (now - t0) / DUR);
      draw(t);
      if (t >= 1 && typeof fixed !== 'number') { finish('done'); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // タブが裏に回って rAF が止まっても必ず終わらせる
    timers.push(window.setTimeout(() => { if (!midCalled) { midCalled = true; mid?.(); } if (typeof hold() !== 'number') finish('done'); }, DUR + 700));
  };

  canvas.appendChild(snap);
  document.body.appendChild(canvas);
  snap.scrollTop = window.scrollY; // sticky ヘッダーも含めて今の見た目になる
  for (const [el, x, y] of scrolls) { el.scrollLeft = x; el.scrollTop = y; }

  let ready = false;
  let uploaded = false;
  canvas.onpaint = () => {
    if (!ready || current !== handle || midCalled) return;
    canvas.onpaint = null;
    let ok = false;
    try { ok = upload(); } catch { ok = false; }
    if (!ok) { finish('failed'); return; }
    uploaded = true;
    draw(0);
    // paint イベントの中で要求した rAF は呼ばれないことがあるので、タスクを 1 つ挟んでから回す
    timers.push(window.setTimeout(run, 0));
  };
  // 画像のデコードを少しだけ待ってから描画を要求（待ちすぎない）。※別オリジンの画像は仕様上テクスチャに写らない
  const imgs = Array.from(snap.querySelectorAll('img'));
  const decoded = Promise.all(imgs.map((i) => i.decode().catch(() => undefined)));
  void Promise.race([decoded, new Promise((r) => window.setTimeout(r, 200))]).then(() => {
    if (current !== handle) return;
    ready = true;
    canvas.requestPaint?.();
  });
  timers.push(window.setTimeout(() => { if (!uploaded) finish('failed'); }, PAINT_TIMEOUT));
  return done;
}
