import { useCallback, useEffect, useRef, useState } from 'react';

const DWELL_SECONDS = 6;

/**
 * The three-step carousel in the Model section.
 *
 * `step` is React state because it changes about once every six seconds and drives
 * which card renders. Progress within a step is *not* state — it moves every frame,
 * and is written straight onto the progress bars through refs. Reconciling that
 * sixty times a second to animate a two-pixel rule would be the wrong trade.
 *
 * The carousel advances only while the section is in view, and pauses on hover so
 * a reader who reaches for a step is not overruled mid-reach.
 */
export function useStepCarousel(total: number) {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const progressRef = useRef(0);
  const hoverRef = useRef(false);
  const barsRef = useRef<Array<HTMLDivElement | null>>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // The rAF loop reads stepRef asynchronously, so an effect is the right place
  // to mirror the state into it.
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const registerBar = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      barsRef.current[i] = el;
    },
    [],
  );

  const select = useCallback((i: number) => {
    progressRef.current = 0;
    setStep(i);
  }, []);

  const hoverHandlers = {
    onPointerEnter: () => {
      hoverRef.current = true;
    },
    onPointerLeave: () => {
      hoverRef.current = false;
    },
  };

  useEffect(() => {
    let raf = 0;
    let last = 0;

    const frame = () => {
      const now = (window.performance ? performance.now() : Date.now()) / 1000;
      const dt = last ? Math.min(0.1, now - last) : 0;
      last = now;

      const wrap = wrapRef.current;
      if (wrap) {
        const vh = window.innerHeight || 900;
        const r = wrap.getBoundingClientRect();
        const inView = r.top < vh * 0.85 && r.bottom > vh * 0.15;

        if (inView && !hoverRef.current) {
          progressRef.current += dt / DWELL_SECONDS;
          if (progressRef.current >= 1) {
            progressRef.current = 0;
            setStep((s) => (s + 1) % total);
          }
        }

        barsRef.current.forEach((bar, i) => {
          if (!bar) return;
          bar.style.width = `${(i === stepRef.current ? progressRef.current * 100 : 0).toFixed(1)}%`;
        });
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  return { step, select, registerBar, wrapRef, hoverHandlers };
}
