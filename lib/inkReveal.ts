// スクロールで「破れた紙 + 赤インク」が斜めに走ってブロックを出す演出（HTML-in-Canvas 版）。
//
// 仕組み（ブロック = data-ink を付けた要素 1 つ）:
//   1. 初回に画面へ入ったら、要素を同じ寸法のプレースホルダーに差し替え、その中の
//      <canvas layoutsubtree> の子へ一時的に移す（DOM ノードはそのまま。React の再マウントは起きない）
//   2. canvas の paint で ctx.drawElementImage() → 実 DOM の見た目をそのまま canvas に描き、
//      共有 WebGL で作った「破れ目マスク」と「インク層」を 2D 合成で重ねる
//   3. 掃き終わったら要素を元の位置へ戻してプレースホルダーを捨てる（以後はふつうの DOM）
//
// 描きっぱなしにせず DOM へ戻すのは: drawElementImage は要素の枠で切り抜かれる（影やはみ出しが消える）、
// canvas 内ではホバーや :focus-visible の更新に毎フレーム描き直しが要る、など常駐させると壊れやすいから。
// 演出中（約 0.6 秒）だけ canvas に入れ、それ以外は素の DOM にしておくのがいちばん安全。
//
// API が無いブラウザ / 視差効果を減らす設定では何もしない（data-ink 属性が付くだけで見た目も挙動も従来どおり）。

import { useLayoutEffect } from 'react';
import { reduced } from './util';

/* ---------- 実験 API の型（lib.dom にまだ無い） ---------- */
type Ctx2D = CanvasRenderingContext2D & {
  reset?: () => void;
  drawElementImage: (el: Element, x: number, y: number, w?: number, h?: number) => unknown;
};
type PaintCanvas = HTMLCanvasElement & { requestPaint?: () => void; onpaint: ((e: Event) => void) | null };

const supported = (): boolean => {
  if (typeof window === 'undefined' || typeof CanvasRenderingContext2D === 'undefined') return false;
  return 'drawElementImage' in CanvasRenderingContext2D.prototype && 'requestPaint' in HTMLCanvasElement.prototype;
};

/** 演出を使うか（読み込み時に 1 回だけ決める）。true のときだけ <html> に fx-ink を付けて未表示ブロックを隠す */
const ENABLED = supported() && !reduced();
if (ENABLED) document.documentElement.classList.add('fx-ink');

/* ---------- 共有 WebGL（マスクとインク層を作るだけ。ブロックの数に関係なく 1 コンテキスト） ---------- */
const VERT = `attribute vec2 aP; varying vec2 vUv;
void main(){ vUv = vec2(aP.x * .5 + .5, .5 - aP.y * .5); gl_Position = vec4(aP, 0., 1.); }`;

