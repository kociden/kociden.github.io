import type { EventItem, NewsItem, Profile, SkillGroup, Talk, WorkItem } from './types';

// ==========================================
// サイトのコンテンツ
// ・画像などのパスは public/ からの絶対パス（/assets/...）で書く
// ・本名はどこにも載せない（表示名は handle / brand のみ）
// ・このファイルはビルド時の OGP 生成（scripts/prerender.ts）からも読まれる
// ==========================================

export const PROFILE: Profile = {
  handle: 'kociden',
  realName: '町原悠太',
  school: '北海道大学 工学部 情報学科',
  bio: '高校からゲーム制作をはじめ、今では 2D・3D ゲームから XR ゲームまで手がける。Claude Code や Codex などの AI を使いこなし、思いついたものを最速で形にする。',
  others: '思いついたら、もう作り始めている人。ハッカソンではゲームのアセット生成を自動化するアプリで企業賞を獲り、LT では自分の LoRA を学習させてみせる。VRChat の雪ミクのワールドから会社のホームページまで、頼まれたものは実装して返してくる。最近は「札幌でゲームを作る人を増やしたい」と、AI ゲームジャムを自分で立ち上げた。',
  now: 'ゲーム会社の立ち上げを準備中',
  brand: 'M Lab',
  role: 'Game / XR Developer',
  location: 'Sapporo, Hokkaido',
  tagline: 'ワクワクを、実装する。',
  intro: 'Unity・XR を軸に、ゲーム、シミュレータ、VR 空間、開発自動化ツールまでを設計から実装まで一気通貫で作ります。',
  goal: '有名なゲーム会社を作る',
  dream: 'サッカーチームを経営する',
  photo: '/assets/activity.webp', // 顔にモザイク済み（connpass 掲載版）
  photoCaption: '活動の様子',
  github: 'https://github.com/kociden/',
  email: 'kociden28@gmail.com',
};

export const SKILLS: SkillGroup[] = [
  { group: 'Engine', items: ['Unity', 'Godot', 'C#', 'XR Interaction Toolkit', 'PhysX', 'VRChat SDK / Udon#'] },
  { group: 'Language', items: ['C#', 'C++', 'Python', 'TypeScript', 'JavaScript'] },
  { group: 'Web / Infra', items: ['React', 'Vite', 'Tailwind CSS', 'Docker', 'Discord.js'] },
  { group: 'AI / Tools', items: ['Claude Code', 'Codex (ChatGPT)', 'Qwen-Image', 'ComfyUI', 'LoRA', 'Blender', 'Figma'] },
];

// ステータス欄で強調するスキル
export const HOT_SKILLS = ['Claude Code', 'Codex (ChatGPT)'];

// 主催・運営するイベント（先頭が「次のミッション」としてホームに出る）
export const EVENTS: EventItem[] = [
  {
    title: 'AI Gamejam Sapporo@北大',
    subtitle: '1日でゲームを作ろう。初心者歓迎・参加無料、懇親会（寿司）つき',
    role: '主催',
    org: '北海道大学ゲーム制作サークル Gamma',
    date: '2026.11.29',
    time: '9:00〜21:00',
    place: '北海道大学 オープンイノベーションハブ エンレイソウ 2F',
    capacity: 20,
    fee: '無料',
    sponsors: ['株式会社インフィニットループ', '株式会社EQUES', '東大発起業weekend'],
    summary: 'コードが書けなくても、AIを使えばゲームは作れる。大作は目指さず、「これ、面白いかも」という核が遊べるところまで1日で持っていき、最後はみんなで遊びあって発表します。',
    hashtag: '#AIGamejamSapporo',
    image: '/assets/aigamejam-2026.webp',
    url: 'https://gamma.connpass.com/event/409586/',
  },
];

