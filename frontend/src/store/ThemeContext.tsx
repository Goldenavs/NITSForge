// src/store/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'ember' | 'midnight' | 'forest' | 'sakura' | 'obsidian' | 'arctic';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isBgAnimated: boolean;
  toggleBgAnimation: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => 
    (localStorage.getItem('nitsforge-theme') as ThemeName) || 'obsidian'
  );

  // Load user preference for animation, defaulting to true
  const [isBgAnimated, setIsBgAnimated] = useState<boolean>(() => {
    const saved = localStorage.getItem('nitsforge-bg-animated');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nitsforge-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
  };

  const toggleBgAnimation = () => {
    setIsBgAnimated(prev => {
      const newVal = !prev;
      localStorage.setItem('nitsforge-bg-animated', String(newVal));
      return newVal;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isBgAnimated, toggleBgAnimation }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};