// p は CSS px（左上原点）。D 方向へ前線 uFront が進む。e > 0 が掃き終わった側。
// 前から順に: 網点のしぶき → 赤インクの縁（ギザギザ）→ 白い紙の繊維 → 本体（＋紙の落ち影）
const FRAG = `precision highp float;
varying vec2 vUv;
uniform vec2 uRes; uniform vec2 uDir; uniform float uFront; uniform float uSeed; uniform float uMode;
uniform vec3 uInk; uniform vec3 uPaper;
float h1(float n){ return fract(sin(n * 127.1 + uSeed * 31.7) * 43758.5453); }
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 17.3) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); return mix(h1(i), h1(i + 1.), f * f * (3. - 2. * f)); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h2(i), h2(i + vec2(1., 0.)), u.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), u.x), u.y); }
float aa(float x){ return clamp(x + .5, 0., 1.); }
void main(){
  vec2 p = vUv * uRes;
  vec2 N = vec2(-uDir.y, uDir.x);
  float s = dot(p, uDir), a = dot(p, N);
  // 破れ目: 大きなうねり + 細かい歯 + 1〜3px のギザ
  float tear = (n1(a / 70.) - .5) * 26. + (n1(a / 17.) - .5) * 9. + (h1(floor(a / 2.5)) - .5) * 3.;
  float e = uFront - s + tear;
  float rimW = 5. + 10. * n1(a / 45. + 7.);
  float fib = n2(p / 2.2) * .65 + n2(p / .9) * .35;
  float papW = 2. + 4. * n1(a / 23. + 3.) + fib * 3.;
  float inkA = aa(e);
  float papA = aa(e - rimW);
  float conA = aa(e - rimW - papW);
  // 網点（サイトの --dots と同じ 7px ピッチ・45 度）。前線から離れるほど小さく
  vec2 q = mat2(.7071, -.7071, .7071, .7071) * p / 7.;
  float d = length(fract(q) - .5) * 7.;
  float k = clamp(1. + e / 46., 0., 1.) * (.55 + .45 * n2(p / 26.));
  float dotA = aa((k * k * 4.2 - d) * 1.6) * step(.02, k);
  // インクのしぶき（網点の少し先に大粒を少し）
  vec2 c = floor(p / 30.);
  vec2 o = (vec2(h2(c), h2(c + 9.1)) * .6 + .2) * 30.;
  float rr = 1.5 + 5. * h2(c + 3.7);
  float sp = step(.72, h2(c + 5.3)) * aa(rr - length(p - c * 30. - o)) * step(-70., e - rr) * step(e, -6.);
  float dots = max(dotA, sp) * (1. - inkA);
  float rim = inkA - papA, paper = papA - conA;
  // 紙の縁の下に落ちる薄い影（本体側）
  float sh = conA * (1. - smoothstep(0., 9., e - rimW - papW)) * .45;
  if (uMode < .5) {
    gl_FragColor = vec4(0., 0., 0., clamp(inkA + dots, 0., 1.)); // マスク（alpha のみ使う）
  } else {
    vec3 col = uInk * (rim + dots) + uPaper * paper;
    gl_FragColor = vec4(col, clamp(rim + dots + paper + sh, 0., 1.)); // premultiplied
  }
}`;

interface Gl {
  gl: WebGLRenderingContext;
  cv: HTMLCanvasElement;
  u: Record<string, WebGLUniformLocation | null>;
  max: number;
}
let glState: Gl | null | undefined; // undefined = 未作成, null = 使えない

function getGl(): Gl | null {
  if (glState !== undefined) return glState;
  glState = null;
  const cv = document.createElement('canvas');
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false, alpha: true });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aP');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u: Gl['u'] = {};
  for (const n of ['uRes', 'uDir', 'uFront', 'uSeed', 'uMode', 'uInk', 'uPaper']) u[n] = gl.getUniformLocation(prog, n);
  const dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as Int32Array;
  cv.addEventListener('webglcontextlost', () => { glState = null; });
  glState = { gl, cv, u, max: Math.min(dims[0], dims[1], 8192) };
  return glState;
}

/* ---------- ブロック ---------- */
const BLEED = 56;          // 影やバーストのはみ出し分（drawElementImage は描く要素の枠で切られるので外側に余白を持たせる）
const DIR = [Math.cos(0.42), Math.sin(0.42)] as const; // 掃く向き（約 24 度下向き）
const STAGGER = 90;        // 同時に入ったブロック同士の開始間隔 ms
const RED: [number, number, number] = [0xe8 / 255, 0x12 / 255, 0x2d / 255];
const BLK: [number, number, number] = [0x0a / 255, 0x0a / 255, 0x0a / 255];
const PAPER: [number, number, number] = [0xf6 / 255, 0xf3 / 255, 0xec / 255];

interface Unit {
  el: HTMLElement;
  state: 'wait' | 'queued' | 'run' | 'done';
  seed: number;
  t0: number;
  dur: number;
  prog: number;          // 0..1（イージング前）
  hold: boolean;         // デバッグで進行を固定中
  ph?: HTMLDivElement;
  cv?: PaintCanvas;
  pad?: HTMLDivElement;
  ctx?: Ctx2D;
  w: number; h: number;  // CSS px（要素の枠）
  style: string | null;  // 退避した style 属性
}

