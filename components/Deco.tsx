import type { CSSProperties, ReactNode } from 'react';
import { hash } from '../lib/util';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** 切り貼り文字（ransom note）見出し。視覚用の span 群 + 読み上げ用テキスト */
export function Ransom({ text, seed = 1 }: { text: string; seed?: number }) {
  let k = 0;
  const tokens = String(text).match(/[A-Za-z0-9@#.'’\-]+|\s+|./gu) || [];
  const glyph = (ch: string) => {
    const h = hash(seed * 7919 + k * 104729 + (ch.codePointAt(0) ?? 0));
    const v = k === 0 ? 'rn-cap' : 'rn' + (h % 5);
    const r = ((h >>> 4) % 15) - 7;
    const y = (((h >>> 9) % 7) - 3) * 0.025;
    const s = k === 0 ? 1.14 : 0.9 + ((h >>> 13) % 5) * 0.05;
    const style: Vars = { '--r': `${r}deg`, '--y': `${y.toFixed(3)}em`, '--s': s.toFixed(2), '--k': k };
    const el = <span key={k} className={`rn ${v}`} style={style}>{ch}</span>;
    k++;
    return el;
  };
  const out: ReactNode[] = tokens.map((t, i) => {
    if (/^\s+$/.test(t)) return <span key={`s${i}`} className="rn-sp" />;
    if (t.length > 1) return <span key={`w${i}`} className="rn-w">{[...t].map(glyph)}</span>;
    return glyph(t);
  });
  return (
    <>
      <span className="vh">{text}</span>
      <span className="ransom" aria-hidden="true">{out}</span>
    </>
  );
}

/** ギザギザの爆発形（装飾） */
export function Burst({ n = 14, seed = 3, className = '' }: { n?: number; seed?: number; className?: string }) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const h = hash(seed * 31 + i);
    const r = i % 2 === 0 ? 46 + (h % 5) : 27 + (h % 9);
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <svg className={`burst ${className}`.trim()} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
      <polygon points={pts.join(' ')} />
    </svg>
  );
}

export function Chips({ list, label, hot = [] }: { list?: string[]; label: string; hot?: string[] }) {
  if (!list || !list.length) return null;
  return (
    <ul className="chips" aria-label={label}>
      {list.map((x) => <li key={x} className={hot.includes(x) ? 'hot' : undefined}>{x}</li>)}
    </ul>
  );
}

/** セクション見出し（番号 + 切り貼り文字） */
export function SectionHead({ n, text, id, focusable }: { n: number; text: string; id: string; focusable?: boolean }) {
  return (
    <h2 className="sh" id={id} tabIndex={focusable ? -1 : undefined}>
      <span className="sh-n" aria-hidden="true">{n}</span>
      <span><Ransom text={text} seed={n * 3} /></span>
    </h2>
  );
}

/** 下層ページの見出し */
export function PageHead({ title, sub, count, ghost, seed }: { title: string; sub: string; count: ReactNode; ghost: string; seed: number }) {
  return (
    <header className="ph">
      <span className="ph-ghost" aria-hidden="true">{ghost}</span>
      <div>
        <h1 className="ph-title" tabIndex={-1} data-focus=""><Ransom text={title} seed={seed} /></h1>
        <p className="ph-sub">{sub}</p>
      </div>
      <p className="ph-count">{count}</p>
    </header>
  );
}
