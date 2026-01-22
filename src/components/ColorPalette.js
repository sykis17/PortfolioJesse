import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { getColorHex } from '@site/src/config/tailwindColors';
const ColorWheel = React.lazy(() => import('./ColorWheel'));
import ColorPreview from './ColorPreview';

const COLORS = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const FONTS = [
  { name: 'Inter (Sans)', class: 'font-inter' },
  { name: 'Playfair (Serif)', class: 'font-playfair' },
  { name: 'Lexend (Soft)', class: 'font-lexend' },
  { name: 'JetBrains (Mono)', class: 'font-jetbrains' },
  { name: 'Montserrat (Bold)', class: 'font-montserrat' },
  { name: 'Oswald (Narrow)', class: 'font-oswald' },
  { name: 'Space Grotesk', class: 'font-space' },
  { name: 'Fira Code', class: 'font-fira' },
];

const ColorButton = React.memo(({ color, shade, onClick }) => {
  const hex = getColorHex(color, shade);
  return (
    <button
      onClick={() => onClick(color, shade)}
      style={{ backgroundColor: hex }}
      className="w-10 h-10 md:w-12 md:h-12 rounded-lg border border-stone-950/5 hover:scale-125 hover:rotate-2 hover:shadow-2xl transition-all cursor-pointer shadow-sm active:scale-75"
      title={`${color}-${shade}`}
    />
  );
});

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0,2), 16),
    g: parseInt(h.substring(2,4), 16),
    b: parseInt(h.substring(4,6), 16)
  };
}