const ease = (t: number) => 1 - Math.pow(1 - t, 2.6);
const S = (n: number) => `${n}px`;

/** フォーカスを保ったまま DOM を動かす（移動するとフォーカスが外れるため） */
function keepFocus(el: HTMLElement, move: () => void) {
  const a = document.activeElement;
  const inside = a instanceof HTMLElement && el.contains(a) ? a : null;
  move();
  if (inside && document.activeElement !== inside) inside.focus({ preventScroll: true });
}

class Controller {
  units: Unit[] = [];
  queue: Unit[] = [];
  io: IntersectionObserver;
  raf = 0;
  lastStart = -1e9;
  timeScale = 1;
  stats = { paints: 0, ms: 0 }; // paint 1 回あたりの JS 側コスト計測（デバッグ用）

  constructor(public root: HTMLElement) {
    root.setAttribute('data-ink-root', '');
    let i = 0;
    root.querySelectorAll<HTMLElement>('[data-ink]').forEach((el) => {
      // 入れ子のブロックは外側と一緒に出るので最初から完了扱い
      if (el.parentElement?.closest('[data-ink]')) { el.setAttribute('data-ink-s', 'done'); return; }
      this.units.push({ el, state: 'wait', seed: (i++ * 7.31 + Math.random() * 50) % 97, t0: 0, dur: 600, prog: 0, hold: false, w: 0, h: 0, style: null });
    });
    this.io = new IntersectionObserver((ents) => {
      for (const en of ents) {
        if (!en.isIntersecting) continue;
        const u = this.find(en.target);
        if (u) this.enqueue(u);
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    this.units.forEach((u) => this.io.observe(u.el));
    root.addEventListener('focusin', this.onFocus);
  }

  find(t: EventTarget | null) {
    return this.units.find((u) => u.el === t);
  }

  onFocus = (e: FocusEvent) => {
    const el = e.target instanceof Element ? e.target.closest('[data-ink]') : null;
    const u = this.find(el);
    // キーボードで先に入ってきたら待たせずに出す
    if (u && (u.state === 'wait' || u.state === 'queued')) { this.queue = this.queue.filter((x) => x !== u); this.start(u, performance.now()); }
  };

  enqueue(u: Unit) {
    if (u.state !== 'wait') return;
    this.io.unobserve(u.el);
    u.state = 'queued';
    this.queue.push(u);
    this.queue.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    this.kick();
  }

  kick() {
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  }

  tick = (now: number) => {
    this.raf = 0;
    // 遷移のカットイン中は待つ（帯の裏で終わってしまわないように）
    const busy = !!document.querySelector('.cutin.on');
    while (!busy && this.queue.length && now - this.lastStart >= STAGGER / this.timeScale) {
      const u = this.queue.shift()!;
      this.lastStart = now;
      this.start(u, now);
    }
    let live = this.queue.length > 0;
    for (const u of this.units) {
      if (u.state !== 'run') continue;
      if (!u.hold) u.prog = Math.min(1, (now - u.t0) / u.dur * this.timeScale);
      if (u.prog >= 1) { this.finish(u); continue; }
      live = true;
      u.cv!.requestPaint?.();
    }
    if (live) this.kick();
  };

  start(u: Unit, now: number) {
    if (u.state === 'run' || u.state === 'done') return;
    const r = u.el.getBoundingClientRect();
    const off = r.bottom < 0 || r.top > window.innerHeight; // もう画面外（高速スクロール）なら演出しない
    if (off || reduced() || !getGl() || !this.mount(u)) { this.finish(u); return; }
    u.state = 'run';
    u.t0 = now;
    u.prog = 0;
    const L = (u.w + 2 * BLEED) * DIR[0] + (u.h + 2 * BLEED) * DIR[1];
    u.dur = Math.min(720, Math.max(520, 470 + L * 0.12));
    this.kick();
  }

  /** 要素を canvas の中へ移す。寸法が取れない・位置指定が特殊なものは false（演出なしで出す） */
  mount(u: Unit): boolean {
    const el = u.el;
    const cs = getComputedStyle(el);
    const w = parseFloat(cs.width), h = parseFloat(cs.height);
    if (!(w > 0 && h > 0) || cs.display === 'inline' || cs.display === 'contents') return false;
    if (cs.position !== 'static' && cs.position !== 'relative') return false;
    u.w = w; u.h = h;

    // 1. 同じ箱のプレースホルダー（余白・グリッド配置も写す → レイアウトは動かない）
    const ph = document.createElement('div');
    const p = ph.style;
    p.display = cs.display.startsWith('inline') ? 'inline-block' : 'block';
    p.position = 'relative';
    p.boxSizing = 'border-box';
    p.width = S(w); p.height = S(h);
    p.margin = `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`;
    p.gridArea = cs.gridArea; p.alignSelf = cs.alignSelf; p.justifySelf = cs.justifySelf; p.order = cs.order;
    p.flex = 'none'; p.zIndex = cs.zIndex;
    if (cs.position === 'relative') { p.top = cs.top; p.left = cs.left; p.right = cs.right; p.bottom = cs.bottom; }

    // 2. はみ出し分を含む canvas（絶対配置なのでレイアウトに影響しない）
    const W = w + BLEED * 2, H = h + BLEED * 2;
    const cv = document.createElement('canvas') as PaintCanvas;
    cv.setAttribute('layoutsubtree', '');
    cv.setAttribute('content', 'drawable');
    cv.style.cssText = `position:absolute;left:${-BLEED}px;top:${-BLEED}px;width:${W}px;height:${H}px;display:block;pointer-events:none`;
    const gl = getGl()!;
    let s = Math.min(window.devicePixelRatio || 1, 2);
    s = Math.min(s, Math.sqrt(4e6 / (W * H)), gl.max / 2 / W, gl.max / H);
    cv.width = Math.max(1, Math.round(W * s));
    cv.height = Math.max(1, Math.round(H * s));
    const ctx = cv.getContext('2d') as Ctx2D | null;
    if (!ctx) return false;

    // 3. 描く対象はこの余白付きの箱（要素ごと + 影）
    const pad = document.createElement('div');
    pad.setAttribute('drawable', '');
    pad.style.cssText = `box-sizing:border-box;width:${W}px;height:${H}px;padding:${BLEED}px`;

    u.style = el.getAttribute('style');
    keepFocus(el, () => {
      el.parentNode!.insertBefore(ph, el);
      pad.appendChild(el);
      cv.appendChild(pad);
      ph.appendChild(cv);
    });
    el.style.width = S(w); el.style.height = S(h); el.style.margin = '0';
    if (cs.position === 'relative') el.style.inset = 'auto';
    el.setAttribute('data-ink-s', 'run');

    cv.onpaint = () => this.paint(u);
    Object.assign(u, { ph, cv, pad, ctx });
    cv.requestPaint?.();
    return true;
  }

  paint(u: Unit) {
    const t0 = performance.now();
    const { cv, ctx, pad } = u;
    const g = getGl();
    if (!cv || !ctx || !pad) return;
    if (!g) { this.finish(u); return; }
    const cw = cv.width, ch = cv.height;
    const W = u.w + BLEED * 2, H = u.h + BLEED * 2;
    if (ctx.reset) ctx.reset(); else ctx.clearRect(0, 0, cw, ch);
    ctx.drawElementImage(pad, 0, 0, cw, ch);

    // 共有 GL キャンバスの左下に [マスク | インク層] を並べて描く（大きくなる時だけ作り直す）
    const { gl, u: U } = g;
    if (g.cv.width < cw * 2 || g.cv.height < ch) {
      g.cv.width = Math.max(g.cv.width, cw * 2);
      g.cv.height = Math.max(g.cv.height, ch);
    }
    const L = W * DIR[0] + H * DIR[1];
    const f = ease(u.prog);
    const front = -50 + f * (L + 100);
    gl.uniform2f(U.uRes, W, H);
    gl.uniform2f(U.uDir, DIR[0], DIR[1]);
    gl.uniform1f(U.uFront, front);
    gl.uniform1f(U.uSeed, u.seed);
    const ink = u.el.getAttribute('data-ink') === 'k' ? BLK : RED;
    gl.uniform3f(U.uInk, ink[0], ink[1], ink[2]);
    gl.uniform3f(U.uPaper, PAPER[0], PAPER[1], PAPER[2]);
    for (const m of [0, 1]) {
      gl.viewport(m * cw, 0, cw, ch);
      gl.uniform1f(U.uMode, m);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    const sy = g.cv.height - ch;
    ctx.globalCompositeOperation = 'source-atop';      // インクは要素の形の上だけに乗る
    ctx.drawImage(g.cv, cw, sy, cw, ch, 0, 0, cw, ch);
    ctx.globalCompositeOperation = 'destination-in';   // 破れ目より先は透明
    ctx.drawImage(g.cv, 0, sy, cw, ch, 0, 0, cw, ch);
    ctx.globalCompositeOperation = 'source-over';
    this.stats.paints++;
    this.stats.ms += performance.now() - t0;
  }

  /** 素の DOM に戻す */
  unmount(u: Unit) {
    const { el, ph } = u;
    if (!ph) return;
    if (u.cv) u.cv.onpaint = null;
    keepFocus(el, () => {
      ph.parentNode?.insertBefore(el, ph);
      ph.remove();
    });
    if (u.style === null) el.removeAttribute('style'); else el.setAttribute('style', u.style);
    u.ph = u.cv = u.pad = u.ctx = undefined;
  }

  finish(u: Unit) {
    this.unmount(u);
    this.io.unobserve(u.el);
    u.state = 'done';
    u.el.setAttribute('data-ink-s', 'done');
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.root.removeEventListener('focusin', this.onFocus);
    this.units.forEach((u) => this.unmount(u));
    this.root.removeAttribute('data-ink-root');
  }
}

/* ---------- デバッグ用（ヘッドレスでの途中フレーム撮影など） ---------- */
let current: Controller | null = null;
if (ENABLED) {
  (window as unknown as { __fxDebug: unknown }).__fxDebug = {
    /** el（または selector）の進行を t (0..1) に固定して描く。t=null で固定解除 */
    setProgress(target: Element | string, t: number | null) {
      const c = current;
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      const u = c?.find(el);
      if (!c || !u) return false;
      if (u.state === 'wait' || u.state === 'queued') { c.queue = c.queue.filter((x) => x !== u); c.start(u, performance.now()); }
      if (u.state !== 'run') return false;
      u.hold = t !== null;
      if (t !== null) u.prog = Math.max(0, Math.min(0.999, t));
      u.cv?.requestPaint?.();
      c.kick();
      return true;
    },
    /** 全体の速度倍率（0.1 でスロー） */
    timeScale(k: number) { if (current) current.timeScale = k; },
    state() { return current?.units.map((u) => [u.el.className, u.state]); },
    stats() { return current?.stats; },
  };
}

/**
 * root 配下の [data-ink] を、初めて画面に入った時にインクで出す。
 * data-ink="k" は黒インク（赤地のブロック用）。root は描画前（layout effect）に印を付けるので未表示のチラ見えは起きない。
 */
export function useInkReveal(getRoot: () => HTMLElement | null) {
  useLayoutEffect(() => {
    const root = ENABLED ? getRoot() : null;
    if (!root) return;
    const c = new Controller(root);
    current = c;
    return () => { c.destroy(); if (current === c) current = null; };
  }, []);
}
