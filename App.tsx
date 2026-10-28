import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { EVENTS, PROFILE } from './constants';
import { findTalk, parsePath, pathOf, routeMeta, tabOf, type Route } from './lib/routes';
import { pad, reduced } from './lib/util';
import { canShatter, shatter } from './lib/shatter';
import { epNo } from './components/Cards';
import { Footer, Header, TABS } from './components/Chrome';
import CutIn, { type CutInHandle } from './components/CutIn';
import Home from './components/home/Home';
import LtDetail from './components/pages/LtDetail';
import { Events, LtList, News, NotFound, Works } from './components/pages/Lists';
import NewsDetail from './components/pages/NewsDetail';
import { SiteContext, type CutInLabel, type KeyTargets, type SiteApi } from './components/SiteContext';

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'home': return <Home />;
    case 'works': return <Works />;
    case 'lt': return <LtList />;
    case 'talk': return <LtDetail slug={route.slug} />;
    case 'events': return <Events />;
    case 'news': return <News />;
    case 'newsDetail': return <NewsDetail id={route.id} />;
    default: return <NotFound />;
  }
}

/** 遷移時のカットインに出す文字 */
function cutLabel(r: Route): CutInLabel {
  if (r.name === 'talk') {
    const t = findTalk(r.slug);
    return t ? { big: t.title, kick: `LT #${pad(epNo(t))}` } : { big: 'LT', kick: '登壇資料' };
  }
  if (r.name === 'events' && EVENTS[0]) return { big: 'EVENT', kick: EVENTS[0].title };
  if (r.name === 'newsDetail') return { big: 'NEWS', kick: 'お知らせ' };
  const tab = TABS.find((x) => x.id === tabOf(r));
  return tab ? { big: tab.big, kick: tab.sub } : { big: '404', kick: 'ページが見つかりません' };
}

const currentRoute = () => parsePath(window.location.pathname);

/** ホームのヒーローを「流れ込み」演出付きで出し直す */
function cascade() {
  const hero = document.querySelector('#view .hero');
  if (!hero || reduced()) return;
  hero.classList.remove('cascade');
  void (hero as HTMLElement).offsetWidth;
  hero.classList.add('cascade');
  window.setTimeout(() => hero.classList.remove('cascade'), 1400);
}

