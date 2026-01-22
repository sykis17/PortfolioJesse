// ...existing code...
import React from 'react';

export default function ColorPreview({ color = '#ffffff', token = null, onApply = () => {}, onClear = () => {} }) {
  return (
    <div className="rounded-lg p-3 border border-stone-200 bg-white/60 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.06)' }} />
        <div className="flex-1">
          <div className="text-xs font-mono text-stone-600">Selected</div>
          <div className="text-sm font-black">{color.toUpperCase()}</div>
          {token && <div className="text-[11px] text-stone-500 mt-1 font-mono">Nearest token: <span className="font-black ml-1">{token}</span></div>}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={onApply} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-bold">Apply</button>
        <button onClick={onClear} className="px-3 py-2 bg-stone-100 rounded-lg">Clear</button>
      </div>
    </div>
  );
}
// ...existing code...