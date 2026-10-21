export const pad = (n: number) => String(n).padStart(2, '0');

/** 決定的な整数ハッシュ（切り貼り文字・バースト形状・集中線の揺らぎに使う） */
export function hash(n: number): number {
  let x = n | 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  return (x ^ (x >>> 16)) >>> 0;
}

const RM_QUERY = '(prefers-reduced-motion: reduce)';
/** 呼んだ時点での「視差効果を減らす」設定 */
export const reduced = () => typeof window !== 'undefined' && window.matchMedia(RM_QUERY).matches;
