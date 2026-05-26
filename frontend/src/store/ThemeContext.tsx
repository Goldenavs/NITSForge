import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'ember' | 'midnight' | 'forest' | 'sakura' | 'obsidian' | 'arctic';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage first, default to 'ember'
    return (localStorage.getItem('nitsforge-theme') as Theme) || 'ember';
  });

  useEffect(() => {
    // Apply the theme to the HTML root element
    const root = document.documentElement;
    
    // Remove old theme data attributes if we were using classes, but with your setup:
    root.setAttribute('data-theme', theme);
    
    // Save to local storage for persistence
    localStorage.setItem('nitsforge-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}