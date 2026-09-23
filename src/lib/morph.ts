/** Small numeric helpers shared by the scroll-driven morph. */

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const mixHex = (h1: string, h2: string, p: number) => {
  const n = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const a = n(h1);
  const b = n(h2);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * p)).join(',')})`;
};

type ParsedPath = { parts: string[]; nums: (number | null)[] };

type MorphEl = SVGElement & {
  __om0?: ParsedPath;
  __om1?: ParsedPath;
  __omBad?: boolean;
};

const parsePath = (d: string): ParsedPath => {
  const parts = d.split(/(-?[\d.]+)/);
  return { parts, nums: parts.map((x, i) => (i % 2 ? parseFloat(x) : null)) };
};

/**
 * Interpolate a path between its `data-d0` and `data-d1` forms.
 *
 * Both strings must share a command skeleton — the numbers are zipped positionally,
 * so a mismatch would pair a coordinate from one command with a coordinate from
 * another and tear the shape apart. That case holds the doodle state and warns
 * rather than rendering garbage.
 */
export const lerpPath = (el: MorphEl, p: number) => {
  if (!el.__om0) {
    el.__om0 = parsePath(el.getAttribute('data-d0') ?? '');
    el.__om1 = parsePath(el.getAttribute('data-d1') ?? '');
    const skeleton = (o: ParsedPath) => o.parts.filter((_, i) => !(i % 2)).join('');
    if (
      skeleton(el.__om0) !== skeleton(el.__om1) ||
      el.__om0.parts.length !== el.__om1.parts.length
    ) {
      console.warn('[vallix] morph skeleton mismatch, holding doodle state', el);
      el.__omBad = true;
    }
  }
  if (el.__omBad) return;
  const a = el.__om0!;
  const b = el.__om1!;
  const out = a.parts.map((seg, i) =>
    i % 2 ? (a.nums[i]! + (b.nums[i]! - a.nums[i]!) * p).toFixed(1) : seg,
  );
  el.setAttribute('d', out.join(''));
};

export type Breakpoint = 'tight' | 'small' | 'mid' | 'wide';

/** Full scene down to 820px; only genuinely tight widths sacrifice illustration. */
export const breakpointFor = (w: number): Breakpoint =>
  w < 700 ? 'tight' : w < 820 ? 'small' : w < 1100 ? 'mid' : 'wide';
