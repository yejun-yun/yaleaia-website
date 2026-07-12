import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

/*
 * Section separator: a 1px rule that enters from one side still carrying
 * the hero's oscillation, then decays to flat — the last thread of the
 * hero coming to rest. `mirror` flips it to enter from the right.
 * Drawn once, on resize, and on theme change; intentionally static.
 */
function WaveRule({ mirror = false }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.beginPath();
      ctx.strokeStyle =
        theme === 'dark' ? 'rgba(242, 245, 249, 0.5)' : 'rgba(23, 24, 26, 0.55)';
      ctx.lineWidth = 1;
      const mid = h / 2;
      for (let x = 0; x <= w; x += 2) {
        const xx = mirror ? w - x : x;
        const decay = Math.exp(-(x / w) * 4.5);
        const y = mid + Math.sin(x * 0.02) * (h * 0.38) * decay;
        if (x === 0) ctx.moveTo(xx, y);
        else ctx.lineTo(xx, y);
      }
      ctx.stroke();
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [mirror, theme]);

  return (
    <div className="wave-rule" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default WaveRule;
