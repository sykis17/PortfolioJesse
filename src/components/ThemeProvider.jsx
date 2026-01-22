import React, { createContext, useState, useContext, useEffect } from 'react';
import { themes } from '@site/src/config/Themes';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    if (ExecutionEnvironment.canUseDOM) {
      return localStorage.getItem('selectedTheme') || 'maritime';
    }
    return 'maritime';
  });

  const theme = themes[currentThemeId] || themes.maritime;

  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      localStorage.setItem('selectedTheme', currentThemeId);
      document.documentElement.setAttribute('data-custom-theme', currentThemeId);
    }
  }, [currentThemeId]);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          
          if (isDark) {
            setCurrentThemeId('dark');
          } else {
            const saved = localStorage.getItem('selectedTheme');
            if (!saved || themes[saved]?.type === 'dark') {
              setCurrentThemeId('maritime');
            } else {
              setCurrentThemeId(saved);
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const switchTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentThemeId(themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme: currentThemeId, switchTheme, theme, themes }}>
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