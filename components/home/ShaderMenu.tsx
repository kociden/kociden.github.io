import { useEffect, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { createGlitchFx, type ElemCanvas, type GlitchFx } from '../../lib/glitch';

// React/TS が知らない HTML-in-Canvas 用の属性（新旧どちらの綴りでも効くよう両方付ける）
const CANVAS_ATTRS = { layoutsubtree: '', content: 'drawable' } as HTMLAttributes<HTMLCanvasElement>;
const DRAWABLE = { drawable: '' } as HTMLAttributes<HTMLDivElement>;

/** i 行目の .cmd-face（回転込み）の外接矩形を wrap 基準の CSS px で */
function faceBox(wrap: HTMLElement | null, i: number): DOMRect | null {
  const face = wrap?.querySelectorAll<HTMLElement>('.cmd-face')[i];
  if (!wrap || !face) return null;
  const a = face.getBoundingClientRect(), b = wrap.getBoundingClientRect();
  return new DOMRect(a.left - b.left, a.top - b.top, a.width, a.height);
}

/*
 * メニューを <canvas layoutsubtree> の中に入れ、シェーダで刷る（lib/glitch.ts）。
 * ・ラッパー .fx-wrap は canvas の原点に置き、四方に余白（--fxb）を持たせて回転した行やカーソルの星がはみ出さないようにする。
 *   canvas は同じ量の負マージンで広げるので、メニューの位置・寸法は通常版と変わらない。
 * ・当たり判定は updateElementGeometry（恒等変換）で本物の DOM に届く。ホバー・クリック・キーボード・フォーカスはそのまま。
 */
export default function ShaderMenu({ sel, onFail, children }: { sel: number; onFail: () => void; children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<GlitchFx | null>(null);
  const selRef = useRef(sel);
  selRef.current = sel;
  const failRef = useRef(onFail);
  failRef.current = onFail;

  useLayoutEffect(() => {
    const canvas = canvasRef.current as ElemCanvas;
    const wrap = wrapRef.current!;
    const selBox = () => faceBox(wrap, selRef.current);
    let fx: GlitchFx | null = null;
    try { fx = createGlitchFx(canvas, wrap, () => failRef.current(), selBox); } catch (e) { console.warn('[fx]', e); }
    if (!fx) { failRef.current(); return; }
    fxRef.current = fx;
    fx.hit(null); // 起動時に一度だけ軽く
    return () => { fx!.destroy(); fxRef.current = null; };
  }, []);

  const shown = useRef(sel);
  useEffect(() => {
    if (shown.current === sel) return;
    shown.current = sel;
    const box = faceBox(wrapRef.current, sel);
    if (box) fxRef.current?.hit(box);
  }, [sel]);

  return (
    <canvas className="fx-canvas" ref={canvasRef} {...CANVAS_ATTRS}>
      <div className="fx-wrap" ref={wrapRef} {...DRAWABLE}>{children}</div>
    </canvas>
  );
}
