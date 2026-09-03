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
