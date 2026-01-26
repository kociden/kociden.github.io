export interface WorkItem {
  id: string;
  title: string;
  image: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  url?: string; // Optional now, used for external links if needed
  thumbnail?: string;
  content?: string; // The detailed content of the news
}

export interface ColorScheme {
  bg: string;
  text: string;
  accent: string;
  card: string;
  cardText: string;
  muted: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    light: ColorScheme;
    dark: ColorScheme;
  };
  styles: {
    rounded: string;
    font: string;
    shadow: string;
    border: string;
  };
}

export type ThemeId = 
  | 'minimal' 
  | 'dark-dev' 
  | 'hokkaido-snow' 
  | 'cyberpunk' 
  | 'forest' 
  | 'corporate' 
  | 'sunset' 
  | 'luxury' 
  | 'retro-pop' 
  | 'glass';