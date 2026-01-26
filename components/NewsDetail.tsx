import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailProps {
  item: NewsItem;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ item, onBack }) => {
  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 md:px-12 max-w-4xl mx-auto animate-in slide-in-from-right-10 fade-in duration-300">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-skin-muted hover:text-skin-accent mb-8 transition-colors"
      >
        <div className="p-2 rounded-full border border-skin-muted/30 group-hover:border-skin-accent/50 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium text-sm">Back to Home</span>
      </button>

      <article className="bg-skin-card p-8 md:p-12 shadow-2xl" style={{ borderRadius: 'var(--style-rounded)', border: 'var(--style-border)' }}>
        
        {/* Header */}
        <header className="mb-10 pb-8 border-b border-skin-text/10">
          <time className="block text-skin-accent font-mono mb-4">{item.date}</time>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-skin-card-text leading-tight mb-8">
            {item.title}
          </h1>
          
          {item.thumbnail && (
            <div 
              className="w-full aspect-video rounded overflow-hidden shadow-inner"
              style={{ borderRadius: 'calc(var(--style-rounded) / 2)' }}
            >
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Content Body */}
        <div 
          className="prose prose-lg max-w-none 
            text-skin-muted 
            prose-headings:text-skin-card-text 
            prose-a:text-skin-accent 
            prose-strong:text-skin-card-text
            prose-ul:marker:text-skin-accent"
        >
          {item.content ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <p>詳細記事の準備中です。</p>
          )}
        </div>

      </article>

      {/* Footer Area within detail view */}
      <div className="py-12 text-center">
        <button 
          onClick={onBack}
          className="text-skin-muted hover:text-skin-text text-sm underline decoration-skin-accent decoration-2 underline-offset-4"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

export default NewsDetail;