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
  bio: "Mラボ代表。Unity(C#)、Python、TypeScriptを駆使し、XRゲームや重機シミュレータ、Vket企業ブース、業務効率化Discord Botなどを開発。「設計から実装まで」をワンストップで担当します。24時間戦える体力と「ワクワク」を原動力に、まだ見ぬ新しい体験を創造します。",
  heroImage: "https://assets.st-note.com/img/1768467914-4XvN6kDJLc8UFCWO0KeBREfn.png?width=1200",
  // ここにSNSや連絡先のURLを入力してください
  social: {
    github: "https://github.com/", // あなたのGitHubプロフィールURL
    email: "machihara@mlab.example.com" // お問い合わせ用メールアドレス
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
    image: 'https://picsum.photos/id/119/800/600', // Placeholder for Simulator
    description: '産業用の重機操作トレーニングシミュレータ。実機の操作パネルと連動し、物理エンジンを活用して土砂の挙動や機体の振動をリアルに再現。安全教育コストの削減に貢献。',
    techStack: ['Unity', 'C#', 'PhysX', 'Hardware Integration'],
  },
  {
    id: 'vket-1',
    title: 'Vket Corporate Booth',
    image: 'https://picsum.photos/id/48/800/600', // Placeholder for Vket
    description: 'バーチャルマーケット（Vket）における企業出展ブースの制作。ブランドの世界観をVR空間に落とし込み、来場者が楽しめるインタラクティブなギミックを多数配置。',
    techStack: ['Unity', 'Udon', 'VRChat SDK', '3D Design'],
    url: 'https://vket.com'
  },
  {
    id: 'bot-1',
    title: 'Enterprise Discord Bot',
    image: 'https://picsum.photos/id/60/800/600', // Placeholder for Bot
    description: '大規模コミュニティ向けの管理・業務自動化Bot。PythonとTypeScriptを併用し、ロール管理、問い合わせ自動応答、外部API連携機能を実装。24時間365日の安定稼働を実現。',
    techStack: ['Python', 'TypeScript', 'Discord.js', 'Docker', 'AWS'],
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
    date: '2023.12.10',
    title: 'Mラボ (M Lab) を開業しました',
    thumbnail: 'https://picsum.photos/id/101/400/300',
    content: `
      <p>この度、個人事業主として「Mラボ (M Lab)」を開業いたしました。<br>
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
  {
    id: 'n2',
    date: '2023.11.25',
    title: '学生団体Nラボでの活動がメディアに掲載されました',
    thumbnail: 'https://picsum.photos/id/102/400/300',
    content: `
      <p>所属している学生団体「Nラボ」での活動の様子が、地元メディアに取り上げられました。</p>
      <p>記事では、私たちが取り組んでいる地域課題解決のためのアプリ開発プロジェクトについて詳しく紹介されています。</p>
      <p>私たちは技術の力で北海道を盛り上げるべく、日々活動しています。今後もハッカソンへの参加や勉強会の主催などを通じて、技術力の向上とコミュニティへの貢献を目指します。</p>
    `
  },
  {
    id: 'n3',
    date: '2023.11.01',
    title: '新作XRゲームのα版テストを開始しました',
    thumbnail: 'https://picsum.photos/id/103/400/300',
    content: `
      <p>現在開発中のVRアクションゲーム「Cyber Slash (仮)」のα版テストを開始しました。</p>
      <p>本作は、物理演算を駆使した爽快な剣劇アクションが特徴です。Oculus Quest 2およびPCVRに対応予定です。</p>
      <p>テストにご協力いただける方は、お問い合わせフォームよりご連絡ください。フィードバックを元に、さらなるクオリティアップを目指して開発を進めてまいります。</p>
    `
  },
  {
    id: 'n4',
    date: '2023.10.15',
    title: '技術ブログ「Tech M」を開設しました',
    thumbnail: 'https://picsum.photos/id/104/400/300',
    content: `
      <p>日々の開発で得た知見や、新しい技術への挑戦を記録するためのブログ「Tech M」を開設しました。</p>
      <p>主に以下のトピックについて発信していく予定です。</p>
      <ul>
        <li>Next.js / TypeScript の実践的なTips</li>
        <li>Unity / C# の最適化テクニック</li>
        <li>電子工作とIoTの連携実験</li>
      </ul>
      <p>アウトプットを通じて自身の理解を深めるとともに、同じ技術を学ぶ方々の参考になれば幸いです。</p>
    `
  },
  {
    id: 'n5',
    date: '2023.09.20',
    title: '重機シミュレータのデモ動画を公開',
    content: `
      <p>建設会社様向けに開発を行った「重機操作トレーニングシミュレータ」のデモ動画を公開しました。</p>
      <p>実機に近い操作感を再現するために、専用のコントローラー連携と物理エンジンのチューニングを行っています。<br>
      これにより、安全かつ低コストでの新人教育が可能となります。</p>
      <p>詳細はWorksページをご覧ください。</p>
    `
  }
];

// ==========================================
// デザインテーマ (Themes)
// ==========================================
export const THEMES: Record<ThemeId, ThemeConfig> = {
  'minimal': {
    id: 'minimal',
    name: 'Minimal White',
    colors: { bg: '#ffffff', text: '#1a1a1a', accent: '#000000', card: '#f4f4f5', cardText: '#1a1a1a', muted: '#71717a' },
    styles: { rounded: '0px', font: 'sans-serif', shadow: 'none', border: '1px solid #e4e4e7' }
  },
  'dark-dev': {
    id: 'dark-dev',
    name: 'Dev Terminal',
    colors: { bg: '#09090b', text: '#e4e4e7', accent: '#22c55e', card: '#18181b', cardText: '#e4e4e7', muted: '#a1a1aa' },
    styles: { rounded: '4px', font: 'monospace', shadow: 'none', border: '1px solid #27272a' }
  },
  'hokkaido-snow': {
    id: 'hokkaido-snow',
    name: 'Hokkaido Snow',
    colors: { bg: '#f0f9ff', text: '#334155', accent: '#38bdf8', card: '#ffffff', cardText: '#334155', muted: '#94a3b8' },
    styles: { rounded: '16px', font: 'sans-serif', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: { bg: '#050505', text: '#ffff00', accent: '#ff00ff', card: '#1a1a1a', cardText: '#00ffff', muted: '#d946ef' },
    styles: { rounded: '0px', font: 'sans-serif', shadow: '4px 4px 0px #ff00ff', border: '2px solid #00ffff' }
  },
  'forest': {
    id: 'forest',
    name: 'Organic Forest',
    colors: { bg: '#f7fee7', text: '#14532d', accent: '#65a30d', card: '#ffffff', cardText: '#365314', muted: '#84a98c' },
    styles: { rounded: '8px', font: 'serif', shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid #d9f99d' }
  },
  'corporate': {
    id: 'corporate',
    name: 'Trust Blue',
    colors: { bg: '#f8fafc', text: '#0f172a', accent: '#2563eb', card: '#ffffff', cardText: '#1e293b', muted: '#64748b' },
    styles: { rounded: '6px', font: 'sans-serif', shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0' }
  },
  'sunset': {
    id: 'sunset',
    name: 'Sunset Gradient',
    colors: { bg: '#fff7ed', text: '#7c2d12', accent: '#ea580c', card: '#fff', cardText: '#7c2d12', muted: '#fdba74' },
    styles: { rounded: '24px', font: 'sans-serif', shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: 'none' }
  },
  'luxury': {
    id: 'luxury',
    name: 'Mono Luxury',
    colors: { bg: '#000000', text: '#d4af37', accent: '#ffffff', card: '#111111', cardText: '#d4af37', muted: '#525252' },
    styles: { rounded: '2px', font: 'serif', shadow: 'none', border: '1px solid #d4af37' }
  },
  'retro-pop': {
    id: 'retro-pop',
    name: 'Retro Pop',
    colors: { bg: '#fef08a', text: '#000000', accent: '#ef4444', card: '#ffffff', cardText: '#000000', muted: '#4b5563' },
    styles: { rounded: '12px', font: 'sans-serif', shadow: '6px 6px 0px 0px #000000', border: '3px solid #000000' }
  },
  'glass': {
    id: 'glass',
    name: 'Glassmorphism',
    colors: { bg: '#c084fc', text: '#ffffff', accent: '#e879f9', card: 'rgba(255, 255, 255, 0.2)', cardText: '#ffffff', muted: '#e9d5ff' },
    styles: { rounded: '16px', font: 'sans-serif', shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255, 255, 255, 0.18)' }
  }
};