import { WorkItem, NewsItem } from './types';

// ==========================================
// プロフィールデータ (Profile Data)
// ==========================================
export const PROFILE = {
  name: "町原 悠太",
  englishName: "Yuta Machihara",
  handle: "kociden",
  brand: "M Lab",
  role: "Game / XR Developer",
  university: "北海道大学 工学部 情報エレクトロニクス学科",
  affiliation: "学生団体Nラボ 所属",
  location: "Sapporo, Hokkaido, Japan",
  tagline: "ワクワクを、実装する。",
  bio: "Unity(C#)、Python、TypeScriptを駆使し、XRゲームや重機シミュレータ、Vket企業ブース、業務効率化Discord Botなどを開発。「設計から実装まで」をワンストップで担当します。24時間戦える体力と「ワクワク」を原動力に、まだ見ぬ新しい体験を創造します。",
  heroImage: "https://assets.st-note.com/img/1768467914-4XvN6kDJLc8UFCWO0KeBREfn.png?width=1200",
  // ここにSNSや連絡先のURLを入力してください
  social: {
    github: "https://github.com/kociden/", // あなたのGitHubプロフィールURL
    email: "kociden28@gmail.com" // お問い合わせ用メールアドレス
  }
};

// スキル一覧（About セクションで使用）
export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Engine', items: ['Unity', 'C#', 'XR Interaction Toolkit', 'PhysX', 'VRChat SDK / Udon#'] },
  { group: 'Language', items: ['C#', 'Python', 'TypeScript', 'JavaScript'] },
  { group: 'Web / Infra', items: ['React', 'Vite', 'Tailwind CSS', 'Docker', 'Discord.js'] },
  { group: 'Tools', items: ['Blender', 'Git', 'Figma', 'Generative AI'] },
];

// ==========================================
// 実績データ (Works Data)
// ==========================================
export const WORKS_DATA: WorkItem[] = [
  {
    id: 'xr-1',
    title: 'Immersive XR Game Project',
    category: 'XR Game',
    year: '2025',
    image: 'https://picsum.photos/id/15/800/600', // Placeholder for XR Game
    description: 'Unity(C#)を用いた没入型XRアクションゲーム。プレイヤーの動作と連動したリアルタイム物理演算と、視覚効果にこだわったパーティクルシステムを実装。企画からモデリング、実装までを一貫して担当。',
    techStack: ['Unity', 'C#', 'XR Interaction Toolkit', 'Blender'],
  },
  {
    id: 'sim-1',
    title: 'Heavy Machinery Simulator',
    category: 'Simulator',
    year: '2025',
    image: 'images/bhsim.png',
    description: '産業用の重機操作トレーニングシミュレータ。実機の操作パネルと連動し、物理エンジンを活用して土砂の挙動や機体の振動をリアルに再現。安全教育コストの削減に貢献。',
    techStack: ['Unity', 'C#', 'PhysX', 'Hardware Integration'],
  },
  {
    id: 'vket-1',
    title: 'Vket Corporate Booth',
    category: 'VR / Metaverse',
    year: '2025',
    image: 'images/vketsummer.png',
    description: 'バーチャルマーケット（VketSummer2025）における企業出展ブースの制作。ブランドの世界観をVR空間に落とし込み、来場者が楽しめるインタラクティブなギミックを多数配置。',
    techStack: ['Unity', 'Udon#', 'VRChat SDK', '3D Design'],
    url: 'https://vket.com'
  },
  {
    id: 'bot-1',
    title: 'Enterprise Discord Bot',
    category: 'Automation',
    year: '2024',
    image: 'https://picsum.photos/id/60/800/600', // Placeholder for Bot
    description: '大規模コミュニティ向けの管理・業務自動化Bot。ロール管理、問い合わせ自動応答、外部API連携機能を実装。24時間365日の安定稼働を実現。',
    techStack: ['Python', 'JavaScript', 'Discord.js', 'Docker'],
  },
  {
    id: 'web-1',
    title: 'M Lab Portfolio',
    category: 'Web',
    year: '2026',
    image: 'https://picsum.photos/id/1/800/600',
    description: '現在閲覧いただいているポートフォリオサイト。React (Vite) とTypeScriptで構築。パフォーマンスとアクセシビリティを考慮した設計。',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
  }
];

// ==========================================
// ニュースデータ (News Data)
// contentには詳細本文を記載します（HTMLタグ使用可能）
// 新しいものを上に追加してください
// ==========================================
export const NEWS_DATA: NewsItem[] = [
  {
    id: 'n2',
    date: '2026.08.29',
    title: '札幌すごいAIハッカソン2026でゲームのアセット生成自動化アプリを制作、企業賞（HP賞）を獲得しました',
    tag: 'Award',
    // 受賞写真をこのパスに配置してください: public/images/news/sugoiai-2026-hp.jpg
    thumbnail: 'images/news/sugoiai-2026-hp.jpg',
    url: 'https://hack-2026-summer.sugoiai.org/',
    content: `
      <p>2026年8月29日に Deep Tech CORE SAPPORO で開催された「<a href="https://hack-2026-summer.sugoiai.org/" target="_blank" rel="noopener noreferrer">札幌すごいAIハッカソン 2026夏</a>」に参加し、
      ゲーム開発におけるアセット生成を自動化するアプリ「ゲーム自動化」を制作しました。</p>

      <p>本作品は、株式会社日本HP様より企業賞「<strong>HP賞</strong>」をいただきました。</p>

      <h3>制作したもの</h3>
      <ul>
        <li>生成AIを活用し、ゲーム制作に必要なアセットを自動生成するアプリケーション</li>
        <li>企画・設計・実装までを一人で担当</li>
      </ul>

      <p>ご一緒した参加者の皆さま、運営の札幌すごいAI会の皆さま、スポンサー各社に感謝いたします。<br>
      今回の知見を活かし、引き続きゲーム開発の効率化と新しい体験づくりに取り組んでいきます。</p>
    `
  },
  {
    id: 'n1',
    date: '2026.01.17',
    title: 'Mラボを開業しました',
    tag: 'Info',
    thumbnail: 'https://picsum.photos/id/101/400/300',
    content: `
      <p>この度、個人事業主として「Mラボ」を開業いたしました。<br>
      北海道大学 工学部 情報エレクトロニクス学科での学びを活かしつつ、Web開発、XRコンテンツ制作、業務システム開発など、幅広い分野での課題解決に取り組んでまいります。</p>

      <h3>主な事業内容</h3>
      <ul>
        <li>Webアプリケーションの企画・開発・運用</li>
        <li>Unityを用いたXRコンテンツ（VR/AR）の制作</li>
        <li>業務効率化ツールの開発（Discord Bot等）</li>
        <li>IT技術に関するコンサルティング</li>
      </ul>

      <p>「ワクワクを実装する」を理念に、クライアント様の想いを形にするお手伝いをさせていただきます。<br>
      今後ともMラボをよろしくお願いいたします。</p>
    `
  },
];