function colorDistance(a, b) {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

export default function ColorPalette() {
  const [activeTarget, setActiveTarget] = useState('bg1');
  const [previewFont, setPreviewFont] = useState('font-inter');
  const [compressedView, setCompressedView] = useState(true);
  const [wheelColor, setWheelColor] = useState('#3b82f6');
  const [wheelNearest, setWheelNearest] = useState(null);

  const [config, setConfig] = useState({
    bg1: { hex: getColorHex('slate', 900), class: 'bg-slate-900' },
    bg2: { hex: getColorHex('blue', 600), class: 'bg-blue-600' },
    nameColor: { hex: '#ffffff', class: 'text-white' },
    descColor: { hex: '#94a3b8', class: 'text-slate-400' },
    text: { hex: '#ffffff', class: 'text-white' },
  });

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handleColorClick = useCallback((color, shade) => {
    const hexColor = getColorHex(color, shade);
    const prefix = activeTarget.startsWith('bg') ? 'bg' : 'text';
    const tailwindClass = `${prefix}-${color}-${shade}`;

    setConfig(prev => ({
      ...prev,
      [activeTarget]: { hex: hexColor, class: tailwindClass }
    }));

    copyToClipboard(tailwindClass);
  }, [activeTarget]);

  const findNearestToken = (hex) => {
    const targetRgb = hexToRgb(hex);
    let best = { dist: Infinity, color: null, shade: null, hex: null };
    for (const c of COLORS) {
      for (const s of SHADES) {
        const candidateHex = getColorHex(c, s);
        if (!candidateHex) continue;
        const candidateRgb = hexToRgb(candidateHex);
        const dist = colorDistance(targetRgb, candidateRgb);
        if (dist < best.dist) {
          best = { dist, color: c, shade: s, hex: candidateHex };
        }
      }
    }
    return best.color ? best : null;
  };

  const applyHexToTarget = (hex, nearest = null) => {
    const prefix = activeTarget.startsWith('bg') ? 'bg' : 'text';
    let twClass = '';
    if (nearest) {
      twClass = `${prefix}-${nearest.color}-${nearest.shade}`;
    }
    setConfig(prev => ({
      ...prev,
      [activeTarget]: { hex, class: twClass }
    }));
    copyToClipboard(twClass || hex);
  };

  const setQuickTextColor = (type) => {
    const isWhite = type === 'white';
    const hex = isWhite ? '#ffffff' : '#1c1917';
    const twClass = isWhite ? 'text-white' : 'text-stone-900';
    
    setConfig(prev => ({
      ...prev,
      [activeTarget]: { hex, class: twClass }
    }));
    
    copyToClipboard(twClass);
  };

  const ColorGrid = useMemo(() => (
    <div className="overflow-x-auto rounded-[2rem] border border-stone-200 bg-white/50 backdrop-blur-md p-6 shadow-xl">
      <table className="w-full border-separate border-spacing-1.5">
        <thead>
          <tr>
            <th className="p-3 text-left text-[9px] font-black uppercase text-stone-400 tracking-[0.2em]">Tailwind Tokens</th>
            {SHADES.map(s => <th key={s} className="text-[9px] font-black text-stone-300">{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {COLORS.map(color => (
            <tr key={color}>
              <td className="text-[10px] font-black text-stone-400 pr-6 uppercase tracking-tighter">{color}</td>
              {SHADES.map(shade => (
                <td key={shade}>
                  <ColorButton color={color} shade={shade} onClick={handleColorClick} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ), [handleColorClick]);

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3 items-center">
          <button onClick={() => setCompressedView(false)} className={`px-4 py-2 rounded-xl font-black text-sm ${!compressedView ? 'bg-white text-stone-900 shadow' : 'bg-stone-50 text-stone-600'}`}>Full Grid</button>
          <button onClick={() => setCompressedView(true)} className={`px-4 py-2 rounded-xl font-black text-sm ${compressedView ? 'bg-white text-stone-900 shadow' : 'bg-stone-50 text-stone-600'}`}>Compressed</button>
        </div>
        <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">{compressedView ? 'Compressed view' : 'Full grid view'}</div>
      </div>

      <div className="bg-stone-300 dark:bg-stone-900/50 p-4 md:p-10 rounded-[3rem] border border-stone-400/30 shadow-2xl transition-colors duration-500">
        <div className={`grid ${compressedView ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-3 h-96 rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-400/20`}> 
          <div 
            className={`p-8 flex flex-col justify-center transition-all duration-700 ${previewFont}`}
            style={{ backgroundColor: config.bg1.hex }}
          >
            <h3 
              className="text-4xl md:text-5xl font-black m-0 italic tracking-tighter uppercase leading-tight"
              style={{ color: config.nameColor.hex }}
            >
              System
            </h3>
            <p 
              className="mt-4 text-xs font-bold tracking-[0.3em] uppercase italic"
              style={{ color: config.descColor.hex }}
            >
              {config.bg1.class || config.bg1.hex}
            </p>
            <p className="mt-6 text-sm" style={{ color: config.text.hex }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          <div 
            className={`p-8 flex flex-col justify-center transition-all duration-700 ${previewFont}`}
            style={{ backgroundColor: config.bg2.hex }}
          >
            <h3 
              className="text-4xl md:text-5xl font-black m-0 italic tracking-tighter uppercase leading-tight"
              style={{ color: config.nameColor.hex }}
            >
              Design
            </h3>
            <p 
              className="mt-4 text-xs font-bold tracking-[0.3em] uppercase italic"
              style={{ color: config.descColor.hex }}
            >
              {config.bg2.class || config.bg2.hex}
            </p>
            <p className="mt-6 text-sm" style={{ color: config.text.hex }}>
              Sample body text to test contrast and legibility.
            </p>
          </div>
        </div>

        <div className="mt-8 px-4">
          {compressedView ? (
            <div className="p-4 rounded-2xl border border-stone-200 bg-white/40 backdrop-blur-sm shadow-md">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-80 flex items-center justify-center">
                  <ColorWheel
                    size={260}
                    initial={wheelColor}
                    onChange={(hex) => {
                      const nearest = findNearestToken(hex);
                      setWheelColor(hex);
                      setWheelNearest(nearest);
                    }}
                  />
                </div>

                <div className="flex-1 min-w-[220px]">
                  <ColorPreview
                    color={wheelColor}
                    token={wheelNearest ? `${wheelNearest.color}-${wheelNearest.shade}` : null}
                    onApply={() => applyHexToTarget(wheelColor, wheelNearest)}
                    onClear={() => { setWheelColor('#ffffff'); setWheelNearest(null); }}
                  />

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => setQuickTextColor('white')} className="w-10 h-10 bg-white border-2 border-slate-200 rounded-full shadow-md hover:scale-110 active:scale-90" title="Quick White" />
                    <button onClick={() => setQuickTextColor('black')} className="w-10 h-10 bg-stone-900 border-2 border-stone-700 rounded-full shadow-md hover:scale-110 active:scale-90" title="Quick Black" />
                    <div className="ml-auto text-[11px] font-mono text-stone-500 px-3 py-2 rounded-full bg-stone-50 border border-stone-200">
                      Active: <span className="font-black text-blue-500 ml-2">{activeTarget}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-stone-500 font-mono">
                    Nearest Tailwind token: <span className="font-black text-stone-700 ml-2">{wheelNearest ? `${wheelNearest.color}-${wheelNearest.shade}` : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ColorGrid
          )}
        </div>

        {!compressedView && (
          <div className="mt-10 flex flex-col space-y-6 px-4">
            <div className="flex flex-wrap gap-2 bg-stone-400/20 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-400/30">
              {[
                { id: 'bg1', label: 'Base 1' },
                { id: 'bg2', label: 'Base 2' },
                { id: 'nameColor', label: 'Name' },
                { id: 'descColor', label: 'Desc' },
                { id: 'text', label: 'General Text' }
              ].map((target) => (
                <button 
                  key={target.id}
                  onClick={() => setActiveTarget(target.id)}
                  className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                      activeTarget === target.id 
                      ? 'bg-white text-stone-900 shadow-lg scale-105' 
                      : 'text-stone-600 hover:text-stone-800 hover:bg-white/10'
                  }`}
                >
                  {target.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-3 items-center">
                <button onClick={() => setQuickTextColor('white')} className="w-10 h-10 bg-white border-2 border-slate-200 rounded-full shadow-md hover:scale-110 active:scale-90" title="Quick White" />
                <button onClick={() => setQuickTextColor('black')} className="w-10 h-10 bg-stone-900 border-2 border-stone-700 rounded-full shadow-md hover:scale-110 active:scale-90" title="Quick Black" />
              </div>

              <div className="font-mono text-[9px] text-stone-500 uppercase tracking-widest bg-stone-400/10 px-6 py-3 rounded-full border border-stone-400/20">
                Active Target: <span className="text-blue-500 font-black">{activeTarget}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="px-2">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-8 italic">Font Orchestration</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {FONTS.map((f) => (
            <div 
              key={f.name}
              onClick={() => setPreviewFont(f.class)}
              className={`group relative h-24 flex items-center justify-center rounded-[1.5rem] border-2 transition-all cursor-pointer shadow-sm
                ${previewFont === f.class 
                  ? 'border-blue-500 bg-white shadow-xl -translate-y-1' 
                  : 'border-stone-200 bg-stone-50 hover:border-stone-400 hover:bg-white'}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/95 z-10 rounded-[1.3rem] px-2 text-center">
                <span className="text-[8px] font-black uppercase tracking-tighter text-white leading-tight">{f.name}</span>
              </div>
              <span className={`${f.class} text-2xl text-stone-800 group-hover:blur-[1px]`}>Aa</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}