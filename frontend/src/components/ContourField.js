import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { whenPerfTier } from '../perf';

/*
 * Programs-page half-hero: closed topographic loops around two off-canvas
 * centers — the hero threads' material (1px ink lines, spring physics,
 * blue heat flash on pluck) in a different geometry. Each ring carries a
 * closed chain of spring-damper control points storing radial offsets;
 * the cursor injects radial impulses that ring around the loop, and a
 * plucked ring flashes toward Yale blue before cooling back.
 */
const CFG = {
  centers: [
    { cx: 0.78, cy: 0.05, rings: 14 },
    { cx: 0.22, cy: -0.25, rings: 10 },
  ],
  baseR: 34,
  gapR: 30,
  squash: 0.82, // rings are slightly elliptical, like map contours
  segments: 28, // control points per ring
  stiffness: 14,
  damping: 5,
  coupling: 30,
  maxBend: 120,
  mouseRadius: 110,
  impulseForce: 4200,
  impulseFalloff: 1.7,
  speedGainBase: 0.55,
  speedGainPerPx: 0.085,
  speedGainMax: 2.2,
  alphaBase: 0.15, // outermost rings print lighter
  alphaPerRing: 0.005,
  heatGain: 3.0,
  heatDecay: 2.2,
  heatAlpha: 0.22, // plucked rings also print a touch stronger
  breatheA: 0.25, // slow ambient morph speeds
  breatheB: 0.18,
};

// Ring ink per theme, mirroring the homepage threads: ink lines flashing
// toward Yale blue on paper, silver-blue flashing toward the bright accent
// on Nightfall.
const INK = {
  light: { strokeRGB: [23, 24, 26], heatRGB: [0, 53, 107] },
  dark: { strokeRGB: [138, 166, 198], heatRGB: [143, 188, 238] },
};

