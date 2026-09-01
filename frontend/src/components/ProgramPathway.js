import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

/*
 * The member pathway as a woven diagram: four stage clusters connected by
 * thin curves that converge into the fellowship and fan back out. Nodes
 * are positioned HTML (so labels stay text); the curves are one canvas
 * draw, repeated on resize. Below 760px the diagram is replaced by a
 * station grid (see Involve.css) since the weave has no room to breathe.
 */
export const PATHWAY_HEIGHT = 380;
const NODE_SPACING = 62;
const CENTER_Y = PATHWAY_HEIGHT * 0.52;
const DOT_ANCHOR = 14; // node divs are translated -50%; dots sit this far up

const STAGES = [
  { x: 0.09, label: 'DISCOVER', items: ['Speaker events', 'Outreach', 'Socials'] },
  {
    x: 0.38,
    label: 'LEARN',
    items: ['Future of AI Fellowship', 'Technical AI Safety Fellowship'],
    main: true,
  },
  {
    x: 0.66,
    label: 'ENGAGE',
    items: ['Official membership', 'Reading group', 'Retreats', 'Conferences'],
  },
  { x: 0.91, label: 'CONTRIBUTE', items: ['Research support', 'Organizing', 'Careers'] },
];

const itemY = (i, count) => CENTER_Y + (i - (count - 1) / 2) * NODE_SPACING;

// Curve ink per theme: accent legs into/out of the fellowship, neutral
// ink for the rest, matching the site's canvas treatment on each ground.
const INK = {
  light: { accentRGB: '0, 53, 107', neutral: 'rgba(23, 24, 26, 0.16)' },
  dark: { accentRGB: '143, 188, 238', neutral: 'rgba(242, 245, 249, 0.16)' },
};

function ProgramPathway() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ink = INK[theme] || INK.light;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 1;

      const anchors = STAGES.map((stage) =>
        stage.items.map((item, i) => ({
          x: stage.x * w,
          y: itemY(i, stage.items.length) - DOT_ANCHOR,
        }))
      );

      for (let s = 0; s < anchors.length - 1; s++) {
        // the legs into and out of the fellowship carry the accent color
        ctx.strokeStyle =
          s === 0 || s === 1
            ? `rgba(${ink.accentRGB}, ${s === 1 ? 0.28 : 0.22})`
            : ink.neutral;
        for (const a of anchors[s]) {
          for (const b of anchors[s + 1]) {
            const mx = (a.x + b.x) / 2;
            ctx.beginPath();
            ctx.moveTo(a.x + 6, a.y);
            ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x - 6, b.y);
            ctx.stroke();
          }
        }
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [theme]);

  return (
    <div className="program-pathway" aria-label="How our programs fit together">
      <div className="pathway-weave" style={{ height: PATHWAY_HEIGHT }}>
        <canvas ref={canvasRef} aria-hidden="true" />
        {STAGES.map((stage) => (
          <React.Fragment key={stage.label}>
            {stage.items.map((item, i) => (
              <div
                key={item}
                className={`pw-node${stage.main ? ' main' : ''}`}
                style={{
                  left: `${stage.x * 100}%`,
                  top: itemY(i, stage.items.length),
                }}
              >
                <div className="pw-dot" />
                <div className="pw-label">{item}</div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="pathway-stations">
        {STAGES.map((stage) => (
          <div
            className={`pathway-station${stage.main ? ' main' : ''}`}
            key={stage.label}
          >
            <ul>
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgramPathway;
