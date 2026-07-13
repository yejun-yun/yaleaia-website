import React, { useEffect, useMemo, useRef, useState } from 'react';

/*
 * Frosted-glass lancet window, ported from About Section Directions demo m4e.
 * A field of drifting lines runs across the whole panel; inside the arch the
 * same field shows through softened by a blur, so text set over the glass
 * stays readable. Static SVG regenerated on container resize.
 */
function ArchWindow({ quote, attribution }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      const w = Math.round(r.width), h = Math.round(r.height);
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const art = useMemo(() => {
    if (!size || size.w < 100 || size.h < 300) return null;
    const { w, h } = size;

    // Deterministic PRNG so the field is identical on every render
    let seed = 2024;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const lines = [];
    for (let i = 0; i < 52; i++) {
      const y0 = 40 + i * ((h - 80) / 52);
      const f1 = 0.006 + rand() * 0.01, p1 = rand() * 6.283, a1 = 14 + rand() * 26;
      let d = '';
      for (let x = 0; x <= w; x += 14) {
        const y = y0 + a1 * Math.sin(f1 * x + p1);
        d += (x === 0 ? 'M' : 'L') + x + ',' + y.toFixed(1);
      }
      lines.push(d);
    }

    // Two-centre lancet arch: radius 1.8x the span keeps it pointed.
    // Pulled left of the panel's center (toward the page center) on wide
    // layouts, and vertically centered against the copy beside it.
    const aw = h < 750 ? 280 : 360;
    const r = aw * 1.8;
    const apex = Math.sqrt(r * r - (r - aw / 2) * (r - aw / 2));
    const cx = w >= 500 ? w * 0.44 : w / 2;
    const x0 = cx - aw / 2;
    const base = Math.round((h + apex) / 2);
    const archD =
      'M ' + x0.toFixed(1) + ' ' + base +
      ' A ' + r + ' ' + r + ' 0 0 1 ' + (x0 + aw / 2).toFixed(1) + ' ' + (base - apex).toFixed(1) +
      ' A ' + r + ' ' + r + ' 0 0 1 ' + (x0 + aw).toFixed(1) + ' ' + base + ' Z';

    const quoteWidth = aw - 110;
    const attrWidth = Math.min(420, w - 24);
    return {
      lines, archD, w, h, aw, base,
      quoteTop: Math.round(base - apex + apex * 0.39),
      quoteWidth,
      quoteLeft: Math.round(cx - quoteWidth / 2),
      attrWidth,
      attrLeft: Math.max(12, Math.round(cx - attrWidth / 2)),
    };
  }, [size]);

  return (
    <div ref={ref} className="arch-window">
      {art && (
        <>
          <svg viewBox={`0 0 ${art.w} ${art.h}`} width={art.w} height={art.h} aria-hidden="true">
            <g opacity="0.3">
              {art.lines.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#C6C9C7" strokeWidth="1" />
              ))}
            </g>
            <defs>
              <clipPath id="arch-window-clip">
                <path d={art.archD} />
              </clipPath>
              <filter id="arch-window-blur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="2.6" />
              </filter>
            </defs>
            <path d={art.archD} fill="#FAFAFA" />
            <g clipPath="url(#arch-window-clip)">
              <g filter="url(#arch-window-blur)" opacity="0.75">
                {art.lines.map((d, i) => (
                  <path key={i} d={d} fill="none" stroke="#B4B8B5" strokeWidth="1" />
                ))}
              </g>
            </g>
            <path d={art.archD} fill="none" stroke="#17181A" strokeWidth="1.2" />
          </svg>
          <div className="arch-quote" style={{ top: art.quoteTop, left: art.quoteLeft, width: art.quoteWidth }}>
            {quote}
          </div>
          <div className="arch-attr" style={{ top: art.base + 36, left: art.attrLeft, width: art.attrWidth }}>
            {attribution}
          </div>
        </>
      )}
    </div>
  );
}

export default ArchWindow;
