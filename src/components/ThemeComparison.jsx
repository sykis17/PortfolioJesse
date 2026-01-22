import React from 'react';
import { themes } from '@site/src/config/Themes';
import { getColorHex } from '@site/src/config/tailwindColors';

export default function ThemeComparison() {
  // 1. Logic Extraction: Define the dynamic grid layout here
  // This calculates how many columns we need based on the number of themes
  const themeCount = Object.keys(themes).length;
  const gridStyle = {
    gridTemplateColumns: `repeat(${themeCount}, minmax(350px, 1fr))`,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-[var(--theme-text)]">
      {/* Page Header */}
      <div className="border-b border-[var(--theme-border)] pb-6">
        <h1 className="text-4xl font-bold text-[var(--theme-text)] mb-2">Theme Comparison</h1>
        <p className="text-[var(--theme-text-muted)]">Side-by-side comparison of all available themes</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4">
        {/* 2. Cleaner JSX: Using the extracted gridStyle variable */}
        <div className="grid gap-6" style={gridStyle}>
          {Object.entries(themes).map(([key, theme]) => {
            const primaryColor = getColorHex(theme.colors.primary);
            const secondaryColor = getColorHex(theme.colors.secondary);
            const accentColor = getColorHex(theme.colors.accent);

            return (
              <div
                key={key}
                className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Visual Header with Gradient */}
                <div
                  className="p-6 border-b border-[var(--theme-border)]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <h3 className="text-2xl font-bold text-white">{theme.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{theme.description}</p>
                </div>

                {/* Color Swatches List */}
                <div className="p-6 space-y-3 bg-[var(--theme-background)]">
                  <p className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-wider">Color Palette</p>
                  {Object.entries(theme.colors).map(([colorKey, colorValue]) => (
                    <div key={colorKey} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0 border border-black/5"
                        style={{ backgroundColor: getColorHex(colorValue) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--theme-text)] uppercase">
                          {colorKey}
                        </p>
                        <code className="text-xs text-[var(--theme-text-muted)] block truncate">{colorValue}</code>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Preview Section */}
                <div className="p-6 space-y-3 border-t border-[var(--theme-border)]">
                  <p className="text-xs font-bold text-[var(--theme-text-muted)] uppercase tracking-wider">Preview</p>
                  
                  <button
                    className="w-full px-4 py-2 rounded-lg font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary Action
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-[var(--theme-background)] active:scale-95 border-2"
                    style={{
                      borderColor: accentColor,
                      color: accentColor,
                    }}
                  >
                    Secondary Action
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
