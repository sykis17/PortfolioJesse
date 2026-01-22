import React, { useRef, useEffect } from 'react';

function hsvToRgb(h, s, v) {
  let f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255)
  };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export default function ColorWheel({ size = 220, initial = '#3b82f6', onChange = () => {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = size * dpr;
    const h = size * dpr;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 1 * dpr;

    const image = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * w + x) * 4;
        if (dist <= radius) {
          const angle = Math.atan2(dy, dx);
          let deg = (angle * 180 / Math.PI) + 180;
          const sat = dist / radius;
          const val = 1;
          const rgb = hsvToRgb(deg, sat, val);
          image.data[idx] = rgb.r;
          image.data[idx + 1] = rgb.g;
          image.data[idx + 2] = rgb.b;
          image.data[idx + 3] = 255;
        } else {
          image.data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(image, 0, 0);
  }, [size]);

  const handlePointer = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(cx, cy);
    if (dist > radius) return;
    const angle = Math.atan2(dy, dx);
    let deg = (angle * 180 / Math.PI) + 180;
    const sat = Math.min(1, Math.max(0, dist / radius));
    const val = 1;
    const rgb = hsvToRgb(deg, sat, val);
    const hex = rgbToHex(rgb);
    onChange(hex);
  };

  return (
    <div className="inline-block">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => { handlePointer(e); window.addEventListener('mousemove', handlePointer); window.addEventListener('mouseup', () => { window.removeEventListener('mousemove', handlePointer); }, { once: true }); }}
        onTouchStart={(e) => { handlePointer(e); }}
        className="rounded-full border border-stone-200 shadow"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
      />
    </div>
  );
}