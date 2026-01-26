# M Lab Portfolio Website

## 🚀 環境構築と起動

このプロジェクトは React + TypeScript + Vite で構築されています。

### 1. 依存関係のインストール
まず、必要なパッケージをインストールしてください。

```bash
npm install
```

### 2. ローカルでの開発サーバー起動
以下のコマンドでローカルサーバーが立ち上がります。

```bash
npm run dev
```

---

## 🌐 GitHub Pages へのデプロイ方法

以下の手順で、このサイトをGitHub Pagesに公開できます。

### 1. リポジトリの準備
GitHub上で新しいリポジトリを作成し、このコードをプッシュしてください。

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

### 2. デプロイコマンドの実行
以下のコマンドを実行すると、自動的にビルドが行われ、`gh-pages` ブランチを通じてサイトが公開されます。

```bash
npm run deploy
```

※ 初回実行時は、GitHubのリポジトリ設定 (Settings > Pages) で、Sourceが `gh-pages` ブランチになっていることを確認してください。

---

## 📁 コンテンツの編集方法

サイトの表示データはすべて **`constants.ts`** というファイルにまとめられています。
このファイルを書き換えるだけで、簡単にサイトの内容を更新できます。

### 1. プロフィールとSNSリンクの変更
`constants.ts` を開き、`PROFILE` オブジェクトを探してください。

```typescript
export const PROFILE = {
  name: "町原 悠太",
  // ...（中略）
  heroImage: "https://...", // トップページの背景画像URL
  
  // ▼ ここでSNSとメールアドレスを設定します
  social: {
    github: "https://github.com/あなたのID", 
    email: "contact@mlab.example.com" 
  }
};
```

### 2. 実績 (Works) の追加・編集
`WORKS_DATA` 配列にデータを追加してください。

```typescript
{
  id: 'unique-id-1',
  title: 'プロジェクト名',
  image: 'https://...',
  description: '説明文...',
  techStack: ['Unity', 'C#'],
  url: 'https://...'
},
```

### 3. ニュース (News) の投稿
`NEWS_DATA` 配列を編集してください。

---

## 🎨 デザインの切り替え
画面右下の**パレットボタン**から10種類のテーマを切り替えられます。
