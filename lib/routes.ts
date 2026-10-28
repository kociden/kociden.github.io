// ルート定義とページごとのメタ情報。
// アプリ（History API ルーター・document.title）と、ビルド時の静的 HTML 生成
// （scripts/prerender.ts）の両方がこのファイルを使う。DOM / React に依存させないこと。
import { EVENTS, NEWS, PROFILE, TALKS, WORKS } from '../constants';

export const SITE_URL = 'https://kociden.github.io';

export type Route =
  | { name: 'home' }
  | { name: 'works' }
  | { name: 'lt' }
  | { name: 'talk'; slug: string }
  | { name: 'events' }
  | { name: 'news' }
  | { name: 'newsDetail'; id: string }
  | { name: 'notFound' };

/** ヘッダーのタブ。順番は Q / E キーの移動順 */
export type TabId = 'home' | 'events' | 'works' | 'lt' | 'news';

export const realTalks = TALKS.filter((t) => !t.placeholder);
export const findTalk = (slug: string) => realTalks.find((t) => t.slug === slug);
export const findNews = (id: string) => NEWS.find((n) => n.id === id);

const decode = (s: string) => {
  try { return decodeURIComponent(s); } catch { return s; }
};

/** location.pathname → Route。末尾スラッシュ・index.html の有無は問わない */
export function parsePath(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean).map(decode);
  if (parts[parts.length - 1] === 'index.html') parts.pop();
  const [a, b, ...rest] = parts;
  if (rest.length) return { name: 'notFound' };
  if (!a) return { name: 'home' };
  if (a === 'works' && !b) return { name: 'works' };
  if (a === 'events' && !b) return { name: 'events' };
  if (a === 'lt') return b ? { name: 'talk', slug: b } : { name: 'lt' };
  if (a === 'news') return b ? { name: 'newsDetail', id: b } : { name: 'news' };
  return { name: 'notFound' };
}

/** Route → 正規の URL パス（常に末尾スラッシュ付き） */
export function pathOf(r: Route): string {
  switch (r.name) {
    case 'home': return '/';
    case 'works': return '/works/';
    case 'lt': return '/lt/';
    case 'talk': return `/lt/${encodeURIComponent(r.slug)}/`;
    case 'events': return '/events/';
    case 'news': return '/news/';
    case 'newsDetail': return `/news/${encodeURIComponent(r.id)}/`;
    case 'notFound': return '/404.html';
  }
}

export function tabOf(r: Route): TabId | null {
  switch (r.name) {
    case 'home': return 'home';
    case 'works': return 'works';
    case 'lt': case 'talk': return 'lt';
    case 'events': return 'events';
    case 'news': case 'newsDetail': return 'news';
    default: return null;
  }
}

export interface PageMeta {
  title: string;
  description: string;
  image: string;   // サイト内の絶対パス（/assets/...）
  path: string;    // 正規 URL のパス
  type: 'website' | 'article';
}

const DEFAULT_IMAGE = '/assets/satsueki-world.webp'; // 共有時の既定画像
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const clip = (s: string, n = 110) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export function routeMeta(r: Route): PageMeta {
  const sub = (t: string) => `${t} | ${PROFILE.handle}`;
  const base = { image: DEFAULT_IMAGE, path: pathOf(r), type: 'website' as const };
  switch (r.name) {
    case 'home':
      return { ...base, title: `${PROFILE.handle} | ${PROFILE.brand}`, description: `${PROFILE.handle}（${PROFILE.brand}）のポートフォリオ。${PROFILE.intro}` };
    case 'works':
      return { ...base, title: sub('Works'), description: `${PROFILE.handle} がこれまでに手がけた制作物 ${WORKS.length} 件。ゲーム、シミュレータ、VR 空間、自動化ツール。`, image: WORKS[0]?.image ?? DEFAULT_IMAGE };
    case 'lt': {
      const latest = realTalks[0];
      return { ...base, title: sub('LT'), description: `${PROFILE.handle} が登壇した LT のスライド ${realTalks.length} 本。すべてこのサイトで読めます。`, image: latest?.cover || DEFAULT_IMAGE };
    }
    case 'talk': {
      const t = findTalk(r.slug);
      if (!t) return { ...base, title: sub('LT'), description: 'この LT はまだ公開されていません。' };
      return { ...base, type: 'article', title: sub(t.title), description: clip(`${t.subtitle}。${t.summary}`, 160), image: t.cover || t.slides[0] || DEFAULT_IMAGE };
    }
    case 'events': {
      const ev = EVENTS[0];
      if (!ev) return { ...base, title: sub('イベント'), description: `${PROFILE.handle} が主催するイベント。` };
      return { ...base, title: sub('イベント'), description: clip(`${ev.title}（${ev.date} ${ev.time}）${ev.subtitle}。${ev.summary}`, 160), image: ev.image };
    }
    case 'news':
      return { ...base, title: sub('News'), description: `${PROFILE.handle}（${PROFILE.brand}）の受賞やお知らせなど、これまでの記録。` };
    case 'newsDetail': {
      const n = findNews(r.id);
      if (!n) return { ...base, title: sub('News'), description: 'お知らせが見つかりません。' };
      return { ...base, type: 'article', title: sub(n.title), description: clip(n.content ? stripHtml(n.content) : n.title) };
    }
    case 'notFound':
      return { ...base, title: sub('ページが見つかりません'), description: 'お探しのページは見つかりませんでした。' };
  }
}

/** ビルド時に静的 HTML を書き出すルート（プレースホルダの LT は除く） */
export function staticRoutes(): Route[] {
  return [
    { name: 'home' },
    { name: 'works' },
    { name: 'lt' },
    ...realTalks.map((t): Route => ({ name: 'talk', slug: t.slug })),
    { name: 'events' },
    { name: 'news' },
    ...NEWS.map((n): Route => ({ name: 'newsDetail', id: n.id })),
  ];
}
