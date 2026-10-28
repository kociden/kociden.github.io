// サイト全体のデータ型。constants.ts の中身はこの型に従う。
// lib/routes.ts と scripts/prerender.ts（ビルド時に Node で実行）からも import されるので、
// ここと constants.ts には DOM / React に依存するものを書かないこと。

export interface Profile {
  handle: string;      // 表示名
  realName: string;    // 本名（ホームの自己紹介にだけ出す）
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
