// ビルド時にルートごとの静的 HTML を書き出す Vite プラグイン。
//
// GitHub Pages は SPA の History API ルートを知らないので、/works/ や /lt/<slug>/ を直接開くと 404 になる。
// そこで vite build の最後に dist/index.html を複製して dist/<route>/index.html を作り、
// それぞれに <title> / description / OGP / canonical を入れる（SNS のプレビュー用）。
// dist/404.html は未知の URL 用の SPA フォールバック。
//
// ルート一覧とメタ情報は lib/routes.ts（アプリと共通）から取るので、手で二重管理しない。
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { PROFILE } from '../constants';
import { SITE_URL, pathOf, routeMeta, staticRoutes, type PageMeta, type Route } from '../lib/routes';

const PLACEHOLDER = '<!--app-meta-->';
const START = '<!--meta:start-->';
const END = '<!--meta:end-->';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const abs = (p: string) => (/^https?:\/\//.test(p) ? p : SITE_URL + (p.startsWith('/') ? p : '/' + p));

function metaBlock(m: PageMeta, opts: { notFound?: boolean } = {}): string {
  const url = abs(m.path);
  const img = abs(m.image);
  const lines = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    opts.notFound ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:type" content="${m.type}">`,
    `<meta property="og:site_name" content="${esc(PROFILE.brand)}">`,
    `<meta property="og:locale" content="ja_JP">`,
    `<meta property="og:title" content="${esc(m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    opts.notFound ? '' : `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(img)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(m.title)}">`,
    `<meta name="twitter:description" content="${esc(m.description)}">`,
    `<meta name="twitter:image" content="${esc(img)}">`,
  ].filter(Boolean);
  return `${START}\n    ${lines.join('\n    ')}\n    ${END}`;
}

function replaceBlock(html: string, block: string): string {
  const a = html.indexOf(START);
  const b = html.indexOf(END);
  if (a < 0 || b < a) throw new Error('[route-meta] meta block markers not found in built index.html');
  return html.slice(0, a) + block + html.slice(b + END.length);
}

export default function routeMetaPlugin(): Plugin {
  let outDir = '';
  let isBuild = false;
  return {
    name: 'route-meta',
    configResolved(c) {
      isBuild = c.command === 'build' && !c.build.ssr;
      outDir = path.resolve(c.root, c.build.outDir);
    },
    // dev / build 共通: index.html にホームのメタを入れる
    transformIndexHtml(html) {
      if (!html.includes(PLACEHOLDER)) throw new Error(`[route-meta] ${PLACEHOLDER} not found in index.html`);
      return html.replace(PLACEHOLDER, metaBlock(routeMeta({ name: 'home' })));
    },
    // build のみ: ルートごとの HTML を書き出す
    closeBundle() {
      if (!isBuild) return;
      const indexFile = path.join(outDir, 'index.html');
      const template = fs.readFileSync(indexFile, 'utf8');
      const written: string[] = [];
      const write = (rel: string, html: string, mustBeNew: boolean) => {
        const file = path.join(outDir, rel);
        // public/ の静的サブサイト（/sakimise/ など）を上書きしないための安全装置
        if (mustBeNew && fs.existsSync(file)) {
          throw new Error(`[route-meta] ${rel} already exists in dist (collides with a file from public/). Rename the route.`);
        }
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
        written.push(rel);
      };
      for (const r of staticRoutes() as Route[]) {
        const p = pathOf(r);
        const html = replaceBlock(template, metaBlock(routeMeta(r)));
        if (p === '/') write('index.html', html, false);
        else write(path.join(...p.split('/').filter(Boolean), 'index.html'), html, true);
      }
      write('404.html', replaceBlock(template, metaBlock(routeMeta({ name: 'notFound' }), { notFound: true })), true);
      console.log(`\n[route-meta] wrote ${written.length} files: ${written.map((w) => w.replace(/\\/g, '/')).join(', ')}`);
    },
  };
}
