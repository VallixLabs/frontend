/**
 * Workbench palette and the surface recipes the design reuses.
 *
 * The same three brand anchors as the landing page — #e0e1dd light, #485259
 * azure, #212930 navy — with every other tone interpolated between them. The
 * workbench is entirely on the dark ground, so the scale runs one way: text steps
 * down from the brand light toward the brand azure, and surfaces step up from the
 * brand navy toward it.
 *
 * The palette is monochrome, so emphasis is luminance rather than hue: `acc` is
 * simply the brightest tone, and primary actions invert the ground the way the
 * logo does. The two exceptions are `good` and `bad`, which carry meaning the
 * compatibility screen and the run history would lose if they were tonal — they
 * are kept, but pulled toward the palette so they read as part of it.
 */

export const wb = {
  bg: '#212930',           // brand navy
  fg: '#e0e1dd',           // brand light
  body: '#c2c4c3',
  muted: '#a3a8a8',
  dim: '#858b8e',
  faint: '#767f85',
  ghost: '#666f73',

  // Emphasis is the olive, not a brighter grey. It is the brand light's own hue
  // (#e0e1dd sits at hue 75) saturated up and darkened, so it reads as a contrast
  // against the navy without leaving the family. 4.7:1 on the navy ground.
  acc: '#859857',
  accHi: '#9dad79',
  accDim: '#6b7b58',
  accWarm: '#798a57',
  accInk: '#212930',       // label colour on an olive fill — 4.7:1
  accWell: '#2e3735',      // olive-tinted dark, under an accent panel

  // the two roles that stay semantic, tuned into the palette
  good: '#85998a',
  bad: '#b3705d',

  surface: '#293138',
  surfaceHi: '#2f373e',
  surfaceLo: '#191f24',

  line: 'rgba(255,255,255,0.07)',
  lineSoft: 'rgba(255,255,255,0.045)',
  grid: '#39424a',
  axis: '#485259',         // brand azure
  rule: '#485259',         // brand azure
  well: '#59646b',
} as const;

/**
 * The logo's own face. Be Vietnam Pro is proportional, so `.wb-root` asks for
 * tabular figures — without them the decimal columns in the metric tables lose
 * their alignment.
 */
export const mono = "'Be Vietnam Pro', system-ui, sans-serif";
export const sans = "'Be Vietnam Pro', system-ui, sans-serif";
/** Reserved for pre-formatted blocks whose space alignment is load-bearing. */
export const code = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** The default translucent panel. Tinted with the brand azure, not a warm grey. */
export const glass: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(72,82,89,0.30) 0%, rgba(45,54,61,0.24) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(224,225,221,0.12), inset 0 -1px 0 rgba(0,0,0,0.35)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** A darker well, for payload and code panels that should read as recessed. */
export const glassWell: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(26,32,38,0.40) 0%, rgba(18,23,27,0.42) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.9), inset 0 1px 0 rgba(224,225,221,0.08), inset 0 -1px 0 rgba(0,0,0,0.35)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** An olive-lit panel, for the insight and fair-fight callouts. */
export const glassAccent: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(133, 152, 87,0.16) 0%, rgba(72,82,89,0.26) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.85), 0 0 40px -20px rgba(133, 152, 87,0.26), inset 0 1px 0 rgba(133, 152, 87,0.28), inset 0 -1px 0 rgba(0,0,0,0.3)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  overflow: 'hidden',
};

/** The one panel that keeps a warm cast, reserved for "what we did not win". */
export const glassWarn: React.CSSProperties = {
  background: 'linear-gradient(158deg, rgba(140,90,74,0.18) 0%, rgba(48,42,40,0.26) 100%)',
  boxShadow:
    '0 20px 44px -22px rgba(0,0,0,0.85), inset 0 1px 0 rgba(200,140,120,0.20), inset 0 -1px 0 rgba(0,0,0,0.3)',
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

/** The primary action: an olive fill with a navy label. */
export const primaryBtn: React.CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  padding: '13px 18px',
  background: 'linear-gradient(180deg,#9dad79,#859857)',
  color: wb.accInk,
  boxShadow: '0 10px 24px -12px rgba(133, 152, 87,0.55)',
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
