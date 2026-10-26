import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { EVENTS, PROFILE, WORKS } from '../../constants';
import { realTalks } from '../../lib/routes';
import { fxSupported } from '../../lib/glitch';
import { reduced } from '../../lib/util';
import { Burst } from '../Deco';
import { Link, useSite } from '../SiteContext';
import ShaderMenu from './ShaderMenu';

interface MenuItem {
  label: string;
  sub: string;
  help: string;
  href?: string;    // ページ遷移
  scroll?: string;  // ホーム内のセクションへ
  big?: string;
}

const EV = EVENTS[0];
const MENU: MenuItem[] = [
  { label: 'プロフィール', sub: '自己紹介', help: `${PROFILE.handle}　${PROFILE.school}`, scroll: 'profile', big: 'PROFILE' },
  { label: 'イベント', sub: '主催', help: EV ? `${EV.title}　${EV.date}` : '主催イベント', href: '/events/' },
  { label: 'ワークス', sub: '制作物', help: `制作物 ${WORKS.length} 件`, href: '/works/' },
  { label: 'LT', sub: '登壇資料', help: `登壇スライド ${realTalks.length} 本`, href: '/lt/' },
  { label: 'ステータス', sub: 'スキル', help: '使える技術', scroll: 'status', big: 'STATUS' },
  { label: 'ログ', sub: 'お知らせ', help: '受賞・お知らせ', href: '/news/' },
  { label: 'コンタクト', sub: '連絡先', help: 'メール / GitHub', scroll: 'contact', big: 'CONTACT' },
];
const NM = MENU.length;
const ROT = MENU.map((_, i) => -7 + (i * 11) / (NM - 1)); // -7deg → +4deg の扇
const IND = MENU.map((_, i) => Math.sin((i / (NM - 1)) * Math.PI) * 2.6); // 弧状のインデント
const HYST = 10;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/*
 * コマンドメニュー（ジッターなし）
 * ・各行（li > .cmd-row）は回転しない全幅・固定高さの帯。当たり判定は行同士で重ならない。
 * ・回転するのは中の .cmd-face だけ（pointer-events:none）。
 * ・選択はメニュー全体の pointermove で y 座標から行を求める。行境界の ±HYST px は「現状維持」帯。
 * ・同じ行なら何もしない。カーソルは回転前のレイアウト値（offset*）で置き、同じ回転を掛ける。
 * ・カーソル・装飾はすべて pointer-events:none。選択時に寸法が変わる CSS は使わない。
 */
