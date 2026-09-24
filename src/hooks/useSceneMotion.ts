import { useEffect, useRef } from 'react';
import { breakpointFor, clamp01, lerpPath, mixHex, type Breakpoint } from '../lib/morph';

export type SceneProps = {
  /** Displacement scale of the hand-drawn `rough` filter. */
  roughness: number;
  /** Whether the rough filter animates its seed (the "line boil"). */
  lineBoil: boolean;
  /** Global multiplier on every parallax term. */
  parallax: number;
};

type ParEl = HTMLElement & { __omPhase?: number; __omRot0?: number; __omY?: number };

/**
 * One requestAnimationFrame loop driving the whole scene: parallax, the responsive
 * breakpoint, the paper-to-ink ground fade, and the illustration morph.
 *
 * This writes to the DOM through refs rather than through React state on purpose.
 * The loop runs every frame, and routing sixty state updates a second through the
 * reconciler to move a background layer would be the wrong trade entirely.
 */
export function useSceneMotion({ roughness, lineBoil, parallax }: SceneProps) {
  const propsRef = useRef({ roughness, lineBoil, parallax });

  // The rAF loop below reads these asynchronously, so syncing after render is
  // both sufficient and the only place a ref may be written.
  useEffect(() => {
    propsRef.current = { roughness, lineBoil, parallax };
  }, [roughness, lineBoil, parallax]);

  const modeRef = useRef<Breakpoint | null>(null);

  useEffect(() => {
    // eased pointer position, and its raw target
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let warned = false;

    const applyRoughness = () => {
      const d = document.getElementById('om-rough-disp');
      if (d) d.setAttribute('scale', String(propsRef.current.roughness));
      const owner = (d as SVGElement | null)?.ownerSVGElement;
      if (owner) {
        try {
          // pauseAnimations is unsupported in some engines; the boil simply stays on
          if (propsRef.current.lineBoil) owner.unpauseAnimations();
          else owner.pauseAnimations();
        } catch {
          /* no-op */
        }
      }
    };

    const applyBreakpoint = (force: boolean) => {
      const w = window.innerWidth || 1280;
      const mode = breakpointFor(w);
      if (!force && modeRef.current === mode) return;
      modeRef.current = mode;

      const copy = document.getElementById('om-hero-copy');
      if (copy) copy.style.maxWidth = w < 900 ? '100%' : 'min(620px,58%)';

      // Geometry lives in CSS (right:0 + min(760px,56vw)) so the annotated panel
      // can never be clipped; only its opacity responds to the breakpoint.
      const table = document.getElementById('om-hero-table');
      if (table) table.style.opacity = mode === 'tight' ? '0.3' : '1';

      const hideSmall = mode === 'tight' || mode === 'small';
      document.querySelectorAll<HTMLElement>('[data-deco="small"]').forEach((el) => {
        el.style.display = hideSmall ? 'none' : 'block';
      });
      document.querySelectorAll<HTMLElement>('[data-deco="label"]').forEach((el) => {
        el.style.display = mode === 'tight' ? 'none' : 'block';
      });

      const deco = document.getElementById('om-deco-layer');
      if (deco) deco.style.opacity = mode === 'tight' ? '0.35' : '1';
    };

    const morph = (p: number, mp: number) => {
      // The handwriting is overwritten line by line by the typeset copy: a
      // soft-edged wipe, not a crossfade. Each line starts slightly after the last.
      const wipe = (el: HTMLElement | null, dir: 'in' | 'out') => {
        if (!el) return;
        el.querySelectorAll<HTMLElement>('[data-line]').forEach((line, i) => {
          const local = clamp01((p - (0.4 + i * 0.05)) / 0.16) * 100;
          const g =
            dir === 'out'
              ? `linear-gradient(to right, transparent ${(local - 7).toFixed(1)}%, #000 ${(local + 7).toFixed(1)}%)`
              : `linear-gradient(to right, #000 ${(local - 7).toFixed(1)}%, transparent ${(local + 7).toFixed(1)}%)`;
          line.style.webkitMaskImage = g;
          line.style.maskImage = g;
        });
      };
      wipe(document.getElementById('om-morph-doodle'), 'out');
      wipe(document.getElementById('om-morph-doodle-light'), 'in');

      const lede = document.getElementById('om-morph-lede');
      if (lede) {
        lede.querySelectorAll<HTMLElement>('p').forEach((el) => {
          const local = clamp01((p - 0.42) / 0.16) * 100;
          const light = el.hasAttribute('data-lede-light');
          const g = light
            ? `linear-gradient(to right, #000 ${(local - 7).toFixed(1)}%, transparent ${(local + 7).toFixed(1)}%)`
            : `linear-gradient(to right, transparent ${(local - 7).toFixed(1)}%, #000 ${(local + 7).toFixed(1)}%)`;
          el.style.webkitMaskImage = g;
          el.style.maskImage = g;
        });
      }

      const svg = document.getElementById('om-morph-svg');
      if (!svg) return;

      // Geometry rides the slow ramp so the whole arc plays while the illustration
      // is on screen. Colour crosses in one narrow window centred on the ground's
      // own crossover — endpoints are swapped, never lerped through mid-grey,
      // because mid-grey is exactly where the ground is at that moment.
      const g = mp;
      const cp = clamp01((p - 0.485) / 0.03);

      const disp = document.getElementById('om-morph-disp');
      if (disp) disp.setAttribute('scale', String(propsRef.current.roughness * (1 - g)));

      svg.setAttribute('stroke-width', (2.6 - 1.2 * g).toFixed(2));
      const inkColor = mixHex('#212930', '#c2c4c3', cp);
      svg.setAttribute('stroke', inkColor);

      svg.querySelectorAll<SVGElement>('[data-morph]').forEach((el) => {
        const role = el.getAttribute('data-morph');
        if (el.hasAttribute('data-d0')) lerpPath(el, g);
        if (role === 'fill-paper') el.setAttribute('fill', mixHex('#ffffff', '#293138', cp));
        else if (role === 'accent-fill') el.setAttribute('fill', mixHex('#475625', '#859857', cp));
        else if (role === 'fill-soft') {
          el.setAttribute('fill', mixHex('#a7acaa', '#39424a', cp));
          el.setAttribute('opacity', String(0.55 + cp * 0.45));
        } else if (role === 'stroke-accent')
          el.setAttribute('stroke', mixHex('#475625', '#859857', cp));
        else if (role === 'stroke-dim') el.setAttribute('opacity', String(0.7 - cp * 0.25));
        else if (role === 'stroke-ghost')
          el.setAttribute('opacity', String(0.34 * (1 - cp * 0.55)));
        else if (role === 'node-accent') {
          el.setAttribute('fill', mixHex('#475625', '#859857', cp));
          el.setAttribute('stroke', inkColor);
        } else if (role === 'node') {
          el.setAttribute('fill', mixHex('#ffffff', '#293138', cp));
          el.setAttribute('stroke', inkColor);
        }
      });
    };

    const update = () => {
      const vh = window.innerHeight || 900;
      applyBreakpoint(false);
      const strength = propsRef.current.parallax;
      const now = (window.performance ? performance.now() : Date.now()) / 1000;

      // Ease the pointer toward its target so motion feels weighted, not twitchy.
      mx += ((tx || 0) - mx) * 0.06;
      my += ((ty || 0) - my) * 0.06;

      document.querySelectorAll<ParEl>('[data-par]').forEach((el, index) => {
        const speed = parseFloat(el.getAttribute('data-par')!) * strength;
        const cap = parseFloat(el.getAttribute('data-par-max') || '110');
        const amp = parseFloat(el.getAttribute('data-float') || '0') * strength;
        const fspeed = parseFloat(el.getAttribute('data-float-speed') || '0.5');
        const mouse = parseFloat(el.getAttribute('data-mouse') || '0') * strength;
        const rotAmt = parseFloat(el.getAttribute('data-rot') || '0') * strength;

        if (el.__omPhase === undefined) {
          // A golden-angle offset per element, so neighbours never bob in unison
          // and the spread stays even however many decorations the scene has.
          el.__omPhase = (index * 2.399963) % (Math.PI * 2);
          el.__omRot0 = parseFloat(el.getAttribute('data-rot0') || '0');
        }

        const r = el.getBoundingClientRect();
        const applied = el.__omY || 0;
        const center = r.top + r.height / 2 - applied;
        const scrollTerm = Math.max(-cap, Math.min(cap, (vh / 2 - center) * speed));
        const phase = el.__omPhase!;

        const y = scrollTerm + Math.sin(now * fspeed + phase) * amp + my * mouse * 0.45;
        const x = mx * mouse + Math.cos(now * fspeed * 0.8 + phase) * amp * 0.5;
        const rot =
          el.__omRot0! + mx * rotAmt + Math.sin(now * fspeed * 0.6 + phase) * rotAmt * 0.35;
        const scale = 1 + Math.sin(now * fspeed * 0.45 + phase) * (amp > 0 ? 0.012 : 0);

        el.__omY = y;
        el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        el.style.willChange = 'transform';
      });

      const anchor = document.getElementById('om-anchor');
      const paper = document.getElementById('om-paper');
      const grain = document.getElementById('om-grain');
      if (!anchor) return;

      const ar = anchor.getBoundingClientRect();
      const t = clamp01((vh * 0.6 - ar.top) / (vh * 0.75));
      if (paper) paper.style.opacity = String(1 - t);
      // The grain belongs to the paper, so it leaves on the same ramp.
      if (grain) grain.style.opacity = String(1 - t);

      // The illustration morph runs over a much longer scroll distance than the
      // ground ramp, tied to the illustration's own viewport position.
      const msvg = document.getElementById('om-morph-svg');
      const sr = msvg ? msvg.getBoundingClientRect() : null;
      const slow = sr ? clamp01((vh * 0.7 - sr.top) / (vh * 0.8)) : t;
      morph(t, slow);
    };

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 800;
      tx = Math.max(-1, Math.min(1, (e.clientX - w / 2) / (w / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - h / 2) / (h / 2)));
    };
    const onResize = () => applyBreakpoint(true);

    applyRoughness();
    applyBreakpoint(true);
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });

    const loop = () => {
      try {
        update();
      } catch (e) {
        if (!warned) {
          warned = true;
          console.warn('[vallix] parallax frame error', e);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // Prop changes reach the loop through propsRef, but the filter attribute is set
  // outside it, so it needs its own sync.
  useEffect(() => {
    const d = document.getElementById('om-rough-disp');
    if (d) d.setAttribute('scale', String(roughness));
    const owner = (d as SVGElement | null)?.ownerSVGElement;
    if (owner) {
      try {
        if (lineBoil) owner.unpauseAnimations();
        else owner.pauseAnimations();
      } catch {
        /* no-op */
      }
    }
  }, [roughness, lineBoil]);
}
