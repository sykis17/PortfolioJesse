import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { getColorHex } from '@site/src/config/tailwindColors';

export default function ThemeCustomizer() {
  const { currentTheme, switchTheme, theme, themes } = useTheme();
  const [showExport, setShowExport] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Helper to show temporary feedback to the user
  const showFeedback = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
  };

  const exportThemeConfig = async () => {
    const config = JSON.stringify(theme, null, 2);
    
    // Check if Clipboard API is available
    if (!navigator.clipboard) {
      showFeedback("Clipboard API not supported in this browser.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(config);
      showFeedback('Theme config copied to clipboard!');
    } catch (err) {
      console.error("Failed to copy!", err);
      showFeedback("Failed to copy. Please check browser permissions.", "error");
    }
  };

  const downloadTheme = () => {
    try {
      const configString = JSON.stringify(theme, null, 2);
      const file = new Blob([configString], { type: 'application/json' });
      const url = URL.createObjectURL(file);
      
      const element = document.createElement('a');
      element.href = url;
      element.download = `theme-${currentTheme}.json`;
      
      document.body.appendChild(element);
      element.click();
      
      // Cleanup
      document.body.removeChild(element);
      URL.revokeObjectURL(url);
      
      showFeedback("Download started!");
    } catch (err) {
      console.error("Download failed!", err);
      showFeedback("Failed to generate download file.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Theme Customizer</h1>
          <p className="text-slate-600">Explore and customize professional themes</p>
        </div>
        
        {/* Toast Notification for Success/Error */}
        {statusMessage.text && (
          <div className={`px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all animate-in fade-in slide-in-from-top-4 ${
            statusMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Theme Selector Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Available Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(themes).map(([key, themeData]) => {
            const primaryColor = getColorHex(themeData.colors.primary);
            const secondaryColor = getColorHex(themeData.colors.secondary);
            
            return (
              <div
                key={key}
                onClick={() => switchTheme(key)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  currentTheme === key
                    ? 'border-blue-600 bg-slate-50 shadow-lg scale-[1.02]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Theme Preview */}
                <div className="mb-4 h-24 rounded-xl overflow-hidden shadow-sm">
                  <div
                    className="h-1/2 w-full transition-all"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div
                    className="h-1/2 w-full"
                    style={{ backgroundColor: secondaryColor }}
                  />
                </div>

                {/* Theme Info */}
                <h3 className="font-bold text-lg text-slate-900 mb-1">{themeData.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{themeData.description}</p>

                {/* Color Preview */}
                <div className="flex gap-2 flex-wrap">
                  {Object.values(themeData.colors).slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded-md shadow-sm border border-slate-300"
                      style={{ backgroundColor: getColorHex(color) }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Theme Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          {theme.name} - Color Palette
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(theme.colors).map(([key, color]) => (
            <div
              key={key}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="h-16 rounded-lg mb-3 shadow-sm border border-slate-200"
                style={{ backgroundColor: getColorHex(color) }}
              />
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                {key}
              </p>
              <code className="text-xs text-slate-500">{color}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Live Preview</h2>
        <div
          className="p-12 rounded-2xl shadow-lg border border-slate-200 transition-colors duration-500"
          style={{ backgroundColor: getColorHex(theme.colors.background) }}
        >
          <div className="max-w-2xl">
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: getColorHex(theme.colors.text) }}
            >
              {theme.name} Theme Preview
            </h3>
            <p
              className="mb-6 leading-relaxed"
              style={{ color: getColorHex(theme.colors.textMuted) }}
            >
              This is how your content will look with the {theme.name} theme applied.
              The colors are carefully chosen to provide excellent contrast and readability.
            </p>

            {/* Buttons Preview */}
            <div className="flex flex-wrap gap-4">
              <button
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: getColorHex(theme.colors.primary) }}
              >
                Primary Action
              </button>
              <button
                className="px-6 py-3 rounded-lg font-bold transition-all hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: getColorHex(theme.colors.secondary),
                  color: getColorHex(theme.colors.text),
                }}
              >
                Secondary Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Export Theme</h2>
          <button 
            onClick={() => setShowExport(!showExport)}
            className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
          >
            {showExport ? 'Hide Raw JSON' : 'View Raw JSON'}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportThemeConfig}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={downloadTheme}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg font-bold hover:bg-slate-700 transition-all active:scale-95"
          >
            Download JSON
          </button>
        </div>
        {showExport && (
          <pre className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs border border-slate-700 shadow-inner">
            {JSON.stringify(theme, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}