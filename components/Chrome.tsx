import { useEffect, useLayoutEffect, useRef } from 'react';
import { PROFILE } from '../constants';
import type { TabId } from '../lib/routes';
import { Link } from './SiteContext';

export interface TabDef {
  id: TabId;
  label: string;
  href: string;
  big: string;  // カットインの大文字
  sub: string;  // カットインの小見出し
}

export const TABS: TabDef[] = [
  { id: 'home', label: 'ホーム', href: '/', big: 'HOME', sub: 'ホームに戻る' },
  { id: 'events', label: 'イベント', href: '/events/', big: 'EVENT', sub: '主催イベント' },
  { id: 'works', label: 'Works', href: '/works/', big: 'WORKS', sub: '制作物' },
  { id: 'lt', label: 'LT', href: '/lt/', big: 'LT', sub: '登壇資料' },
  { id: 'news', label: 'News', href: '/news/', big: 'NEWS', sub: 'お知らせ' },
];

export function Header({ active }: { active: TabId | null }) {
  const cur = useRef<HTMLLIElement>(null);
  const tabs = useRef<HTMLUListElement>(null);
  const placed = useRef(false);

  const place = (instant: boolean) => {
    const c = cur.current;
    const a = tabs.current?.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (!c) return;
    if (!a) { c.style.width = '0px'; return; }
    const li = a.parentElement as HTMLElement;
    if (instant) c.style.transition = 'none';
    c.style.left = (li.offsetLeft - 2) + 'px';
    c.style.width = (li.offsetWidth + 4) + 'px';
    if (instant) { void c.offsetWidth; c.style.transition = ''; }
  };

  useLayoutEffect(() => {
    place(!placed.current);
    placed.current = true;
  }, [active]);

  useEffect(() => {
    const onResize = () => place(true);
    window.addEventListener('resize', onResize);
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) place(true); });
    return () => { alive = false; window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <header className="bar" id="bar">
      <Link className="logo" href="/" aria-label="ホームへ">
        <span className="logo-mark" aria-hidden="true"><img src="/assets/mlab-icon.png" alt="" width="72" height="72" /></span>
        <span className="logo-t"><b>{PROFILE.brand}</b><small>{PROFILE.handle}</small></span>
      </Link>
      <nav className="tabs-nav" aria-label="メインナビゲーション">
        <kbd title="前のタブ">Q</kbd>
        <ul className="tabs" ref={tabs}>
          <li aria-hidden="true" className="tab-cur" ref={cur} />
          {TABS.map((t) => (
            <li key={t.id}>
              <Link href={t.href} aria-current={t.id === active ? 'page' : undefined}>{t.label}</Link>
            </li>
          ))}
        </ul>
        <kbd title="次のタブ">E</kbd>
      </nav>
    </header>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="foot">
      <p><b>{PROFILE.brand}</b>　{PROFILE.handle}・{PROFILE.location}　<i className="motto">Show no mercy.</i></p>
      <p>
        © {year} {PROFILE.brand}
        <span className="credit">Cat icon: <a href="https://github.com/twitter/twemoji" target="_blank" rel="noopener noreferrer">Twemoji</a>, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC-BY 4.0</a></span>
      </p>
    </footer>
  );
}
