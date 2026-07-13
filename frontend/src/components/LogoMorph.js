import React, { useEffect, useRef } from 'react';
// the light build ships only the SVG renderer, which is all we use —
// roughly half the bundle weight of the full player
import lottie from 'lottie-web/build/player/lottie_light';
import wordmarkAnimation from '../assets/wordmark.json';

// px of scroll before the nav collapses; shared with the navbar pill state
export const COLLAPSE_AT = 70;

/*
 * Nav logo, Anthropic-style: the full "Yale AI Alignment" wordmark at the
 * top of the page, collapsing to the YAIA ligature lettermark once the
 * user scrolls. The morph itself is an After Effects–authored Lottie
 * whose final frame is the exact lettermark; this component only decides
 * direction and when to play it.
 */
function LogoMorph() {
  const boxRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: boxRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: wordmarkAnimation,
      // slice + left anchor: shrinking the container width crops the empty
      // right side of the comp instead of scaling the glyphs down
      rendererSettings: { preserveAspectRatio: 'xMinYMid slice' },
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const lastFrame = anim.totalFrames - 1;
    let collapsed = window.scrollY > COLLAPSE_AT;
    anim.goToAndStop(collapsed ? lastFrame : 0, true);

    const onScroll = () => {
      const should = window.scrollY > COLLAPSE_AT;
      if (should === collapsed) return;
      collapsed = should;
      if (reduceMotion.matches) {
        anim.goToAndStop(should ? lastFrame : 0, true);
        return;
      }
      anim.setDirection(should ? 1 : -1);
      anim.play();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      anim.destroy();
    };
  }, []);

  return <div ref={boxRef} className="logo-morph" aria-hidden="true" />;
}

export default LogoMorph;
