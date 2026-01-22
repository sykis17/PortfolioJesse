import React from 'react';
import { useTheme } from './ThemeProvider';
import { getColorHex } from '@site/src/config/tailwindColors';

export default function ThemeSwitcher() {
  const { currentTheme, switchTheme, themes } = useTheme();

  return (
    <div className="flex flex-wrap gap-3 p-4 rounded-xl border shadow-sm bg-[var(--theme-surface)] border-[var(--theme-border)]">
      <label className="text-sm font-semibold text-[var(--theme-text-muted)]">Select Theme:</label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(themes).map(([key, themeData]) => {
          const primaryColor = getColorHex(themeData.colors.primary);
          const isActive = currentTheme === key;
          
          return (
            <button
              key={key}
              onClick={() => switchTheme(key)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isActive
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-[var(--theme-background)] text-[var(--theme-text)] hover:bg-[var(--theme-surface)]'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: primaryColor,
                    }
                  : {}
              }
            >
              {themeData.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
