import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { NEWS_DATA } from '../constants';

interface NewsProps {
  onNewsClick: (id: string) => void;
}

const News: React.FC<NewsProps> = ({ onNewsClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="news" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-skin-text mb-4">News</h2>
          <p className="text-skin-muted text-lg">Mラボの最新情報と活動記録</p>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="p-3 rounded-full border border-skin-text/20 text-skin-text hover:bg-skin-text hover:text-skin-base transition-colors"
            aria-label="Previous News"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 rounded-full border border-skin-text/20 text-skin-text hover:bg-skin-text hover:text-skin-base transition-colors"
            aria-label="Next News"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NEWS_DATA.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNewsClick(item.id)}
            className="group flex-none w-80 md:w-96 snap-start bg-skin-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl text-left flex flex-col"
            style={{
              borderRadius: 'var(--style-rounded)',
              boxShadow: 'var(--style-shadow)',
              border: 'var(--style-border)'
            }}
          >
            {/* Image area */}
            <div className="h-48 w-full overflow-hidden bg-skin-muted/10 relative">
              {item.thumbnail ? (
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-skin-muted/5 flex-col gap-2">
                  <span className="text-skin-muted/30 text-4xl font-bold">NEWS</span>
                </div>
              )}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black p-2 rounded-full shadow-lg">
                <ArrowRight size={16} />
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <time className="block text-sm font-mono text-skin-accent mb-2">{item.date}</time>
              <h3 className="text-lg font-bold text-skin-card-text group-hover:text-skin-accent transition-colors line-clamp-2 mb-4">
                {item.title}
              </h3>
              <div className="mt-auto pt-4 border-t border-skin-text/5 flex items-center text-sm text-skin-muted group-hover:text-skin-accent transition-colors">
                READ MORE <ArrowRight size={14} className="ml-1" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default News;