/**
 * Design tokens for the Vallix Labs landing page.
 *
 * ## The brand palette
 *
 * Three anchors, taken from the logo:
 *
 *   #e0e1dd  light grey   the logo mark
 *   #485259  azure grey   the logo's grid lines
 *   #212930  navy         the logo ground
 *
 * Every other tone here is an interpolation between two of those, so nothing in
 * the UI is off-brand by construction. The page runs a scroll-driven transition
 * from a light "paper" ground to the dark navy, which is why most roles come in a
 * paper value and an ink value — `lib/morph.ts` interpolates between the pairs.
 *
 * ## The olive accent
 *
 * The three logo tones are all but monochrome, which leaves nothing to carry
 * emphasis. The olive supplies it, and it is not a foreign colour: #e0e1dd sits at
 * hue 75, already the yellow-green family, so the olive is that same hue saturated
 * up and darkened.
 *
 * It needs two values, because no single olive clears 4.5:1 against both grounds:
 *
 *   on navy   `accent`     #859857   4.7:1
 *   on paper  `accentDeep` #475625   6.1:1
 *
 * Primary actions take an olive fill with a navy label.
 */

export const color = {
  // grounds
  // A tint of the brand light toward white, not the anchor itself. #e0e1dd is the
  // logo *mark*, which in the logo sits on navy; used flat as a page ground at
  // 87.5% lightness it reads as grey rather than as paper. This is the same hue,
  // lifted to white, and every stroke and text tone on it gains contrast.
  paper: '#ffffff',      // pure; the grain's sparse specks carry the texture
  ink: '#212930',          // brand navy
  inkRaised: '#293138',
  inkCard: '#262e35',
  inkWell: '#191f24',

  // hand-drawn half — strokes darken against the paper ground
  sketchLine: '#212930',
  sketchSoft: '#777c7e',
  sketchFaint: '#8a8e8f',
  sketchFill: '#ffffff',   // filled shapes still sit above the ground
  sketchMuted: '#485259',  // brand azure: body copy on paper
  sketchLabel: '#5a6064',

  // typeset half — text lightens against the navy ground
  textBright: '#e0e1dd',
  textBody: '#c2c4c3',
  textMuted: '#a3a8a8',
  textFaint: '#858b8e',
  rule: '#485259',         // brand azure
  ruleSoft: '#38424a',

  // Emphasis: an olive, which is the brand light's own hue (#e0e1dd sits at hue
  // 75) saturated up. One value per ground, because a single olive cannot carry
  // 4.5:1 against both the navy and the paper.
  accent: '#859857',       // on navy — 4.7:1
  accentSoft: '#859857',   // the same olive: the palette carries only one
  accentDeep: '#475625',   // on paper — 6.1:1
  accentInk: '#212930',    // label colour on an olive fill
} as const;

export const font = {
  /** The doodled half of the brand. The only face that is not Be Vietnam Pro. */
  hand: "Caveat, cursive",
  /** The logo's own face. */
  sans: "'Be Vietnam Pro', system-ui, sans-serif",
  /** What used to be IBM Plex Mono: eyebrows, figures, small caps chrome. */
  mono: "'Be Vietnam Pro', system-ui, sans-serif",
  /** Genuinely pre-formatted blocks, where column alignment carries meaning. */
  code: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
} as const;

/** Full-bleed dark band inside a max-width section. */
export const bleedDark: React.CSSProperties = {
  position: 'relative',
  background: color.ink,
  boxShadow: `0 0 0 100vmax ${color.ink}`,
  clipPath: 'inset(0 -100vmax)',
  maxWidth: 1180,
  margin: '0 auto',
};

/** The small uppercase mono label that heads each dark section. */
export const eyebrow: React.CSSProperties = {
  fontFamily: font.mono,
  fontSize: 12,
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: color.textFaint,
};
