import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { ThemeId, ThemeConfig } from '../types';
import { THEMES } from '../constants';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="mb-4 w-72 bg-white/90 backdrop-blur-md dark:bg-zinc-800/90 rounded-2xl shadow-2xl p-4 border border-zinc-200 dark:border-zinc-700 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Select Design Style</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
            {Object.values(THEMES).map((theme: ThemeConfig) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id as ThemeId)}
                className={`
                  relative flex flex-col items-start p-2 rounded-lg border text-xs font-medium transition-all
                  hover:scale-105
                  ${currentTheme === theme.id 
                    ? 'ring-2 ring-offset-2 ring-indigo-500 border-indigo-500' 
                    : 'border-zinc-200 dark:border-zinc-600 hover:border-zinc-400'
                  }
                `}
                style={{
                  backgroundColor: theme.colors.bg,
                  color: theme.colors.text
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: theme.colors.accent }} 
                  />
                  <span>{theme.name}</span>
                </div>
                {currentTheme === theme.id && (
                  <div className="absolute top-1 right-1 text-indigo-600 bg-white rounded-full p-0.5 shadow-sm">
                    <Check size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-zinc-300 dark:focus:ring-zinc-600"
        aria-label="Change Theme"
      >
        <Palette className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
        {!isOpen && (
          <span className="absolute right-16 bg-zinc-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            デザインを変更
          </span>
        )}
      </button>
    </div>
  );
};

export default ThemeSelector;
