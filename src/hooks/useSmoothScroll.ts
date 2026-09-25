import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Lenis smooth scrolling for the marketing pages.
 *
 * Lenis smooths the real scroll position rather than transforming a wrapper, so
 * `getBoundingClientRect` still reports the truth — which matters here, because the
 * whole paper-to-ink transition is driven by measuring where elements sit in the
 * viewport. Native `scroll-behavior: smooth` has to be off while it runs, or the
 * two fight over the same scroll; Lenis marks the root with `.lenis` and the
 * stylesheet defers to it.
 *
 * In-page anchors are routed through Lenis too, otherwise clicking a nav link
 * would jump while every other scroll eased.
 */
let current: Lenis | null = null;

/** The running Lenis instance, for components that need to drive the scroll. */
export function getLenis(): Lenis | null {
  return current;
}

export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    current = lenis;

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const id = a?.getAttribute('href');
      if (!a || !id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -8 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      current = null;
    };
  }, []);
}
