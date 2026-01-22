import React, { createContext, useState, useContext, useEffect } from 'react';
import { themes } from '@site/src/config/Themes';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const ThemeContext = createContext();

const LIGHT_THEME_KEY = 'selectedLightTheme';
const DARK_THEME_KEY = 'selectedDarkTheme';

export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    if (ExecutionEnvironment.canUseDOM) {
      return localStorage.getItem('selectedTheme') || localStorage.getItem(LIGHT_THEME_KEY) || 'maritime';
    }
    return 'maritime';
  });

  const theme = themes[currentThemeId] || themes.maritime;

  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      localStorage.setItem('selectedTheme', currentThemeId);
      const themeType = themes[currentThemeId]?.type === 'dark' ? 'dark' : 'light';
      localStorage.setItem(themeType === 'dark' ? DARK_THEME_KEY : LIGHT_THEME_KEY, currentThemeId);
      document.documentElement.setAttribute('data-custom-theme', currentThemeId);
    }
  }, [currentThemeId]);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const updateThemeFromMode = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const storageKey = isDark ? DARK_THEME_KEY : LIGHT_THEME_KEY;
      const fallbackTheme = isDark ? 'dark' : 'maritime';
      const storedTheme = localStorage.getItem(storageKey);
      const candidateTheme = themes[storedTheme] ? storedTheme : fallbackTheme;
      const themeId = themes[candidateTheme]?.type === (isDark ? 'dark' : 'light')
        ? candidateTheme
        : fallbackTheme;

      setCurrentThemeId((prevThemeId) => (prevThemeId === themeId ? prevThemeId : themeId));
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateThemeFromMode();
        }
      });
    });

    updateThemeFromMode();
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
