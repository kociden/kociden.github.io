/*
 * HTML-in-Canvas（実験的 API）でコマンドメニューを WebGL シェーダ越しに描く。
 * ・<canvas layoutsubtree> の子は普通にレイアウト・操作されるが、描画はされない。
 *   paint イベントごとに子要素のスナップショットをテクスチャへ転送し、シェーダで刷る。
 * ・静止時：赤黒の網点（ハーフトーン）の版ズレ影と、紙の粒状感。文字はぼかさない。
 * ・選択が変わった瞬間：RGB ずれ + 横スライスずれ + 新しい行に寄せた赤フラッシュ（約 240ms）。
 * ・選択行だけ、ときどき網点の帯がすっと走る（アイドル時のきらめき）。
 * 対応していないブラウザでは一切使わない（fxSupported() が false）。
 */
import { reduced } from './util';

type ElemGL = WebGL2RenderingContext & {
  texElementSubImage2D?: (target: number, level: number, x: number, y: number, el: Element) => void;
  texElementImage2D?: (target: number, level: number, ifmt: number, fmt: number, type: number, el: Element) => void;
};
export type ElemCanvas = HTMLCanvasElement & {
  requestPaint(): void;
  updateElementGeometry(el: Element, opts: { canvasTransform: DOMMatrix }): void;
  onpaint: ((e: Event) => void) | null;
};

let support: boolean | null = null;
/** API がそろっていて WebGL2 が使えるか（結果はキャッシュ。reduced motion は呼び出し側で見る） */
export function fxSupported(): boolean {
  if (support !== null) return support;
  support = false;
  if (typeof window === 'undefined') return false;
  const C2 = window.CanvasRenderingContext2D;
  const GL = window.WebGL2RenderingContext;
  const H = window.HTMLCanvasElement?.prototype;
  if (!C2 || !GL || !H || !('drawElementImage' in C2.prototype)) return false;
  if (!('texElementSubImage2D' in GL.prototype) && !('texElementImage2D' in GL.prototype)) return false;
  if (!('requestPaint' in H) || !('updateElementGeometry' in H) || !('onpaint' in H)) return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { return false; }
  return (support = true);
}

const VS = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uTexSize;  // テクスチャの確保サイズ（px）
uniform vec2 uSize;     // canvas（px）
uniform float uS;       // CSS px → canvas px
uniform float uHit;     // グリッチ進行 0..1（<0 で無し）
uniform float uFlash;   // 赤フラッシュの強さ（起動時は 0）
uniform float uSeed;
uniform vec4 uBox;      // 選択行の外接矩形（canvas px・上原点）
uniform float uSheen;   // きらめき進行 0..1（<0 で無し）
out vec4 o;

const vec3 RED = vec3(0.91, 0.071, 0.176);

