import React from 'react';
import { useTheme } from './ThemeProvider';
import { getColorHex } from '@site/src/config/tailwindColors';

export default function ThemeSwitcher() {
  const { currentTheme, switchTheme, themes } = useTheme();

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <label className="text-sm font-semibold text-slate-700">Select Theme:</label>
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
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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