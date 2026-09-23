/**
 * Workbench palette and the surface recipes the design reuses.
 *
 * The workbench is the dark half of the brand throughout — no paper ground, no
 * hand-drawn type. It leans on layered translucent "glass" panels over a warm
 * near-black, with a single amber accent carrying every affordance that matters.
 */

export const wb = {
  bg: '#201E1D',
  fg: '#CFCFCF',
  body: '#C4C4C4',
  muted: '#A0A0A0',
  dim: '#7D7D7D',
  faint: '#6E6E6E',
  ghost: '#565656',

  acc: '#E8963C',
  accHi: '#F2B166',
  accDim: '#B4894F',
  accWarm: '#A98A63',
  accInk: '#1E1508',
  accWell: '#302A22',

  good: '#8FA98F',
  bad: '#C2603B',

  surface: '#2E2E2E',
  surfaceHi: '#333333',
  surfaceLo: '#252525',

  line: 'rgba(255,255,255,0.07)',
  lineSoft: 'rgba(255,255,255,0.045)',
  grid: '#3A3A3A',
  axis: '#565656',
  rule: '#3F3F3F',
  well: '#4A4A4A',
} as const;

/**
 * What the design called IBM Plex Mono: eyebrows, figures, badges, table cells.
 * Roboto is proportional, so `.wb-root` turns on tabular figures — without them
 * the decimal columns in the metric tables stop lining up.
 */
export const mono = "Roboto, system-ui, sans-serif";
export const sans = "Roboto, system-ui, sans-serif";
/** Reserved for pre-formatted blocks whose space alignment is load-bearing. */
export const code = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** The default translucent panel. Used 19 times in the design; defined once here. */
export const glass: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(96,90,84,0.24) 0%, rgba(58,54,50,0.2) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.35)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** A darker well, for payload and code panels that should read as recessed. */
export const glassWell: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(36,33,31,0.34) 0%, rgba(22,21,20,0.36) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.35)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** An amber-lit panel, for the insight and fair-fight callouts. */
export const glassAccent: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(150,102,44,0.22) 0%, rgba(78,62,44,0.24) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.85), 0 0 40px -20px rgba(232,150,60,0.5), inset 0 1px 0 rgba(255,196,124,0.28), inset 0 -1px 0 rgba(0,0,0,0.3)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** A red-lit panel, reserved for "what we did not win". */
export const glassWarn: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(120,66,44,0.2) 0%, rgba(52,40,36,0.24) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,160,120,0.24), inset 0 -1px 0 rgba(0,0,0,0.3)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** The uppercase mono label heading nearly every panel. */
export const capLabel: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 12,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: wb.muted,
};

/** The smaller eyebrow above each stage title. */
export const stageEyebrow: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: wb.dim,
};

/** The primary amber action. */
export const primaryBtn: React.CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  padding: '13px 18px',
  background: 'linear-gradient(180deg,#F5AC58,#E8963C)',
  color: wb.accInk,
  boxShadow: '0 10px 24px -12px rgba(232,150,60,0.9)',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
  fontFamily: sans,
};

export const panelHead: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  borderBottom: `1px solid ${wb.line}`,
};

export const stagePad: React.CSSProperties = {
  padding: '34px 40px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: 26,
};
