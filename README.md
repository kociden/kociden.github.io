# M Lab / kociden portfolio

https://kociden.github.io/ のソース（Vite + React + TypeScript、素の CSS）。

## 構成

| パス | 内容 |
| --- | --- |
| `constants.ts` / `types.ts` | コンテンツ（プロフィール・スキル・制作物・ニュース・LT・イベント）と型 |
| `lib/routes.ts` | URL ⇔ ページの対応と、ページごとの title / description / OGP 画像（アプリとビルドで共通） |
| `App.tsx` | History API ルーター、カットイン遷移、キー操作（Q/E・↑↓・←→/Esc） |
| `components/` | ヘッダー/フッター、カットイン、ホーム（コマンドメニュー・HUD・ステータス）、各ページ |
| `styles.css` | 全スタイル |
| `scripts/prerender.ts` | ビルド後に `dist/<route>/index.html` と `dist/404.html` を書き出す Vite プラグイン |
| `public/assets/`, `public/lt/` | サイトの画像・LT スライド |
| `public/` のその他のフォルダ | 独立した静的サブサイト（`/sakimise/` など）。そのまま `dist/` にコピーされる |

URL は `/`, `/works/`, `/lt/`, `/lt/<slug>/`, `/events/`, `/news/`, `/news/<id>/`。
GitHub Pages で直接開けるよう、ビルド時にルートごとの静的 HTML（OGP 付き）を生成します。
新しいルートを足すときは `public/` のフォルダ名と被らないようにしてください（被るとビルドが止まります）。

本名はサイトのどこにも出さない方針です（表示名は kociden / M Lab）。

## LT を追加する

1. スライドを **1280×720 の webp** で書き出し、`public/lt/<slug>/slide-01.webp`, `slide-02.webp`, … と置く（`<slug>` は URL になる英数字とハイフン）。
2. `constants.ts` の `TALKS` の先頭にエントリを追加する:

   ```ts
   {
     slug: 'my-talk',
     title: 'タイトル',
     subtitle: 'サブタイトル',
     date: '2026.12',
     event: 'イベント名',          // 空なら表示しない
     minutes: 5,
     tags: ['Tag1', 'Tag2'],
     cover: '/lt/my-talk/slide-01.webp', // 一覧と OGP 画像に使う
     slides: slideList('my-talk', 12),   // 枚数
     summary: '概要',
   },
   ```

3. `npm run build` すると `/lt/my-talk/` のページ（OGP 付き）ができます。「準備中」の枠（`placeholder: true`）は不要になったら消してください。

ニュースは `NEWS` に `{ id, date, title, tag, content }` を足すと `/news/<id>/` ができます。

## 開発・ビルド・デプロイ

```sh
npm ci            # 依存関係のインストール
npm run dev       # 開発サーバー
npm run build     # 型チェック → vite build → ルートごとの HTML 生成（dist/）
npm run preview   # dist の確認
npm run deploy    # build して dist を gh-pages ブランチへ公開
```

## クレジット

ロゴの猫アイコンは [Twemoji](https://github.com/twitter/twemoji)（CC-BY 4.0）。
