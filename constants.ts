import { WorkItem, NewsItem, ThemeConfig, ThemeId } from './types';

// ==========================================
// プロフィールデータ (Profile Data)
// ==========================================
export const PROFILE = {
  name: "町原 悠太",
  englishName: "Yuta Machihara",
  brand: "M Lab",
  university: "北海道大学 工学部 情報エレクトロニクス学科 2年",
  affiliation: "学生団体Nラボ 所属",
  bio: "Unity(C#)、Python、TypeScriptを駆使し、XRゲームや重機シミュレータ、Vket企業ブース、業務効率化Discord Botなどを開発。「設計から実装まで」をワンストップで担当します。<br />24時間戦える体力と「ワクワク」を原動力に、まだ見ぬ新しい体験を創造します。",
  heroImage: "https://assets.st-note.com/img/1768467914-4XvN6kDJLc8UFCWO0KeBREfn.png?width=1200",
  // ここにSNSや連絡先のURLを入力してください
  social: {
    github: "https://github.com/kociden/", // あなたのGitHubプロフィールURL
    email: "kociden28@gmail.com" // お問い合わせ用メールアドレス
  }
};

// ==========================================
// 実績データ (Works Data)
// ==========================================
export const WORKS_DATA: WorkItem[] = [
  {
    id: 'xr-1',
    title: 'Immersive XR Game Project',
    image: 'https://picsum.photos/id/15/800/600', // Placeholder for XR Game
    description: 'Unity(C#)を用いた没入型XRアクションゲーム。プレイヤーの動作と連動したリアルタイム物理演算と、視覚効果にこだわったパーティクルシステムを実装。企画からモデリング、実装までを一貫して担当。',
    techStack: ['Unity', 'C#', 'XR Interaction Toolkit', 'Blender'],
  },
  {
    id: 'sim-1',
    title: 'Heavy Machinery Simulator',
    image: 'images/bhsim.png', // Placeholder for Simulator
    description: '産業用の重機操作トレーニングシミュレータ。<br />実機の操作パネルと連動し、物理エンジンを活用して土砂の挙動や機体の振動をリアルに再現。<br />安全教育コストの削減に貢献。',
    techStack: ['Unity', 'C#', 'PhysX', 'Hardware Integration'],
  },
  {
    id: 'vket-1',
    title: 'Vket Corporate Booth',
    image: 'images/vketsummer.png', // Placeholder for Vket
    description: 'バーチャルマーケット（VketSummer2025）における企業出展ブースの制作。ブランドの世界観をVR空間に落とし込み、来場者が楽しめるインタラクティブなギミックを多数配置。',
    techStack: ['Unity', 'Udon#', 'VRChat SDK', '3D Design'],
    url: 'https://vket.com'
  },
  {
    id: 'bot-1',
    title: 'Enterprise Discord Bot',
    image: 'https://picsum.photos/id/60/800/600', // Placeholder for Bot
    description: '大規模コミュニティ向けの管理・業務自動化Bot。ロール管理、問い合わせ自動応答、外部API連携機能を実装。24時間365日の安定稼働を実現。',
    techStack: ['Python', 'JavaScript', 'Discord.js', 'Docker'],
  },
  {
    id: 'web-1',
    title: 'M-Lab Portfolio',
    image: 'https://picsum.photos/id/1/800/600',
    description: '現在閲覧いただいているポートフォリオサイト。Next.js (React) とTypeScriptで構築し、10種類のテーマ切り替え機能を実装。パフォーマンスとアクセシビリティを考慮した設計。',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
  }
];