export default function App() {
  const [route, setRoute] = useState<Route>(currentRoute);      // 表示中のページ
  const [tabRoute, setTabRoute] = useState<Route>(route);        // タブの選択（遷移開始と同時に動く）
  const [epoch, setEpoch] = useState(0);                          // ホームを「最初から」やり直すたびに増やして作り直す
  const tabRouteRef = useRef(tabRoute);
  const cut = useRef<CutInHandle>(null);
  const viewRef = useRef<HTMLElement>(null);
  const navId = useRef(0);
  const keys = useRef<KeyTargets>({ menu: null, viewer: null }).current;

  const cutin = useCallback((label: CutInLabel, mid?: (() => void) | null) => {
    if (!cut.current) { mid?.(); return Promise.resolve(); }
    return cut.current.play(label, mid);
  }, []);

  /** ページ / セクションの切り替え演出。HTML-in-Canvas が使えれば画面を割る、無ければ従来のカットイン */
  const transit = useCallback((label: CutInLabel, mid?: (() => void) | null) => {
    if (!canShatter()) return cutin(label, mid);
    return shatter(mid ?? null).then((r) => (r === 'failed' ? cutin(label, mid) : undefined));
  }, [cutin]);

  const focusView = useCallback(() => {
    const f = document.querySelector<HTMLElement>('#view [data-focus]');
    if (f) f.focus({ preventScroll: true });
    else keys.menu?.focusSel();
  }, [keys]);

  /** 現在の URL のページへ切り替える（pushState 後 / popstate で呼ぶ） */
  const show = useCallback(async () => {
    const r = currentRoute();
    const id = ++navId.current;
    tabRouteRef.current = r;
    setTabRoute(r);
    const swap = () => {
      if (id !== navId.current) return;
      keys.menu = null;
      keys.viewer = null;
      flushSync(() => setRoute(r));
      window.scrollTo(0, 0);
    };
    if (reduced()) {
      swap();
      focusView();
      viewRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'linear' });
      return;
    }
    await transit(cutLabel(r), () => { swap(); if (r.name === 'home') cascade(); });
    if (id !== navId.current) return;
    focusView();
  }, [transit, focusView, keys]);

  /** ホームを最初から: オープニングのカットインの裏でページを作り直し、先頭へ戻す */
  const restartHome = useCallback(async () => {
    const id = ++navId.current;
    const reset = () => {
      if (id !== navId.current) return;
      keys.menu = null;
      keys.viewer = null;
      flushSync(() => setEpoch((n) => n + 1));
      window.scrollTo(0, 0);
    };
    if (reduced()) { reset(); focusView(); return; }
    await cutin({ big: 'SHOW NO MERCY', kick: `${PROFILE.handle} / ${PROFILE.brand}` }, () => { reset(); cascade(); });
    if (id !== navId.current) return;
    focusView();
  }, [cutin, focusView, keys]);

  const navigate = useCallback((href: string) => {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) { window.location.assign(url.href); return; }
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      // ホームにいるときにロゴ / ホームを押したら最初から
      if (currentRoute().name === 'home') void restartHome();
      return;
    }
    window.history.pushState(null, '', url.pathname + url.search + url.hash);
    void show();
  }, [show, restartHome]);

  const api = useMemo<SiteApi>(() => ({ navigate, cutin, transit, keys }), [navigate, cutin, transit, keys]);

  // 正規の URL（末尾スラッシュ付き）にそろえる
  useEffect(() => {
    const canonical = pathOf(route);
    if (route.name !== 'notFound' && canonical !== window.location.pathname) {
      window.history.replaceState(null, '', canonical + window.location.search + window.location.hash);
    }
    const title = routeMeta(route).title;
    document.title = title;
    const live = document.getElementById('announce');
    if (live) live.textContent = title;
  }, [route]);

  // 初回: ホームなら「SHOW NO MERCY」のオープニング
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const onPop = () => { void show(); };
    window.addEventListener('popstate', onPop);
    let t: number | undefined;
    if (currentRoute().name === 'home' && !reduced()) {
      void cutin({ big: 'SHOW NO MERCY', kick: `${PROFILE.handle} / ${PROFILE.brand}` }, null);
      t = window.setTimeout(cascade, 380);
    }
    return () => { window.removeEventListener('popstate', onPop); window.clearTimeout(t); };
  }, [show, cutin]);

  // キーボード: Q / E でタブ移動、↑↓ でメニュー、← → Esc でスライド
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || !e.key) return;
      const tgt = e.target as HTMLElement | null;
      if (tgt && (/^(INPUT|TEXTAREA|SELECT)$/.test(tgt.tagName) || tgt.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if ((k === 'q' || k === 'e') && !e.shiftKey) {
        const i = Math.max(0, TABS.findIndex((t) => t.id === tabOf(tabRouteRef.current)));
        const ni = (i + (k === 'e' ? 1 : -1) + TABS.length) % TABS.length;
        navigate(TABS[ni].href);
        return;
      }
      if (keys.viewer) {
        if (e.key === 'ArrowRight') { e.preventDefault(); keys.viewer.go(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); keys.viewer.go(-1); }
        else if (e.key === 'Escape') { keys.viewer.back(); }
        return;
      }
      const menu = keys.menu;
      if (menu && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const d = e.key === 'ArrowDown' ? 1 : -1;
        if (menu.list.contains(document.activeElement)) { e.preventDefault(); menu.move(d); }
        else if ((document.activeElement === document.body || document.activeElement === viewRef.current) && window.scrollY < 120) {
          e.preventDefault();
          menu.focusSel();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [keys, navigate]);

  const onSkip = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const f = document.querySelector<HTMLElement>('#view [data-focus]') || viewRef.current;
    f?.focus();
  };

  return (
    <SiteContext.Provider value={api}>
      <a className="skip" href="#view" onClick={onSkip}>本文へ移動</a>
      <CutIn ref={cut} />
      <p className="vh" id="announce" aria-live="polite" />
      <Header active={tabOf(tabRoute)} />
      <main id="view" className="view" tabIndex={-1} ref={viewRef}>
        <Page key={pathOf(route) + (route.name === 'notFound' ? window.location.pathname : '') + (route.name === 'home' ? '#' + epoch : '')} route={route} />
      </main>
      <Footer />
    </SiteContext.Provider>
  );
}
