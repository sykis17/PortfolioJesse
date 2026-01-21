import React from 'react';
import { themes } from '@site/src/config/themes';
import { getColorHex } from '@site/src/config/tailwindColors';

export default function ThemeComparison() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Theme Comparison</h1>
        <p className="text-slate-600">Side-by-side comparison of all available themes</p>
      </div>

      {/* Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto">
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Object.keys(themes).length}, minmax(350px, 1fr))` }}>
          {Object.entries(themes).map(([key, theme]) => {
            const primaryColor = getColorHex(theme.colors.primary);
            const secondaryColor = getColorHex(theme.colors.secondary);

            return (
              <div
                key={key}
                className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div
                  className="p-6 border-b border-slate-200"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <h3 className="text-2xl font-bold text-white">{theme.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{theme.description}</p>
                </div>

                {/* Color Swatches */}
                <div className="p-6 space-y-3 bg-slate-50">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Color Palette</p>
                  {Object.entries(theme.colors).map(([colorKey, colorValue]) => (
                    <div key={colorKey} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0"
                        style={{ backgroundColor: getColorHex(colorValue) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 uppercase">
                          {colorKey}
                        </p>
                        <code className="text-xs text-slate-500 block truncate">{colorValue}</code>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Preview */}
                <div className="p-6 space-y-3 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preview</p>
                  <button
                    className="w-full px-4 py-2 rounded-lg font-bold text-white text-sm transition-all hover:scale-105"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="w-full px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 border-2"
                    style={{
                      borderColor: getColorHex(theme.colors.accent),
                      color: getColorHex(theme.colors.accent),
                    }}
                  >
                    Accent Button
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