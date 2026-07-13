import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { whenPerfTier } from '../perf';

/*
 * Hero thread field. Lines run left to right and converge into a shared
 * stream at the right edge. Two layers:
 *
 * 1. Ambient texture — four octaves of spatial sine noise (perlin-like,
 *    sampled per x step so fine detail renders), every octave phased as a
 *    traveling wave (k*x - k*v*t) with a shared rightward velocity, so the
 *    whole texture slides toward the stream instead of bobbing in place.
 *    The big tangle octave drifts slowly; amplitude of each octave decays
 *    toward the stream, finer octaves faster.
 *
 * 2. Interaction — a chain of spring-damper control points per thread,
 *    adapted from the cantor8.io hero. The cursor injects velocity
 *    impulses scaled by its speed, springs are underdamped so plucks ring,
 *    neighbor coupling + advection carry disturbances downstream. Spring
 *    offsets are interpolated onto the per-x curve at draw time.
 */
const CFG = {
  threads: 46,
  // interaction chain
  segments: 12,
  segmentBias: 1.32, // >1 clusters control points toward the left
  stiffness: 13,
  damping: 4.6, // < critical, so threads overshoot and ring
  coupling: 34,
  advection: 4.5, // pull toward left neighbor: plucks convect downstream
  maxBend: 320,
  mouseRadius: 140,
  impulseForce: 5200,
  impulseFalloff: 1.7,
  speedGainBase: 0.55,
  speedGainPerPx: 0.085,
  speedGainMax: 2.2,
  // ambient traveling texture (left-edge amplitudes, px)
  flowV: -78, // shared rightward phase velocity, px/s
  tangleAmp: 100, // huge, near-static weave
  tangleK: [0.0030, 0.0050],
  tangleV: -50, // the tangle creeps right much slower than the texture
  wob1Amp: 10, // large octave
  wob1K: [0.006, 0.011],
  wob2Amp: 5, // small octave
  wob2K: [0.016, 0.028],
  wob3Amp: 1, // fine octave
  wob3K: [0.040, 0.065],
  calmPow: 1.4, // how hard the texture dies toward the stream
  driftFreq: 0.05, // very slow shape morph on top of the translation
  convergeSpread: 0.075,
  // brightness pulse toward the stream
  flowSpeed: 0.16,
  flowWidth: 0.32,
  heatGain: 3.0, // how fast cursor impulses build the tint
  heatDecay: 2.2, // 1/s; back to grey within about a second and a half
};

// Thread ink per theme. On paper: grey threads whose plucks flash toward
// Yale blue. On Nightfall: silver-blue threads flashing toward the bright
// accent, run slightly dimmer at rest so the dark ground keeps its depth.
const INK = {
  light: {
    strokeRGB: '163,167,164',
    heatRGB: '0,53,107',
    alphaBase: 0.42,
    alphaPeak: 0.74,
    heatAlpha: 0.1,
  },
  dark: {
    // rest and heat need real distance on the dark ground: silver-blue at
    // rest, near-white ice on pluck, plus an alpha kick so it reads
    strokeRGB: '138,166,198',
    heatRGB: '228,242,255',
    alphaBase: 0.36,
    alphaPeak: 0.8,
    heatAlpha: 0.25,
  },
};

