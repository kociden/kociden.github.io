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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const theme = THEMES[currentThemeId];
  
  // Select active colors based on mode
  const activeColors = isDarkMode ? theme.colors.dark : theme.colors.light;

  // Initialize dark mode based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply theme variables to root style
  const themeStyles = {
    '--color-bg': activeColors.bg,
    '--color-text': activeColors.text,
    '--color-accent': activeColors.accent,
    '--color-card': activeColors.card,
    '--color-card-text': activeColors.cardText,
    '--color-muted': activeColors.muted,
    '--style-rounded': theme.styles.rounded,
    '--font-primary': theme.styles.font,
    '--style-shadow': theme.styles.shadow,
    '--style-border': theme.styles.border,
  } as React.CSSProperties;

  // Handle body background for overscroll areas
  useEffect(() => {
    document.body.style.backgroundColor = activeColors.bg;
  }, [activeColors]);

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
             {theme.name} <span className="text-xs font-normal opacity-70">({isDarkMode ? 'Dark' : 'Light'})</span>
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
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
}

export default App;