export const WORKS: WorkItem[] = [
  {
    id: 'renewbage',
    title: 'ReNewBage',
    category: 'Game',
    year: '2026',
    image: '/assets/renewbage.webp',
    desc: 'SapporoGameCamp2026 のチーム制作。ゴミを拾って、まぜて、売りまくるリサイクル工場アクション。フルスタック開発を担当。',
    tech: ['Unity', 'C#'],
    url: 'https://unityroom.com/games/renewbage',
  },
  {
    id: 'besties-site',
    title: '株式会社bestIEs コーポレートサイト',
    category: 'Web',
    year: '2026',
    image: '/assets/besties-site.webp',
    desc: '農業DX・ITコンサルと台湾茶を手がける株式会社bestIEs のホームページ。日本語・英語・中国語の3言語対応。実装をすべて担当。',
    tech: ['Next.js', 'Tailwind CSS'],
    url: 'https://best-ies.com/ja/',
  },
  {
    id: 'satsueki-world',
    title: 'さつえき.world',
    category: 'VR / Metaverse',
    year: '2025',
    image: '/assets/satsueki-world.webp',
    desc: '札幌駅南口駅前広場をモデルにした VRChat ワールド。通年 ver と「雪ミク in JRタワー」の雪ミク ver で、VRChat ワールドへの実装（Unity）を担当。',
    tech: ['Unity', 'Udon#', 'VRChat SDK'],
    url: 'https://yukimiku-jrtwr.com/events/world',
  },
  {
    id: 'bhsim',
    title: 'Heavy Machinery Simulator',
    category: 'Simulator',
    year: '2025',
    image: '/assets/bhsim.webp',
    desc: '実機の操作パネルと連動する重機トレーニングシミュレータ。土砂の挙動や機体の振動を物理エンジンで再現。',
    tech: ['Unity', 'C#', 'PhysX'],
  },
  {
    id: 'vket',
    title: 'Vket Corporate Booth',
    category: 'VR / Metaverse',
    year: '2025',
    image: '/assets/vketsummer.webp',
    desc: 'VketSummer2025 の企業出展ブース。ブランドの世界観を VR 空間に落とし込み、ギミックを多数配置。',
    tech: ['Unity', 'Udon#', 'VRChat SDK'],
  },
  {
    id: 'xr-game',
    title: 'Immersive XR Game',
    category: 'XR Game',
    year: '2025',
    image: 'https://picsum.photos/id/15/800/600',
    desc: 'プレイヤーの動作と連動する物理演算とパーティクルにこだわった没入型 XR アクション。',
    tech: ['Unity', 'XR Toolkit', 'Blender'],
  },
  {
    id: 'discord-bot',
    title: 'Enterprise Discord Bot',
    category: 'Automation',
    year: '2024',
    image: 'https://picsum.photos/id/60/800/600',
    desc: 'ロール管理・問い合わせ自動応答・外部 API 連携を備えた大規模コミュニティ向け Bot。',
    tech: ['Python', 'Discord.js', 'Docker'],
  },
];

// ==========================================
// ニュース（/news/<id>/ に詳細ページができる）
// content は詳細本文（HTML 可）。新しいものを上に追加。
// ==========================================
export const NEWS: NewsItem[] = [
  {
    id: 'n2',
    date: '2026.08.29',
    title: '札幌すごいAIハッカソン2026でゲームのアセット生成自動化アプリを制作、企業賞（HP賞）を獲得しました',
    tag: 'Award',
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
    `,
  },
  {
    id: 'n1',
    date: '2026.01.17',
    title: 'Mラボを開業しました',
    tag: 'Info',
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
    `,
  },
];

// ==========================================
// LT（/lt/<slug>/ に個別ページができる）
// スライドは 1280x720 の webp を public/lt/<slug>/slide-01.webp, slide-02.webp ... に置く
// 新しいものを上に追加（一覧の #番号は自動で振られる）
// ==========================================
const slideList = (slug: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/lt/${slug}/slide-${String(i + 1).padStart(2, '0')}.webp`);

export const TALKS: Talk[] = [
  {
    slug: 'opus55-gamedev',
    title: 'Opus 5.5でゲーム制作が段違いに変わった話',
    subtitle: '実装の99%をAIに任せて、2日でゲームを公開した',
    date: '2026.10',
    event: '札幌AI会',
    minutes: 5,
    tags: ['Claude Opus 5.5', 'Claude Code', 'Unity', 'gpt-image', 'Suno'],
    cover: '/lt/opus55-gamedev/slide-01.webp',
    slides: slideList('opus55-gamedev', 15),
    summary: 'SapporoGameCamp2026 で作った ReNewBage は、実装の99%を Opus 5.5 に任せた。UI はデザインごと提案させ、リグのないモデルもスクリプトで動かした。個人制作では Claude Code・gpt-image・Suno で「AI のチーム」を組み、キャラ差分は400枚以上。2か月でのモデルの伸びと、速く・安くなったことも数字で紹介。',
  },
  {
    slug: 'ore-no-lora',
    title: '俺のLoRAを作ってみた',
    subtitle: '1本の動画から、本人を再現する差分を学習',
    date: '2026.09',
    event: '',
    minutes: 5,
    tags: ['Qwen-Image-2.1', 'LoRA', 'ComfyUI'],
    cover: '/lt/ore-no-lora/slide-02.webp',
    slides: slideList('ore-no-lora', 9),
    summary: 'スマホ動画1本から240フレームを切り出し、30枚に絞って Qwen-Image-2.1 の人物LoRA（rank 32 / 600 steps / RTX 4090で約29分）を学習。生成の30 stepsで像が固まる様子と、条件で「本人度」が変わる話。',
  },
];
