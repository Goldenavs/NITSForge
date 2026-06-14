// src/store/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'ember' | 'midnight' | 'forest' | 'sakura' | 'obsidian' | 'arctic';

export type BgMode = 0 | 1 | 2 | 3;

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  bgMode: BgMode;
  setBgMode: (mode: BgMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => 
    (localStorage.getItem('nitsforge-theme') as ThemeName) || 'obsidian'
  );

  // Load user preference for animation mode, defaulting to 2 (Standard)
  const [bgMode, setBgModeState] = useState<BgMode>(() => {
    const saved = localStorage.getItem('nitsforge-bg-mode');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if ([0, 1, 2, 3].includes(parsed)) return parsed as BgMode;
    }
    
    // Migration from old boolean
    const oldSaved = localStorage.getItem('nitsforge-bg-animated');
    if (oldSaved !== null) {
      localStorage.removeItem('nitsforge-bg-animated');
      const mode = oldSaved === 'true' ? 2 : 0;
      localStorage.setItem('nitsforge-bg-mode', String(mode));
      return mode;
    }

    return 2;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nitsforge-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  const setBgMode = (newMode: BgMode) => {
    setBgModeState(newMode);
    localStorage.setItem('nitsforge-bg-mode', String(newMode));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, bgMode, setBgMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};