export default function CommandMenu() {
  const { cutin, keys } = useSite();
  const listRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLLIElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const bands = useRef<[number, number][]>([]);
  const selRef = useRef(0);       // 最新の選択（同期的に更新）
  const placedRef = useRef(-1);   // カーソルを最後に置いた行
  const [sel, setSel] = useState(0);
  // HTML-in-Canvas のシェーダ版（対応ブラウザかつ視差効果を減らす設定でないときだけ）。失敗したら通常版に戻す
  const [fx, setFx] = useState(() => fxSupported() && !reduced());
  const fxOff = useCallback(() => setFx(false), []);

  const measure = useCallback(() => {
    bands.current = rowRefs.current.map((r) => (r ? [r.offsetTop, r.offsetTop + r.offsetHeight] : [0, 0]));
  }, []);

  const place = useCallback((i: number, instant: boolean) => {
    const row = rowRefs.current[i];
    const cursor = cursorRef.current;
    const face = row?.firstElementChild as HTMLElement | null;
    if (!row || !cursor || !face) return;
    const x = row.offsetLeft + face.offsetLeft;
    const y = row.offsetTop + face.offsetTop;
    if (instant) cursor.style.transition = 'none';
    cursor.style.width = face.offsetWidth + 'px';
    cursor.style.height = face.offsetHeight + 'px';
    cursor.style.transform = `translate(${x}px, ${y}px) rotate(${ROT[i]}deg)`;
    if (instant) { void cursor.offsetWidth; cursor.style.transition = ''; }
  }, []);

  const select = useCallback((i: number, focus = false) => {
    i = (i + NM) % NM;
    if (i !== selRef.current) {
      selRef.current = i;
      setSel(i);
    }
    if (focus) rowRefs.current[i]?.focus({ preventScroll: false });
  }, []);

  // 選択が変わったらカーソルを移動（初回は瞬時）、2 回目以降は「ヒット」演出
  useLayoutEffect(() => {
    const first = placedRef.current < 0;
    if (placedRef.current === sel) return;
    placedRef.current = sel;
    place(sel, first);
    const cursor = cursorRef.current;
    if (!first && cursor && !reduced()) {
      cursor.classList.remove('hit');
      void cursor.offsetWidth;
      cursor.classList.add('hit');
    }
  }, [sel, place]);

  useLayoutEffect(() => {
    measure();
    const relayout = () => { measure(); place(selRef.current, true); };
    window.addEventListener('resize', relayout);
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) relayout(); });
    if (placedRef.current >= 0) place(selRef.current, true); // fx の切り替えで作り直したカーソル
    const list = listRef.current!;
    keys.menu = {
      list,
      move: (d) => select(selRef.current + d, true),
      focusSel: () => rowRefs.current[selRef.current]?.focus({ preventScroll: true }),
    };
    return () => {
      alive = false;
      window.removeEventListener('resize', relayout);
      if (keys.menu?.list === list) keys.menu = null;
    };
  }, [keys, measure, place, select, fx]);

  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === 'touch') return;
    const list = listRef.current!;
    const y = e.clientY - list.getBoundingClientRect().top;
    const b = bands.current;
    const cur = selRef.current;
    for (let i = 0; i < b.length; i++) {
      const [top, bottom] = b[i];
      if (y >= top && y < bottom) {
        if (i === cur) return;
        // 隣接行への移動は境界から HYST px 以上入るまで保留（往復ゆれ防止）
        if (Math.abs(i - cur) === 1 && (y < top + HYST || y > bottom - HYST)) return;
        select(i);
        if (list.contains(document.activeElement)) rowRefs.current[i]?.focus({ preventScroll: true });
        return;
      }
    }
  };

  const scrollTo = (m: MenuItem) => {
    const target = m.scroll ? document.getElementById(m.scroll) : null;
    if (!target) return;
    const go = () => {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      target.querySelector<HTMLElement>('.sh')?.focus({ preventScroll: true });
    };
    if (reduced()) { go(); return; }
    void cutin({ big: m.big || m.label, kick: m.label }, go);
  };

  const ticks = useMemo(() => Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const major = i % 6 === 0;
    return (
      <line
        key={i} className={major ? 'tick' : ''}
        x1={(Math.cos(a) * 44).toFixed(1)} y1={(Math.sin(a) * 44).toFixed(1)}
        x2={(Math.cos(a) * (major ? 38 : 41)).toFixed(1)} y2={(Math.sin(a) * (major ? 38 : 41)).toFixed(1)}
        stroke="currentColor" strokeWidth={major ? 1.6 : 0.6}
      />
    );
  }), []);

  // リストとヘルプ。fx のときは canvas の中に入る（DOM としては同じもの）
  const body = (
    <>
      <ul className="cmd-list" id="menu" ref={listRef} onPointerMove={onPointerMove}>
        <li className="cmd-cursor" aria-hidden="true" ref={cursorRef}>
          <span className="cc-r" /><span className="cc-w" /><Burst n={8} seed={7} className="cc-star" />
        </li>
        {MENU.map((m, i) => {
          const style: Vars = { '--ind': `calc(${IND[i].toFixed(2)} * clamp(18px, 2.6vw, 40px))`, '--rot': `${ROT[i].toFixed(2)}deg`, '--i': i };
          const inner = (
            <span className="cmd-face">
              <span className="cmd-key" aria-hidden="true">{i + 1}</span>
              <span className="cmd-label">{m.label}</span>
              <span className="cmd-sub">{m.sub}</span>
            </span>
          );
          const common = {
            className: 'cmd-row',
            style,
            onFocus: () => select(i),
            ref: (el: HTMLElement | null) => { rowRefs.current[i] = el; },
          };
          return (
            <li key={m.label} className={i === sel ? 'is-sel' : undefined}>
              {m.href
                ? <Link href={m.href} {...common}>{inner}</Link>
                : <button type="button" {...common} onClick={() => scrollTo(m)}>{inner}</button>}
            </li>
          );
        })}
      </ul>
      <p className="cmd-help">
        <span className="txt" id="menu-help">{MENU[sel].help}</span>
        <span className="keys" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd>選択 <kbd>Enter</kbd>決定 <kbd>Q</kbd><kbd>E</kbd>タブ</span>
      </p>
    </>
  );

  return (
    <nav className="cmd" aria-label="コマンド">
      <svg className="cmd-wheel" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" style={{ rotate: `${sel * -12}deg` }}>
        <circle r="47" strokeWidth="3" /><circle r="44" strokeWidth=".6" /><circle r="30" strokeWidth="10" opacity=".5" />
        {ticks}
      </svg>
      {fx ? <ShaderMenu sel={sel} onFail={fxOff}>{body}</ShaderMenu> : body}
    </nav>
  );
}