function ContourField() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const ink = INK[theme] || INK.light;
    const K = CFG.segments;

    // The field's interactivity is cursor-only, so touch devices get a
    // single static frame; slow devices get coarser sampling at 30fps.
    const isTouch = window.matchMedia('(hover: none)').matches;
    const q = { low: false };
    const unsubPerf = whenPerfTier((t) => {
      q.low = t === 'low';
    });

    const rings = [];
    CFG.centers.forEach((center, ci) => {
      for (let k = 0; k < center.rings; k++) {
        rings.push({
          ci,
          k,
          heat: 0,
          points: Array.from({ length: K }, () => ({ off: 0, vel: 0 })),
        });
      }
    });

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, active: false };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (mouse.active) {
        mouse.vx = nx - mouse.px;
        mouse.vy = ny - mouse.py;
      }
      mouse.px = nx; mouse.py = ny;
      mouse.x = nx; mouse.y = ny;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.vx = 0; mouse.vy = 0; };
    if (!isTouch) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseout', onLeave);
      window.addEventListener('blur', onLeave);
    }

    const dprSize = () => {
      // touch renders a single static frame, so keep it sharp; slow
      // desktops drop to 1.5x rather than a visibly crunchy 1x
      const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 2 : q.low ? 1.5 : 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      return { w, h, dpr };
    };

    const wob = (theta, ring, t) =>
      Math.sin(theta * 3 + ring.k * 1.7 + ring.ci * 2 + t * CFG.breatheA) * (6 + ring.k * 1.2) +
      Math.sin(theta * 5 - ring.k * 0.9 - t * CFG.breatheB) * 4;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf;
    let running = false;
    let frame = 0;
    let prev = performance.now();
    let t = 0;
    const TWO_PI = Math.PI * 2;

    const draw = (now) => {
      if (!running) return;
      frame++;
      // skip only when rAF is genuinely fast; if the browser is already
      // throttled to 30fps, skipping would halve to 15fps
      if (q.low && frame % 2 && now - prev < 25) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dt = Math.min((now - prev) / 1000, 0.033);
      prev = now;
      if (!reduceMotion.matches) t += dt;

      const { w, h, dpr } = dprSize();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);
      const speedGain = Math.min(CFG.speedGainMax, CFG.speedGainBase + mouseSpeed * CFG.speedGainPerPx);
      mouse.vx *= 0.8; mouse.vy *= 0.8;

      for (const ring of rings) {
        ring.heat *= Math.exp(-CFG.heatDecay * dt);
        if (ring.heat < 0.002) ring.heat = 0;

        const center = CFG.centers[ring.ci];
        const cx = center.cx * w, cy = center.cy * h;
        const base = CFG.baseR + ring.k * CFG.gapR;

        // physics on the closed control-point chain
        for (let k = 0; k < K; k++) {
          const theta = (k / K) * TWO_PI;
          const P = ring.points[k];
          const rRest = base + wob(theta, ring, t);

          if (mouse.active && !reduceMotion.matches) {
            const px = cx + Math.cos(theta) * (rRest + P.off);
            const py = cy + Math.sin(theta) * (rRest + P.off) * CFG.squash;
            const d = Math.hypot(mouse.x - px, mouse.y - py);
            if (d < CFG.mouseRadius) {
              const falloff = Math.pow(1 - d / CFG.mouseRadius, CFG.impulseFalloff);
              const rMouse = Math.hypot(mouse.x - cx, (mouse.y - cy) / CFG.squash);
              const side = rRest + P.off > rMouse ? 1 : -1; // push away radially
              P.vel += side * falloff * CFG.impulseForce * speedGain * dt;
              ring.heat = Math.min(1, ring.heat + falloff * speedGain * CFG.heatGain * dt);
            }
          }

          const left = ring.points[(k - 1 + K) % K].off;
          const right = ring.points[(k + 1) % K].off;
          const acc =
            -CFG.stiffness * P.off -
            CFG.damping * P.vel +
            CFG.coupling * (left + right - 2 * P.off);
          P.vel += acc * dt;
          P.off += P.vel * dt;
          if (P.off > CFG.maxBend) P.off = CFG.maxBend;
          if (P.off < -CFG.maxBend) P.off = -CFG.maxBend;
        }

        // color: base ink lerped toward the heat accent by pluck energy
        const e = ring.heat;
        const cr = Math.round(ink.strokeRGB[0] + (ink.heatRGB[0] - ink.strokeRGB[0]) * e);
        const cg = Math.round(ink.strokeRGB[1] + (ink.heatRGB[1] - ink.strokeRGB[1]) * e);
        const cb = Math.round(ink.strokeRGB[2] + (ink.heatRGB[2] - ink.strokeRGB[2]) * e);
        const alpha = Math.max(0.03, CFG.alphaBase - ring.k * CFG.alphaPerRing) + e * CFG.heatAlpha;
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(4)})`;

        // draw the loop, smoothstep-interpolating spring offsets
        ctx.beginPath();
        const S = q.low ? 72 : 120;
        for (let s = 0; s <= S; s++) {
          const theta = (s / S) * TWO_PI;
          const fk = (theta / TWO_PI) * K;
          const k0 = Math.floor(fk) % K;
          const k1 = (k0 + 1) % K;
          const f = fk - Math.floor(fk);
          const fs = f * f * (3 - 2 * f);
          const off = ring.points[k0].off * (1 - fs) + ring.points[k1].off * fs;
          const r = base + wob(theta, ring, t) + off;
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r * CFG.squash;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      if (isTouch || reduceMotion.matches) {
        running = false; // one composed frame is the whole show
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    // Only simulate while the field is on screen
    const start = () => {
      if (running) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(canvas);

    // the static (touch/reduced-motion) frame still needs a redraw when
    // the viewport changes, e.g. phone rotation
    const onResize = () => start();
    window.addEventListener('resize', onResize);

    return () => {
      io.disconnect();
      stop();
      window.removeEventListener('resize', onResize);
      unsubPerf();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="contour-canvas" aria-hidden="true" />;
}

export default ContourField;