// ==========================================
// ニュースデータ (News Data)
// contentには詳細本文を記載します（HTMLタグ使用可能）
// ==========================================
export const NEWS_DATA: NewsItem[] = [
  {
    id: 'n1',
    date: '2026.1.17',
    title: 'Mラボを開業しました',
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

// ==========================================
// デザインテーマ (Themes)
// ==========================================
export const THEMES: Record<ThemeId, ThemeConfig> = {
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      light: { bg: '#ffffff', text: '#1a1a1a', accent: '#000000', card: '#f4f4f5', cardText: '#1a1a1a', muted: '#71717a' },
      dark: { bg: '#09090b', text: '#fafafa', accent: '#ffffff', card: '#18181b', cardText: '#fafafa', muted: '#a1a1aa' }
    },
    styles: { rounded: '0px', font: 'sans-serif', shadow: 'none', border: '1px solid #e4e4e7' }
  },
  'dark-dev': {
    id: 'dark-dev',
    name: 'Dev Terminal',
    colors: {
      light: { bg: '#eef2f6', text: '#1e293b', accent: '#16a34a', card: '#ffffff', cardText: '#1e293b', muted: '#64748b' },
      dark: { bg: '#09090b', text: '#e4e4e7', accent: '#22c55e', card: '#18181b', cardText: '#e4e4e7', muted: '#a1a1aa' }
    },
    styles: { rounded: '4px', font: 'monospace', shadow: 'none', border: '1px solid #27272a' }
  },
  'hokkaido-snow': {
    id: 'hokkaido-snow',
    name: 'Hokkaido Snow',
    colors: {
      light: { bg: '#f0f9ff', text: '#334155', accent: '#38bdf8', card: '#ffffff', cardText: '#334155', muted: '#94a3b8' },
      dark: { bg: '#0f172a', text: '#e2e8f0', accent: '#7dd3fc', card: '#1e293b', cardText: '#f1f5f9', muted: '#94a3b8' }
    },
    styles: { rounded: '16px', font: 'sans-serif', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      light: { bg: '#e0e0e0', text: '#2a0a2a', accent: '#d000d0', card: '#f5f5f5', cardText: '#008080', muted: '#a030a0' },
      dark: { bg: '#050505', text: '#ffff00', accent: '#ff00ff', card: '#1a1a1a', cardText: '#00ffff', muted: '#d946ef' }
    },
    styles: { rounded: '0px', font: 'sans-serif', shadow: '4px 4px 0px var(--color-accent)', border: '2px solid var(--color-card-text)' }
  },
  'forest': {
    id: 'forest',
    name: 'Organic Forest',
    colors: {
      light: { bg: '#f7fee7', text: '#14532d', accent: '#65a30d', card: '#ffffff', cardText: '#365314', muted: '#84a98c' },
      dark: { bg: '#1a2e05', text: '#ecfccb', accent: '#a3e635', card: '#365314', cardText: '#ecfccb', muted: '#bef264' }
    },
    styles: { rounded: '8px', font: 'serif', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid var(--color-accent)' }
  },
  'corporate': {
    id: 'corporate',
    name: 'Trust Blue',
    colors: {
      light: { bg: '#f8fafc', text: '#0f172a', accent: '#2563eb', card: '#ffffff', cardText: '#1e293b', muted: '#64748b' },
      dark: { bg: '#020617', text: '#f8fafc', accent: '#3b82f6', card: '#1e293b', cardText: '#f1f5f9', muted: '#94a3b8' }
    },
    styles: { rounded: '6px', font: 'sans-serif', shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', border: '1px solid var(--color-muted)' }
  },
  'sunset': {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      light: { bg: '#fff7ed', text: '#7c2d12', accent: '#ea580c', card: '#fff', cardText: '#7c2d12', muted: '#fdba74' },
      dark: { bg: '#431407', text: '#ffedd5', accent: '#fb923c', card: '#7c2d12', cardText: '#ffedd5', muted: '#fdba74' }
    },
    styles: { rounded: '24px', font: 'sans-serif', shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: 'none' }
  },
  'luxury': {
    id: 'luxury',
    name: 'Mono Luxury',
    colors: {
      light: { bg: '#fcfcfc', text: '#8a6d3b', accent: '#111111', card: '#ffffff', cardText: '#8a6d3b', muted: '#999999' },
      dark: { bg: '#000000', text: '#d4af37', accent: '#ffffff', card: '#111111', cardText: '#d4af37', muted: '#525252' }
    },
    styles: { rounded: '2px', font: 'serif', shadow: 'none', border: '1px solid var(--color-text)' }
  },
  'retro-pop': {
    id: 'retro-pop',
    name: 'Retro Pop',
    colors: {
      light: { bg: '#fef08a', text: '#000000', accent: '#ef4444', card: '#ffffff', cardText: '#000000', muted: '#4b5563' },
      dark: { bg: '#4c1d95', text: '#fef08a', accent: '#f472b6', card: '#2e1065', cardText: '#fef08a', muted: '#ddd6fe' }
    },
    styles: { rounded: '12px', font: 'sans-serif', shadow: '6px 6px 0px 0px var(--color-text)', border: '3px solid var(--color-text)' }
  },
  'glass': {
    id: 'glass',
    name: 'Glass',
    colors: {
      light: { bg: '#e0e7ff', text: '#4338ca', accent: '#6366f1', card: 'rgba(255, 255, 255, 0.4)', cardText: '#3730a3', muted: '#818cf8' },
      dark: { bg: '#312e81', text: '#e0e7ff', accent: '#818cf8', card: 'rgba(0, 0, 0, 0.3)', cardText: '#e0e7ff', muted: '#a5b4fc' }
    },
    styles: { rounded: '16px', font: 'sans-serif', shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255, 255, 255, 0.18)' }
  }
};