float h1(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec4 tex(vec2 p) {
  if (p.x < 0.0 || p.y < 0.0 || p.x > uSize.x || p.y > uSize.y) return vec4(0.0);
  return texture(uTex, p / uTexSize);
}

// 45° スクリーンの網点。cell は CSS px、tone は網点の面積率
float dots(vec2 p, float cell, float tone) {
  vec2 q = mat2(0.7071, -0.7071, 0.7071, 0.7071) * (p / uS) / cell;
  float d = length(fract(q) - 0.5) * cell * uS;
  float r = sqrt(clamp(tone, 0.0, 1.0) / 3.14159) * cell * uS;
  return 1.0 - smoothstep(r - 0.6, r + 0.6, d);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 bc = 0.5 * (uBox.xy + uBox.zw);
  float rowH = max(uBox.w - uBox.y, 1.0);
  float e = 0.0;
  vec4 c;
  if (uHit >= 0.0) {
    e = (1.0 - uHit) * (1.0 - uHit);
    float st = floor(uHit * 14.0);  // コマ送り感
    float w = exp(-abs(p.y - bc.y) / (rowH * 1.1)) * 0.85 + 0.15;
    float sh = (4.0 + 16.0 * h1(vec2(st, uSeed))) * uS;
    float band = floor((p.y + h1(vec2(uSeed, st)) * sh) / sh);
    float dx = 0.0;
    if (h1(vec2(band, st + uSeed)) > 0.55) dx = (h1(vec2(band + 7.0, st)) - 0.5) * 72.0 * uS * e * w;
    vec2 off = vec2((9.0 * w + 1.5) * uS * e, 0.0);
    vec2 q = p + vec2(dx, 0.0);
    vec4 a = tex(q + off), b = tex(q), d = tex(q - off);
    c = vec4(a.r, b.g, d.b, max(max(a.a, b.a), d.a));
  } else {
    c = tex(p);
  }

  // ---- 刷りの質感（静止時もかかる。暗い色はそのまま＝文字は潰れない）
  vec3 un = c.a > 0.002 ? c.rgb / c.a : vec3(0.0);
  float redness = clamp((un.r - max(un.g, un.b)) * 1.6, 0.0, 1.0);
  float whiteness = clamp((min(un.r, min(un.g, un.b)) - 0.6) / 0.35, 0.0, 1.0);
  un *= 1.0 - redness * dots(p, 4.2, 0.22) * 0.4;                                   // 赤ベタに黒網
  un *= 1.0 - whiteness * (0.045 * h1(floor(p / uS) + 0.37) + 0.05 * dots(p + 1.7 * uS, 3.0, 0.1)); // 紙
  c = vec4(un * c.a, c.a);

  // 選択行のきらめき：白面に赤い網点の帯が斜めに走る
  if (uSheen >= 0.0) {
    float lx = mix(uBox.x - 60.0 * uS, uBox.z + 60.0 * uS, uSheen);
    float dd = (p.x - lx) + (p.y - bc.y) * 0.6;
    float m = (1.0 - smoothstep(5.0 * uS, 15.0 * uS, abs(dd)))
      * step(uBox.y - 12.0 * uS, p.y) * step(p.y, uBox.w + 12.0 * uS) * whiteness;
    c.rgb = mix(c.rgb, RED * c.a, m * dots(p, 3.4, 0.5) * 0.8);
  }

  // 版ズレした赤い網点の影（中身の後ろ）
  float sa = tex(p - vec2(4.0, 4.0) * uS).a;
  float sd = dots(p, 4.2, 0.5) * sa * 0.9;
  c += vec4(RED, 1.0) * sd * (1.0 - c.a);

  if (uHit >= 0.0) {
    float fl = uFlash * smoothstep(0.0, 0.06, uHit) * (1.0 - smoothstep(0.1, 0.55, uHit));
    float near = 1.0 - smoothstep(rowH * 0.5, rowH * 1.4, abs(p.y - bc.y));
    c.rgb = mix(c.rgb, RED * c.a, fl * near * whiteness * 0.75);
    float sk = (p.x - bc.x) * -0.08;
    float slab = (1.0 - smoothstep(rowH * 0.42, rowH * 0.58, abs(p.y - bc.y + sk)))
      * smoothstep(uBox.x - 120.0 * uS, uBox.x - 30.0 * uS, p.x) * (1.0 - smoothstep(uBox.z + 60.0 * uS, uBox.z + 220.0 * uS, p.x));
    c += vec4(RED, 1.0) * slab * fl * 0.5 * (1.0 - c.a);
    c.rgb *= 1.0 - 0.2 * e * step(0.5, fract(p.y / (2.0 * uS)));  // 走査線
  }
  o = c;
}`;

export interface GlitchFx {
  /** 選択が変わった（box は選択行の外接矩形・wrap 基準の CSS px。null なら全体を軽く） */
  hit(box: DOMRect | null): void;
  destroy(): void;
}

const HIT_MS = 240;
const BOOT_MS = 420;
const SHEEN_MS = 700;
const SHEEN_EVERY = 3600;

/** canvas と、その直下の drawable なラッパーで描画を始める。失敗したら null */
export function createGlitchFx(canvas: ElemCanvas, wrap: HTMLElement, onLost: () => void, selBox: () => DOMRect | null): GlitchFx | null {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false }) as ElemGL | null;
  if (!gl) return null;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[fx] shader:', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    texSize: U('uTexSize'), size: U('uSize'), s: U('uS'), hit: U('uHit'), flash: U('uFlash'),
    seed: U('uSeed'), box: U('uBox'), sheen: U('uSheen'),
  };
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.uniform1i(U('uTex'), 0);

  let s = 1;            // CSS px → canvas px
  let tw = 0, th = 0;   // テクスチャ確保サイズ
  let hitT0 = -1, hitDur = HIT_MS, flash = 1, seed = 0;
  let box: [number, number, number, number] = [0, 0, 0, 0];
  let sheenT0 = -1;
  let raf = 0;
  let visible = true;
  let dead = false;
  const identity = new DOMMatrix();

  const setBox = (r: DOMRect | null) => {
    box = r ? [r.left * s, r.top * s, r.right * s, r.bottom * s] : [0, 0, canvas.width, canvas.height];
  };

  const resize = () => {
    const w = wrap.offsetWidth, h = wrap.offsetHeight;
    s = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.height = h + 'px';
    const W = Math.max(1, Math.round(w * s)), H = Math.max(1, Math.round(h * s));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    s = W / Math.max(1, w);
    canvas.requestPaint();
  };

  // DOM → テクスチャ。新しい API（確保してから Sub）と古い API の両方に対応
  const upload = () => {
    const W = canvas.width, H = canvas.height;
    if (gl.texElementSubImage2D) {
      if (tw !== W + 2 || th !== H + 2) {
        tw = W + 2; th = H + 2; // スナップショットの丸め誤差ぶん少し余裕を持たせる
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, wrap);
    } else if (gl.texElementImage2D) {
      gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, wrap);
      tw = W; th = H;
    }
  };

  const draw = (now: number) => {
    let hp = -1;
    if (hitT0 >= 0) {
      hp = (now - hitT0) / hitDur;
      if (hp >= 1) { hp = -1; hitT0 = -1; }
    }
    let sp = -1;
    if (sheenT0 >= 0) {
      sp = (now - sheenT0) / SHEEN_MS;
      if (sp >= 1) { sp = -1; sheenT0 = -1; }
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.texSize, tw || 1, th || 1);
    gl.uniform2f(u.size, canvas.width, canvas.height);
    gl.uniform1f(u.s, s);
    gl.uniform1f(u.hit, hp);
    gl.uniform1f(u.flash, flash);
    gl.uniform1f(u.seed, seed);
    gl.uniform4f(u.box, box[0], box[1], box[2], box[3]);
    gl.uniform1f(u.sheen, sp);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return hp >= 0 || sp >= 0;
  };

  // グリッチ中は毎フレーム DOM を撮り直す（カーソルの CSS 遷移も拾う）。きらめきは描き直しだけ
  const loop = () => {
    raf = 0;
    const now = performance.now();
    if (dead) return;
    if (hitT0 >= 0) canvas.requestPaint(); // 描画は onpaint で（終わりのコマで hitT0 が戻る）
    else if (!draw(now)) return;
    if ((hitT0 >= 0 && now - hitT0 < hitDur + 100) || sheenT0 >= 0) raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(loop); };

  canvas.onpaint = () => {
    if (dead) return;
    upload();
    // 当たり判定：ラッパーは canvas の原点にそのまま描くので恒等変換
    canvas.updateElementGeometry(wrap, { canvasTransform: identity });
    draw(performance.now());
  };

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);
  window.addEventListener('resize', resize);
  const io = new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; });
  io.observe(canvas);
  const sheenTimer = window.setInterval(() => {
    if (!visible || document.hidden || reduced() || hitT0 >= 0) return;
    setBox(selBox());
    sheenT0 = performance.now();
    kick();
  }, SHEEN_EVERY);

  const lost = (e: Event) => { e.preventDefault(); if (!dead) onLost(); };
  canvas.addEventListener('webglcontextlost', lost);

  resize();

  return {
    hit(r) {
      if (dead || reduced()) return;
      setBox(r);
      flash = r ? 1 : 0;
      hitDur = r ? HIT_MS : BOOT_MS;
      seed = Math.random() * 100;
      sheenT0 = -1;
      hitT0 = performance.now();
      kick();
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      window.clearInterval(sheenTimer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.onpaint = null;
      gl.deleteTexture(tex);
      gl.deleteProgram(prog);
    },
  };
}
