// サイト全体のデータ型。constants.ts の中身はこの型に従う。
// lib/routes.ts と scripts/prerender.ts（ビルド時に Node で実行）からも import されるので、
// ここと constants.ts には DOM / React に依存するものを書かないこと。

export interface Profile {
  handle: string;      // 表示名（本名は載せない）
  school: string;
  bio: string;         // 自己紹介文
  others: string;      // 他己紹介（三人称の紹介文）
  now: string;         // いま取り組んでいること
  award: string;       // 主な受賞
  brand: string;
  role: string;
  location: string;
  tagline: string;
  intro: string;
  goal: string;
  dream: string;
  github: string;
  email: string;
}

// ホーム右側の写真枠で順番に流す写真
export interface HeroPhoto {
  src: string;
  caption: string;
  alt: string;
  href?: string;       // キャプションのリンク先（サイト内）
  color?: boolean;     // 赤のモノトーンにせず、色を残す（明るい画面やイラスト向け）
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  desc: string;
  tech: string[];
  url?: string;        // 公開ページ（タイトルがリンクになる）
  page?: string;       // サイト内の詳細ページ（url より優先。/games/<slug>/ など）
  badge?: string;      // 画像の上に出す札（'開発中' など）
}

export interface NewsItem {
  id: string;          // URL になる: /news/<id>/
  date: string;        // YYYY.MM.DD
  title: string;
  tag?: string;        // 'Award' | 'Info' | 自由
  url?: string;        // 関連する外部ページ（任意）
  content?: string;    // 詳細本文（HTML 可・信頼できる自前の文章のみ）
  image?: string;      // 詳細ページの写真（任意）
  imageAlt?: string;
}

export interface Talk {
  slug: string;        // URL になる: /lt/<slug>/ 。スライドは public/lt/<slug>/ に置く
  title: string;
  subtitle: string;
  date: string;
  event?: string;
  minutes: number;
  tags: string[];
  cover: string;       // 一覧・OGP に使う画像
  slides: string[];
  summary: string;
  placeholder?: boolean; // true のものは「準備中」カードとして一覧に出るだけ（ページは作らない）
}

export interface EventItem {
  title: string;
  subtitle: string;
  role: string;
  org: string;
  date: string;        // YYYY.MM.DD（JST）
  time: string;        // '9:00〜21:00' の形式。カウントダウンに使う
  place: string;
  capacity: number;
  fee: string;
  sponsors: string[];
  summary: string;
  hashtag: string;
  image: string;
  url: string;
}

// 開発中・発売済みのゲーム（/games/<slug>/ に紹介ページができる）
export interface GameLink {
  kind: 'post' | 'x' | 'youtube' | 'store' | 'demo';
  label: string;       // 小見出し（'X（開発アカウント）' など）
  text: string;        // リンクの文字
  href: string;
}

export interface GameItem {
  slug: string;        // URL になる: /games/<slug>/
  title: string;
  subtitle: string;    // 副題
  en: string;          // 英題
  status: string;      // '開発中' など
  catch: string;       // ひとことのキャッチ
  genre: string;
  release: string;     // 外に出す発売時期の表記
  platform: string;
  circle: string;      // 発売元（サークル名）
  role: string;        // kociden の担当
  story: string;       // あらすじ
  features: { t: string; d: string }[];
  tags: string[];
  hero: string;        // ページ上部の横長の絵（文字なし）
  card: string;        // 一覧・ホームの 16:9 の絵
  ogp: string;         // 共有用 1200x630
  shots: { src: string; alt: string; caption: string }[];
  links: GameLink[];   // X・YouTube など、ゲームの発信先（個人の連絡先とは分ける）
}
