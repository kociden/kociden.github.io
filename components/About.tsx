import React from 'react';
import { Terminal, BookOpen, Cpu } from 'lucide-react';
import { PROFILE } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-skin-card/50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <h2 className="text-sm font-bold tracking-widest text-skin-accent uppercase mb-2">About Me</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-skin-text mb-6">
            エンジニアリングとデザインの<br/>
            境界線を探求する
          </h3>
          <p className="text-skin-muted text-lg leading-relaxed mb-6">
            {PROFILE.bio}
          </p>
          <p className="text-skin-muted leading-relaxed mb-8">
            北海道大学の広大なキャンパスで、情報エレクトロニクスの基礎から最先端技術までを学んでいます。
            「M Lab」では、学術的な知識と実践的な開発スキルを融合させ、独自の視点でソリューションを提供します。
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded bg-skin-base border border-skin-text/5">
              <Terminal className="text-skin-accent" />
              <span className="text-skin-text font-medium">Web Development</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded bg-skin-base border border-skin-text/5">
              <Cpu className="text-skin-accent" />
              <span className="text-skin-text font-medium">Electronics</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded bg-skin-base border border-skin-text/5">
              <BookOpen className="text-skin-accent" />
              <span className="text-skin-text font-medium">Research</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-skin-accent/30" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-skin-accent/30" />
          
          <div 
            className="w-full aspect-square bg-skin-muted/10 rounded overflow-hidden relative group"
            style={{ borderRadius: 'var(--style-rounded)' }}
          >
             <img 
               src="https://picsum.photos/id/60/800/800" 
               alt="Workspace" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
             />
             <div className="absolute inset-0 bg-skin-accent/10 mix-blend-multiply pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
