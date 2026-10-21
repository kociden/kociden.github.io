import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { hash } from '../lib/util';
import { Burst } from './Deco';
import type { CutInLabel } from './SiteContext';

export interface CutInHandle {
  /** カットインを再生。mid は画面が帯で隠れている瞬間（250ms）に呼ばれる。終了で resolve */
  play: (label: CutInLabel, mid?: (() => void) | null) => Promise<void>;
}

const D = 640;

function textUnits(s: string) {
  let u = 0;
  for (const ch of s) u += /[　-鿿＀-￯]/.test(ch) ? 1 : /[A-Z0-9]/.test(ch) ? 0.52 : 0.55;
  return Math.max(u, 1);
}

/** 画面を横切る赤い帯のカットイン演出（Web Animations API） */
const CutIn = forwardRef<CutInHandle>(function CutIn(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const e1 = useRef<HTMLDivElement>(null);
  const e2 = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLParagraphElement>(null);
  const kick = useRef<HTMLParagraphElement>(null);
  const lines = useRef<HTMLDivElement>(null);
  const anims = useRef<Animation[]>([]);
  const timers = useRef<number[]>([]);

  const lineStyles = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const r = hash(i * 977 + 5);
    return { k: i % 4 === 3, style: { top: `${r % 100}%`, width: `${18 + ((r >>> 8) % 34)}vw`, height: `${1 + ((r >>> 4) % 5)}px` } };
  }), []);

  const stop = () => {
    anims.current.forEach((a) => a.cancel());
    timers.current.forEach((t) => window.clearTimeout(t));
    anims.current = [];
    timers.current = [];
  };

  useEffect(() => stop, []);

  useImperativeHandle(ref, () => ({
    play({ big: bigText, kick: kickText }, mid) {
      stop();
      const ci = root.current!;
      const ciBig = big.current!;
      const ciKick = kick.current!;
      const lat = /^[A-Z0-9 .\-!]+$/.test(bigText);
      ciBig.className = 'ci-big' + (lat ? ' lat' : '');
      ciBig.textContent = bigText;
      ciKick.textContent = kickText || '';
      ciKick.hidden = !kickText;
      const vw = window.innerWidth;
      const bandH = band.current!.offsetHeight || Math.min(330, Math.max(150, window.innerHeight * 0.36));
      const fs = Math.min(lat ? bandH * 0.72 : bandH * 0.5, (vw * (lat ? 0.82 : 0.78)) / textUnits(bigText));
      ciBig.style.fontSize = Math.round(fs) + 'px';
      ci.classList.add('on');
      const opt = (extra: KeyframeAnimationOptions = {}): KeyframeAnimationOptions => ({ duration: D, fill: 'both', ...extra });
      const slide = (el: HTMLElement, delay = 0) => el.animate([
        { transform: 'translateX(130vw)', easing: 'cubic-bezier(.15,.85,.25,1)' },
        { transform: 'translateX(0)', offset: 0.24 },
        { transform: 'translateX(-3vw)', offset: 0.7, easing: 'cubic-bezier(.7,0,.95,.5)' },
        { transform: 'translateX(-150vw)' },
      ], opt({ delay }));
      const burst = ci.querySelector<SVGElement>('.ci-burst');
      anims.current.push(
        dim.current!.animate([{ opacity: 0 }, { opacity: 0.93, offset: 0.18 }, { opacity: 0.93, offset: 0.7 }, { opacity: 0 }], opt()),
        slide(e1.current!, 25), slide(band.current!), slide(e2.current!, 45),
        tilt.current!.animate([
          { translate: '0 0' }, { translate: '0 0', offset: 0.2 }, { translate: '10px -7px', offset: 0.25 },
          { translate: '-6px 5px', offset: 0.3 }, { translate: '3px -2px', offset: 0.35 }, { translate: '0 0', offset: 0.4 }, { translate: '0 0' },
        ], opt()),
        ciBig.animate([
          { transform: 'translateX(40vw) skewX(-20deg) scale(1.4)', opacity: 0, easing: 'cubic-bezier(.2,1.3,.4,1)' },
          { transform: 'translateX(0) skewX(-8deg) scale(1)', opacity: 1, offset: 0.36 },
          { transform: 'translateX(-2vw) skewX(-8deg) scale(1)', opacity: 1, offset: 0.72 },
          { transform: 'translateX(-2vw) skewX(-8deg) scale(1)', opacity: 1 },
        ], opt({ delay: 30 })),
        ciKick.animate([
          { opacity: 0, transform: 'translateX(-30px) skewX(-14deg)' },
          { opacity: 1, transform: 'translateX(0) skewX(-14deg)', offset: 0.3 },
          { opacity: 1, transform: 'translateX(0) skewX(-14deg)' },
        ], opt({ duration: 420, delay: 110 })),
      );
      if (burst) {
        anims.current.push(burst.animate([
          { transform: 'scale(.3) rotate(0deg)' }, { transform: 'scale(1.15) rotate(25deg)', offset: 0.4 }, { transform: 'scale(1.25) rotate(40deg)' },
        ], opt()));
      }
      lines.current!.querySelectorAll('i').forEach((l, i) => {
        anims.current.push(l.animate([{ transform: 'translateX(140vw)' }, { transform: 'translateX(-60vw)' }], {
          duration: 260 + (hash(i) % 160), delay: hash(i + 99) % 140, iterations: 2, easing: 'linear', fill: 'both',
        }));
      });
      return new Promise<void>((resolve) => {
        timers.current.push(window.setTimeout(() => { if (mid) mid(); }, 250));
        timers.current.push(window.setTimeout(() => {
          ci.classList.remove('on');
          anims.current.forEach((a) => a.cancel());
          anims.current = [];
          resolve();
        }, D + 60));
      });
    },
  }), []);

  return (
    <div className="cutin" ref={root} aria-hidden="true">
      <div className="ci-dim" ref={dim} />
      <div className="ci-tilt" ref={tilt}>
        <div className="ci-e1" ref={e1} />
        <div className="ci-band" ref={band}>
          <div className="ci-lines" ref={lines}>
            {lineStyles.map((l, i) => <i key={i} className={l.k ? 'k' : undefined} style={l.style} />)}
          </div>
          <Burst n={18} seed={9} className="ci-burst" />
          <p className="ci-kick" ref={kick} />
          <p className="ci-big" ref={big} />
        </div>
        <div className="ci-e2" ref={e2} />
      </div>
    </div>
  );
});

export default CutIn;
