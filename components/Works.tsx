import React from 'react';
import { ExternalLink } from 'lucide-react';
import { WORKS_DATA } from '../constants';

const Works: React.FC = () => {
  return (
    <section id="works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16 md:text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-skin-text mb-4">Selected Works</h2>
        <p className="text-skin-muted text-lg max-w-2xl mx-auto">
          これまでに制作したアプリケーションやプロジェクトの一部をご紹介します。<br />
          各カードには技術スタックと詳細が含まれています。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {WORKS_DATA.map((work) => (
          <article
            key={work.id}
            className="group relative flex flex-col h-full bg-skin-card overflow-hidden transition-all hover:-translate-y-2 duration-300"
            // Apply theme specific styles for border, radius, shadow via global CSS classes set in Layout
            style={{
              borderRadius: 'var(--style-rounded)',
              boxShadow: 'var(--style-shadow)',
              border: 'var(--style-border)'
            }}
          >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden bg-gray-200">
              {work.image ? (
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-skin-muted/20 text-skin-muted">
                  <span className="text-sm font-mono">NO IMAGE</span>
                </div>
              )}

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                {work.url && (
                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    title="View Project"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-6">
              <h3 className="text-xl font-bold text-skin-card-text mb-2 group-hover:text-skin-accent transition-colors">
                {work.title}
              </h3>

              <p className="text-skin-muted text-sm leading-relaxed mb-6 flex-grow">
                {work.description}
              </p>

              <div className="pt-4 border-t border-skin-text/10">
                <div className="flex flex-wrap gap-2">
                  {work.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-medium rounded bg-skin-accent/10 text-skin-accent border border-skin-accent/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Works;