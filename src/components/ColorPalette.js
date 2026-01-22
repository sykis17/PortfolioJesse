import React, { useState, useMemo, useCallback } from 'react';
import { getColorHex } from '@site/src/config/tailwindColors';

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

// Memoized individual color button to prevent massive re-renders
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

export default function ColorPalette() {
  const [activeTarget, setActiveTarget] = useState('bg1');
  const [previewFont, setPreviewFont] = useState('font-inter');
  
  // Keskitetty tila kaikille esikatselun väreille
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
      {/* 1. Preview Card */}
      <div className="bg-stone-300 dark:bg-stone-900/50 p-4 md:p-10 rounded-[3rem] border border-stone-400/30 shadow-2xl transition-colors duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-96 rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-400/20">
          {/* Vasen puoli: System */}
          <div 
            className={`p-12 flex flex-col justify-center transition-all duration-700 ${previewFont}`}
            style={{ backgroundColor: config.bg1.hex }}
          >
            <h3 
              className="text-5xl font-black m-0 italic tracking-tighter uppercase leading-tight"
              style={{ color: config.nameColor.hex }}
            >
              System
            </h3>
            <p 
              className="mt-4 text-xs font-bold tracking-[0.3em] uppercase italic"
              style={{ color: config.descColor.hex }}
            >
              {config.bg1.class}
            </p>
          </div>
          
          {/* Oikea puoli: Design */}
          <div 
            className={`p-12 flex flex-col justify-center transition-all duration-700 ${previewFont}`}
            style={{ backgroundColor: config.bg2.hex }}
          >
            <h3 
              className="text-5xl font-black m-0 italic tracking-tighter uppercase leading-tight"
              style={{ color: config.nameColor.hex }}
            >
              Design
            </h3>
            <p 
              className="mt-4 text-xs font-bold tracking-[0.3em] uppercase italic"
              style={{ color: config.descColor.hex }}
            >
              {config.bg2.class}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
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
              <button onClick={() => setQuickTextColor('black')} className="w-10 h-10 bg-stone-900 border-2 border-stone-700 rounded-full shadow-md hover:scale-110 active:scale-90" title="Quick Dark" />
            </div>

            <div className="font-mono text-[9px] text-stone-500 uppercase tracking-widest bg-stone-400/10 px-6 py-3 rounded-full border border-stone-400/20">
              Active Target: <span className="text-blue-500 font-black">{activeTarget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TYPOGRAPHY SELECTION */}
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

      {/* 3. COLOR SYSTEM TABLE */}
      {ColorGrid}
    </div>
  );
}