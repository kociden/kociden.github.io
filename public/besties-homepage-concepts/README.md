# ホームページ・デザイン案

本番サイトには含まれない、独立した静的プレビューです。10案とも掲載内容とページ構成は共通で、デザインだけが異なります。

## 閲覧方法

起点の `index.html` をブラウザで開くと、10案の比較ハブが表示されます。各カードから日本語版トップページへ移動できます。

ファイルを共有するときは、この `homepage-concepts` フォルダを構成を変えずに丸ごとZIP化してください。ローカルHTTPサーバーで確認する場合は、このフォルダ内で `npx serve .` を実行します。

## 構成

- `index.html`: 10案の比較ハブ
- `concepts/01`〜`concepts/10`: 各デザイン案
- 各案の `site/ja`、`site/en`、`site/zh`: 3言語の静的サイト
- 各言語10ページ: ホーム、会社概要、ニュース一覧、ニュース詳細3件、公告、取引先、お問い合わせ、情報セキュリティ基本方針
- 各案の `assets`: Logo、Hero画像、セクション背景画像、CSS、JavaScript

合計は10案 × 3言語 × 10ページ = 300 HTMLです。

## 再生成と検証

```powershell
node generate-sites.js
node verify-sites.js
```

`verify-sites.js` は300 HTMLの存在と、ローカルのリンク・画像・CSS・JavaScript参照を検査します。

このフォルダはNext.jsの `src`、`public`、ビルド成果物 `out` の外にあり、通常の本番ビルドやデプロイには含まれません。
