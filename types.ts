export interface WorkItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  tag?: string;      // 'Award' | 'Info' | 'Release' など自由
  url?: string;      // 外部リンク（任意）
  thumbnail?: string;
  content?: string;  // 詳細本文（HTML可）
}

// デザイン案の識別子
export type DesignId = 'signal' | 'bento' | 'editorial';

export interface DesignMeta {
  id: DesignId;
  name: string;
  description: string;
  reference: string;
}

export const DESIGNS: DesignMeta[] = [
  { id: 'signal', name: 'A. Signal', description: 'ダーク × グリッド × モノスペース', reference: 'Linear / Vercel' },
  { id: 'bento', name: 'B. Bento', description: 'ガラス質のタイルグリッド', reference: 'Apple / Raycast' },
  { id: 'editorial', name: 'C. Editorial', description: '明朝 × 余白 × 大型タイポ', reference: 'Awwwards系スタジオサイト' },
];
