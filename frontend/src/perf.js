/*
 * One-shot device performance probe. Samples ~50 frames of rAF cadence
 * shortly after load — while the page's own canvases are already running,
 * so the measurement reflects real load — and classifies the device into
 * 'high' or 'low'. 'low' also stamps a .perf-low class on <html> so CSS
 * can shed expensive effects (the hero's backdrop-filter layers).
 *
 * Consumers register a callback with whenPerfTier; it fires immediately
 * if the tier is already known. The probe runs once per page load.
 */
let tier = null;
let started = false;
const waiters = [];

export function whenPerfTier(cb) {
  if (tier) {
    cb(tier);
    return () => {};
  }
  waiters.push(cb);

  if (!started) {
    started = true;
    // wait out load jank (font loads, lottie parse, first paints) so we
    // measure steady state, not startup
    setTimeout(() => {
      const samples = [];
      let prev = performance.now();
      const probe = (now) => {
        samples.push(now - prev);
        prev = now;
        if (samples.length < 50) {
          requestAnimationFrame(probe);
          return;
        }
        const sorted = samples.slice(5).sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        tier = median > 20 ? 'low' : 'high'; // 20ms ≈ can't hold 50fps
        if (tier === 'low') {
          document.documentElement.classList.add('perf-low');
        }
        waiters.splice(0).forEach((w) => w(tier));
      };
      requestAnimationFrame(probe);
    }, 1200);
  }

  return () => {
    const i = waiters.indexOf(cb);
    if (i >= 0) waiters.splice(i, 1);
  };
}
