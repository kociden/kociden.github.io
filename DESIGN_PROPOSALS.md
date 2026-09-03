# デザイン案（redesign/modern-portfolio ブランチ）

3案を同じ React アプリ内に実装しています。画面左下のスイッチャー、または URL の `?design=` で切り替えられます。

| ID | 案 | 参考にしたサイト | ファイル |
|----|----|----|----|
| `signal` | A. Signal — ダーク × グリッド × モノスペース | linear.app / vercel.com | `designs/signal/SignalSite.tsx` |
| `bento` | B. Bento — ガラス質タイルグリッド | Apple 製品ページ / raycast.com / bento.me | `designs/bento/BentoSite.tsx` |
| `editorial` | C. Editorial — 明朝 × 余白 × 大型タイポ | Awwwards 系スタジオサイト（Locomotive, SHIFTBRAIN など） | `designs/editorial/EditorialSite.tsx` |

## 採用案が決まったら
1. `App.tsx` の切替ロジックと `components/DesignSwitcher.tsx` を削除し、採用案のコンポーネントだけを描画する
2. `types.ts` の `DESIGNS` / `DesignId` と、不採用案の `designs/*` を削除する
3. `styles.css` の不要セクション（A/B/C）を削除する

## その他の変更
- Tailwind を CDN から npm (PostCSS) ビルドに移行（`tailwind.config.js`, `postcss.config.js`, `styles.css`）
- 旧 10 テーマ切替機能を廃止
- `constants.ts` にニュース「札幌すごいAIハッカソン2026 HP賞」を追加。サムネイル用の写真を `public/images/news/sugoiai-2026-hp.jpg` に置いてください
- Works の `category` / `year` フィールドを追加
