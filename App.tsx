import React, { useState, useEffect } from 'react';
import ThemeSelector from './components/ThemeSelector';
import Hero from './components/Hero';
import Works from './components/Works';
import News from './components/News';
import NewsDetail from './components/NewsDetail';
import Contact from './components/Contact';
import About from './components/About';
import Footer from './components/Footer';
import { THEMES, NEWS_DATA } from './constants';
import { ThemeId } from './types';

function App() {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('minimal');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const theme = THEMES[currentThemeId];

  // Apply theme variables to root style
  const themeStyles = {
    '--color-bg': theme.colors.bg,
    '--color-text': theme.colors.text,
    '--color-accent': theme.colors.accent,
    '--color-card': theme.colors.card,
    '--color-card-text': theme.colors.cardText,
    '--color-muted': theme.colors.muted,
    '--style-rounded': theme.styles.rounded,
    '--font-primary': theme.styles.font,
    '--style-shadow': theme.styles.shadow,
    '--style-border': theme.styles.border,
  } as React.CSSProperties;

  // Handle body background
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.bg;
  }, [theme]);

  // Find selected news item
  const selectedNewsItem = selectedNewsId ? NEWS_DATA.find(n => n.id === selectedNewsId) : null;

  return (
    <div 
      style={themeStyles} 
      className="min-h-screen bg-skin-base text-skin-text font-primary transition-colors duration-500 selection:bg-skin-accent selection:text-white"
    >
      <header className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-skin-base/80 backdrop-blur-sm border-b border-skin-text/5">
        <div className="flex items-center gap-2">
           <h1 className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => setSelectedNewsId(null)}>
             {theme.name} Mode
           </h1>
        </div>
        
        {/* Navigation only shown on Home */}
        {!selectedNewsId && (
          <nav className="hidden md:flex gap-6 text-sm font-medium text-skin-muted">
            <a href="#" className="hover:text-skin-accent transition-colors">TOP</a>
            <a href="#about" className="hover:text-skin-accent transition-colors">ABOUT</a>
            <a href="#works" className="hover:text-skin-accent transition-colors">WORKS</a>
            <a href="#news" className="hover:text-skin-accent transition-colors">NEWS</a>
            <a href="#contact" className="hover:text-skin-accent transition-colors">CONTACT</a>
          </nav>
        )}
      </header>

      <main>
        {selectedNewsId && selectedNewsItem ? (
          <NewsDetail 
            item={selectedNewsItem} 
            onBack={() => setSelectedNewsId(null)} 
          />
        ) : (
          <>
            <Hero />
            <About />
            <Works />
            <News onNewsClick={setSelectedNewsId} />
            <Contact />
          </>
        )}
      </main>

      <Footer />
      
      <ThemeSelector 
        currentTheme={currentThemeId} 
        setTheme={setCurrentThemeId} 
      />
    </div>
  );
}

export default App;