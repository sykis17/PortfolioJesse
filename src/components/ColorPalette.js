import React, { useState } from 'react';
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

export default function ColorPalette() {
  const [activeTarget, setActiveTarget] = useState('bg1');
  const [bg1Color, setBg1Color] = useState(getColorHex('slate', 900));
  const [bg2Color, setBg2Color] = useState(getColorHex('blue', 600));
  const [bg1Class, setBg1Class] = useState('bg-slate-900');
  const [bg2Class, setBg2Class] = useState('bg-blue-600');
  const [textStyle, setTextStyle] = useState({ color: '#ffffff' });
  const [previewFont, setPreviewFont] = useState('font-inter');

  const handleColorClick = (color, shade) => {
    const tailwindClass = `${activeTarget === 'text' ? 'text' : 'bg'}-${color}-${shade}`;
    const hexColor = getColorHex(color, shade);

    if (activeTarget === 'bg1') {
      setBg1Color(hexColor);
      setBg1Class(tailwindClass);
    }
    if (activeTarget === 'bg2') {
      setBg2Color(hexColor);
      setBg2Class(tailwindClass);
    }
    if (activeTarget === 'text') {
      setTextStyle({ color: hexColor });
    }

    // Copying to clipboard for developer efficiency
    navigator.clipboard.writeText(tailwindClass);
  };

  const setQuickTextColor = (type) => {
    const color = type === 'white' ? '#ffffff' : '#1c1917'; // stone-900
    setTextStyle({ color: color });
    navigator.clipboard.writeText(type === 'white' ? 'text-white' : 'text-stone-900');
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* 1. Preview Card */}
      <div className="bg-stone-300 dark:bg-stone-900/50 p-4 md:p-10 rounded-[3rem] border border-stone-400/30 shadow-2xl transition-colors duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-96 rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-400/20">
          <div 
            className={`p-12 flex flex-col justify-center transition-all duration-700 ${previewFont}`}
            style={{
              backgroundColor: bg1Color,
              color: textStyle.color,
            }}
          >
            <h3 className="text-5xl font-black m-0 italic tracking-tighter uppercase leading-tight">System</h3>
            <p className="mt-4 text-xs font-bold opacity-70 tracking-[0.3em] uppercase italic">{bg1Class}</p>
          </div>
          <div 
            className={`p-12 flex flex-col justify-center transition-all duration-700 ${previewFont}`}
            style={{
              backgroundColor: bg2Color,
              color: textStyle.color,
            }}
          >
            <h3 className="text-5xl font-black m-0 italic tracking-tighter uppercase leading-tight">Design</h3>
            <p className="mt-4 text-xs font-bold opacity-70 tracking-[0.3em] uppercase italic">{bg2Class}</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 px-4">
          <div className="flex bg-stone-400/20 backdrop-blur-sm p-1.5 rounded-2xl border border-stone-400/30">
            {['bg1', 'bg2', 'text'].map((t) => (
              <button 
                key={t}
                onClick={() => setActiveTarget(t)}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    activeTarget === t 
                    ? 'bg-white text-stone-900 shadow-lg scale-105' 
                    : 'text-stone-600 hover:text-stone-800 hover:bg-white/10'
                }`}
              >
                {t === 'text' ? 'Text Color' : `Base ${t.slice(-1)}`}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setQuickTextColor('white')} 
              className="w-10 h-10 bg-white border-2 border-slate-200 rounded-full shadow-md hover:scale-110 transition-transform active:scale-90" 
              title="Quick White Text" 
            />
            <button 
              onClick={() => setQuickTextColor('black')} 
              className="w-10 h-10 bg-stone-900 border-2 border-stone-700 rounded-full shadow-md hover:scale-110 transition-transform active:scale-90" 
              title="Quick Dark Text" 
            />
          </div>

          <div className="font-mono text-[9px] text-stone-500 uppercase tracking-widest bg-stone-400/10 px-6 py-3 rounded-full border border-stone-400/20">
            Click to copy class
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
                    <button
                      onClick={() => handleColorClick(color, shade)}
                      style={{ backgroundColor: getColorHex(color, shade) }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg border border-stone-950/5 hover:scale-125 hover:rotate-2 hover:shadow-2xl transition-all cursor-pointer shadow-sm active:scale-75"
                      title={`${color}-${shade}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}