import { useEffect } from 'react';

/**
 * Two hover treatments the design applies by attribute rather than by component,
 * because they decorate surfaces of several different shapes:
 *
 *   [data-shine]  a specular flare sweeps across the surface once, on enter
 *   [data-tilt]   the surface tips toward the pointer in 3D
 *
 * Binding is idempotent and every listener is released on cleanup, so the effect
 * can run as many times as React chooses to run it. It deliberately does NOT mark
 * elements as already-bound: under StrictMode the effect runs mount → cleanup →
 * mount, and a marker that outlives the cleanup would make the second mount skip
 * elements whose listeners had just been removed, leaving both effects dead.
 *
 * An element carrying [data-tilt] owns its own `transform` outright. Nothing else
 * may write that property on the same element, or the two will overwrite each
 * other — see the nested card in ModelSteps for how that is kept apart.
 */
export function useSurfaceFx() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>('[data-shine]').forEach((el) => {
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

      const onEnter = () => {
        // Clip the flare in its own wrapper, never on the card itself — pricing
        // badges deliberately overflow their card and must not be cut off.
        const clip = document.createElement('span');
        clip.style.cssText =
          'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:4';
        const flare = document.createElement('span');
        flare.style.cssText =
          'position:absolute;top:-30%;bottom:-30%;left:0;width:120%;background:linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0.09) 42%, rgba(255,255,255,0.13) 50%, rgba(255,255,255,0.09) 58%, rgba(255,255,255,0.03) 74%, rgba(255,255,255,0) 100%)';
        clip.appendChild(flare);
        el.appendChild(clip);

        const anim = flare.animate(
          [
            { transform: 'translateX(-115%) skewX(-10deg)' },
            { transform: 'translateX(115%) skewX(-10deg)' },
          ],
          { duration: 1700, easing: 'cubic-bezier(.33,.05,.2,1)' },
        );
        anim.onfinish = () => clip.remove();
        anim.oncancel = () => clip.remove();
        cleanups.push(() => {
          anim.cancel();
          clip.remove();
        });
      };

      el.addEventListener('pointerenter', onEnter);
      cleanups.push(() => el.removeEventListener('pointerenter', onEnter));
    });

    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
      el.style.transformStyle = 'preserve-3d';

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform .08s linear';
        el.style.transform = `perspective(1200px) rotateY(${(nx * 11).toFixed(2)}deg) rotateX(${(-ny * 9).toFixed(2)}deg) translateZ(14px) scale(1.012)`;
        el.style.boxShadow = `${(-nx * 40).toFixed(0)}px ${(-ny * 30 + 26).toFixed(0)}px 60px rgba(0,0,0,0.45)`;
      };
      const onLeave = () => {
        el.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s ease';
        el.style.transform = 'none';
        el.style.boxShadow = 'none';
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        // Leave no half-applied tilt behind if the effect is torn down mid-hover.
        el.style.transform = '';
        el.style.boxShadow = '';
        el.style.transition = '';
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