function HeroLines({ speed = 1 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    const ink = INK[theme] || INK.light;

    // Low tier: half the threads, coarser sampling, fewer pixels, 30fps.
    const q = { low: false };
    const unsubPerf = whenPerfTier((t) => {
      q.low = t === 'low';
    });
    // No cursor on touch devices: the spring/pluck layer is dead weight
    // there, and the canvas is small enough to keep full resolution.
    const isTouch = window.matchMedia('(hover: none)').matches;

    // Deterministic PRNG so the field looks the same on every load
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const inRange = ([a, b]) => a + rand() * (b - a);

    const K = CFG.segments;
    const smooth = (u) => u * u * (3 - 2 * u);
    const baseRGB = ink.strokeRGB.split(',').map(Number);
    const heatRGB = ink.heatRGB.split(',').map(Number);

    const threads = [];
    for (let i = 0; i < CFG.threads; i++) {
      const frac = i / (CFG.threads - 1);
      const points = [];
      for (let k = 0; k < K; k++) {
        points.push({ off: 0, vel: 0 });
      }
      threads.push({
        frac,
        points,
        ampJ: 0.75 + rand() * 0.8,
        vJ: 0.85 + rand() * 0.3, // slight per-thread speed jitter
        k0: inRange(CFG.tangleK), p0: rand() * 6.283,
        k1: inRange(CFG.wob1K), p1: rand() * 6.283,
        k2: inRange(CFG.wob2K), p2: rand() * 6.283,
        k3: inRange(CFG.wob3K), p3: rand() * 6.283,
        drift: rand() * 6.283,
        heat: 0,
      });
    }

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
      // phones keep full sharpness (small canvas, 3x screens make 1x look
      // crunchy); slow desktops drop to 1.5x, not 1x
      const dpr = Math.min(window.devicePixelRatio || 1, isTouch ? 2 : q.low ? 1.5 : 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      return { w, h, dpr };
    };

    // reusable buffers for the interaction chain (x, offset at x)
    const cpX = new Float64Array(K + 2);
    const cpOff = new Float64Array(K + 2);

    let raf;
    let running = false;
    let frame = 0;
    let prev = performance.now();
    let t = 0;
    const draw = (now) => {
      if (!running) return;
      frame++;

      // Parallax updates every rAF, even on skipped frames — a 30fps
      // transform against native scrolling reads as vibration.
      const sy = window.scrollY || 0;
      wrap.style.transform = `translateY(${(sy * 0.35).toFixed(1)}px)`;

      // 30fps canvas on the low tier — but only when rAF is actually
      // running fast. If the browser is already throttled (iOS Low Power
      // Mode runs rAF at 30fps), skipping would halve to 15fps.
      if (q.low && frame % 2 && now - prev < 25) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const dt = Math.min((now - prev) / 1000, 0.033);
      prev = now;
      t += dt * speed;

      const { w, h, dpr } = dprSize();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const bandY = h * 0.5;
      const mouseSpeed = Math.hypot(mouse.vx, mouse.vy);
      const speedGain = Math.min(CFG.speedGainMax, CFG.speedGainBase + mouseSpeed * CFG.speedGainPerPx);
      // decay the sampled velocity so a resting cursor stops plucking hard
      mouse.vx *= 0.8; mouse.vy *= 0.8;

      const flowPhase = (t * CFG.flowSpeed) % 1;
      const spacing = w / (K + 1);
      const ellipse = 1 / (1 + spacing / CFG.mouseRadius);
      const step = q.low ? Math.max(16, w / 90) : Math.max(10, w / 150);

      // One gradient serves every unheated thread this frame; only threads
      // mid-flash pay for their own (gradient allocation is expensive)
      const gradientFor = (e) => {
        const cr = Math.round(baseRGB[0] + (heatRGB[0] - baseRGB[0]) * e);
        const cg = Math.round(baseRGB[1] + (heatRGB[1] - baseRGB[1]) * e);
        const cb = Math.round(baseRGB[2] + (heatRGB[2] - baseRGB[2]) * e);
        const g = ctx.createLinearGradient(0, 0, w, 0);
        for (let si = 0; si <= 5; si++) {
          const uu = si / 5;
          let d = Math.abs(uu - flowPhase);
          d = Math.min(d, 1 - d);
          const ss = Math.max(0, 1 - d / CFG.flowWidth);
          const a = Math.min(
            1,
            ink.alphaBase + (ink.alphaPeak - ink.alphaBase) * ss * ss * (3 - 2 * ss) + e * ink.heatAlpha
          );
          g.addColorStop(uu, `rgba(${cr},${cg},${cb},${a.toFixed(4)})`);
        }
        return g;
      };
      const coldGradient = gradientFor(0);

      for (let ti = 0; ti < threads.length; ti++) {
        if (q.low && ti % 2) continue; // half the field on slow devices
        const T = threads[ti];
        T.heat *= Math.exp(-CFG.heatDecay * dt);
        if (T.heat < 0.002) T.heat = 0;
        const y0 = h * 0.03 + T.frac * h * 0.92;
        const target = bandY + (T.frac - 0.5) * h * CFG.convergeSpread;
        // keep the outermost threads' tangle from leaving the canvas
        const edgeCalm = Math.min(1, Math.min(y0, h - y0) / (h * 0.3));
        const drift = Math.sin(t * CFG.driftFreq + T.drift) * 0.7;
        const shift = CFG.flowV * T.vJ * t; // rightward translation of the texture
        const shiftSlow = CFG.tangleV * T.vJ * t;

        // --- interaction chain physics (springs rest at 0; ambient motion
        // lives in the texture layer); no cursor on touch, so skip it ---
        if (!isTouch) {
        cpX[0] = 0; cpOff[0] = 0;
        for (let k = 0; k < K; k++) {
          const u = Math.pow((k + 1) / (K + 1), CFG.segmentBias);
          const s = smooth(u);
          const rest = (1 - s) * y0 + s * target;
          const interactCalm = 1 - s * 0.6;
          const P = T.points[k];

          if (mouse.active) {
            const dx = (u * w - mouse.x) * ellipse;
            const dy = rest + P.off - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < CFG.mouseRadius) {
              const falloff = Math.pow(1 - d / CFG.mouseRadius, CFG.impulseFalloff);
              const side = dy >= 0 ? 1 : -1; // push away from the cursor
              P.vel += side * falloff * CFG.impulseForce * speedGain * interactCalm * dt;
              T.heat = Math.min(1, T.heat + falloff * speedGain * CFG.heatGain * dt);
            }
          }

          const left = k === 0 ? 0 : T.points[k - 1].off;
          const right = k === K - 1 ? 0 : T.points[k + 1].off;
          const acc =
            -CFG.stiffness * P.off -
            CFG.damping * P.vel +
            CFG.coupling * (left + right - 2 * P.off) +
            CFG.advection * (left - P.off); // disturbances convect downstream
          P.vel += acc * dt;
          P.off += P.vel * dt;
          if (P.off > CFG.maxBend) P.off = CFG.maxBend;
          if (P.off < -CFG.maxBend) P.off = -CFG.maxBend;

          cpX[k + 1] = u * w;
          cpOff[k + 1] = P.off;
        }
        cpX[K + 1] = w; cpOff[K + 1] = 0;
        }

        // brightness pulse traveling toward the stream; heat lerps the
        // stroke from grey toward yale blue while a pluck rings out
        ctx.strokeStyle = T.heat === 0 ? coldGradient : gradientFor(T.heat);

        // --- per-x draw: converging rest + traveling texture + interaction ---
        ctx.beginPath();
        let seg = 0;
        for (let x = 0; x <= w + step; x += step) {
          const xc = Math.min(x, w);
          const u = xc / w;
          const s = smooth(u);
          const rest = (1 - s) * y0 + s * target;

          const calm = Math.pow(1 - s, CFG.calmPow) * T.ampJ;
          const fine = 1 - s;
          const wob =
            (CFG.tangleAmp * edgeCalm * Math.sin(T.k0 * (xc - shiftSlow) + T.p0 + drift) +
              CFG.wob1Amp * Math.sin(T.k1 * (xc - shift) + T.p1 + drift) +
              CFG.wob2Amp * fine * Math.sin(T.k2 * (xc - shift) + T.p2) +
              CFG.wob3Amp * fine * fine * Math.sin(T.k3 * (xc - shift) + T.p3)) *
            calm;

          // interpolate the interaction chain's offset at this x
          let springOff = 0;
          if (!isTouch) {
            while (seg < K && cpX[seg + 1] < xc) seg++;
            const span = cpX[seg + 1] - cpX[seg] || 1;
            const f = (xc - cpX[seg]) / span;
            const fs = f * f * (3 - 2 * f);
            springOff = cpOff[seg] * (1 - fs) + cpOff[seg + 1] * fs;
          }

          const y = rest + wob + springOff;
          if (x === 0) ctx.moveTo(xc, y); else ctx.lineTo(xc, y);
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    // Only simulate while the hero is actually on screen
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
    io.observe(wrap);

    return () => {
      io.disconnect();
      stop();
      unsubPerf();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [speed, theme]);

  return (
    <div ref={wrapRef} className="hero-art">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-blur hero-blur-near" />
      <div className="hero-blur hero-blur-deep" />
      <div className="hero-fade" />
    </div>
  );
}

export default HeroLines;
