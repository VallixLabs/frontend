import { useEffect, type RefObject } from 'react';

/**
 * Collapse two-column stage grids to one column based on the CANVAS width, not the
 * window's.
 *
 * A media query would be wrong here: the run-history drawer overlays 320px of the
 * canvas, so the window can be wide while the usable area is not. Each grid carries
 * its wide template in `data-wbgrid` and is collapsed below 760px of actual canvas.
 */
export function useCanvasGrid(canvasRef: RefObject<HTMLDivElement | null>, layoutKey: string) {
  useEffect(() => {
    const fit = () => {
      const canvas = canvasRef.current;
      const w = canvas ? canvas.clientWidth : window.innerWidth;
      document.querySelectorAll<HTMLElement>('[data-wbgrid]').forEach((g) => {
        g.style.gridTemplateColumns =
          w < 760 ? 'minmax(0,1fr)' : g.getAttribute('data-wbgrid') || '';
      });
    };

    fit();
    window.addEventListener('resize', fit);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && canvasRef.current) {
      ro = new ResizeObserver(fit);
      ro.observe(canvasRef.current);
    }

    return () => {
      window.removeEventListener('resize', fit);
      ro?.disconnect();
    };
    // `layoutKey` changes whenever the rendered stage or the drawer does, since each
    // stage brings its own grids and the drawer changes the width they must fit.
  }, [canvasRef, layoutKey]);
}
