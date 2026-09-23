/**
 * Design tokens for the Vallix Labs landing page.
 *
 * The page runs a scroll-driven transition from a light "paper" ground to a dark
 * "typeset" ground, so most colours come in a paper value and an ink value. The
 * morph in `lib/morph.ts` interpolates between the two, which is why the pairs
 * live together here rather than in two separate palettes.
 */

export const color = {
  // grounds
  paper: '#CFCFCF',
  ink: '#252525',
  inkRaised: '#2E2E2E',
  inkCard: '#2A2A2A',
  inkWell: '#1E1E1E',

  // hand-drawn half
  sketchLine: '#252525',
  sketchSoft: '#8A8A8A',
  sketchFaint: '#9B9B9B',
  sketchFill: '#E3E3E3',
  sketchMuted: '#545454',
  sketchLabel: '#7D7D7D',

  // typeset half
  textBright: '#CFCFCF',
  textBody: '#C4C4C4',
  textMuted: '#A0A0A0',
  textFaint: '#7D7D7D',
  rule: '#3F3F3F',
  ruleSoft: '#343434',

  // accent
  accent: '#E8963C',
  accentSoft: '#D98F52',
  accentDeep: '#C2712B',
  accentInk: '#1E1508',
} as const;

export const font = {
  /** The doodled half of the brand. The only face that is not Roboto. */
  hand: "Caveat, cursive",
  sans: "Roboto, system-ui, sans-serif",
  /** What used to be IBM Plex Mono: eyebrows, figures, small caps chrome. */
  mono: "Roboto, system-ui, sans-serif",
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
