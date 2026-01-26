import React from 'react';
import { ArrowDown, Github, Mail } from 'lucide-react';
import { PROFILE } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={PROFILE.heroImage} 
          alt="N-Lab Background" 
          className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
        />
        {/* Adjusted gradient: Transparent in center to show image, fading to bg color at edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-skin-base via-skin-base/60 to-skin-base/90" />
      </div>
      
      {/* Decorative Gradient Blob */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-accent),_transparent_60%)] z-0" />

      <div className="z-10 text-center max-w-4xl animate-in slide-in-from-bottom-10 duration-1000 fade-in relative">
        <h2 className="text-skin-accent text-xl md:text-2xl font-bold tracking-widest mb-4 uppercase drop-shadow-md">
          {PROFILE.brand}
        </h2>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-skin-text tracking-tighter mb-6 leading-tight drop-shadow-sm">
          DESIGN &<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-skin-text to-skin-accent">
            ENGINEERING
          </span>
        </h1>
        
        <p className="text-skin-muted text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed font-medium mix-blend-plus-darker dark:mix-blend-plus-lighter">
          {PROFILE.university}<br/>
          {PROFILE.affiliation}
        </p>

        <p className="text-skin-text text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed opacity-90 font-medium">
          Unity (C#) / Python / TypeScript<br/>
          24時間戦える情熱で「ワクワク」を実装
        </p>

        <div className="flex justify-center gap-6">
          <a 
            href={PROFILE.social.github}
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-skin-text/20 text-skin-text hover:bg-skin-text hover:text-skin-base transition-colors bg-skin-base/70 backdrop-blur-sm shadow-sm"
            aria-label="GitHub Profile"
          >
            <Github size={24} />
          </a>
          <a 
            href={`mailto:${PROFILE.social.email}`}
            className="p-3 rounded-full border border-skin-text/20 text-skin-text hover:bg-skin-text hover:text-skin-base transition-colors bg-skin-base/70 backdrop-blur-sm shadow-sm"
            aria-label="Email Contact"
          >
            <Mail size={24} />
          </a>
        </div>
      </div>

      {/* Photo Credit */}
      <div className="absolute bottom-4 right-6 z-10 text-[10px] md:text-xs text-skin-muted/80 font-mono tracking-wider pointer-events-none bg-skin-base/40 backdrop-blur-sm px-2 py-1 rounded">
        写真：Nラボの日常の風景
      </div>

      <div className="absolute bottom-10 animate-bounce z-10">
        <a href="#about" className="text-skin-muted hover:text-skin-accent transition-colors">
          <ArrowDown size={32} />
        </a>
      </div>
    </section>
  );
};

export default Hero;