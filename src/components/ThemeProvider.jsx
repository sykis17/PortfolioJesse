import React, { createContext, useState, useContext, useEffect } from 'react';
import { themes } from '@site/src/config/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedTheme');
      return saved || 'maritime';
    }
    return 'maritime';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedTheme', currentTheme);
    }
  }, [currentTheme]);

  const theme = themes[currentTheme];

  const switchTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, switchTheme, theme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}