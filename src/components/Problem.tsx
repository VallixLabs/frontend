import { color, font } from '../theme';
import { Par } from './HeroDecor';

const PROBLEMS = [
  {
    par: 0.06,
    title: 'A model for your data',
    body: 'Not a general-purpose model asked to cope with your table. We fit a model to your table specifically, so its assumptions are the ones your data actually rewards.',
    art: (
      <>
        <path d="M16 26 H104 V98 H16 Z" />
        <path d="M16 50 H104 M16 74 H104 M45 26 V98 M75 26 V98" strokeWidth="2" />
        <path d="M24 34 L38 46 M38 34 L24 46 M84 58 L96 68 M96 58 L84 68" stroke="#485259" strokeWidth="3" />
        <path d="M54 82 C 54 76, 66 76, 66 82 C 66 86, 60 86, 60 90" stroke="#485259" strokeWidth="2.6" />
      </>
    ),
  },
  {
    par: 0.14,
    title: 'Prediction at speed of light',
    body: 'Fitting happens once, before your rows arrive. Predicting is a single forward pass — milliseconds a row, no retraining when the data moves.',
    art: (
      <>
        <circle cx="60" cy="60" r="24" />
        <circle cx="60" cy="60" r="9" />
        <path d="M60 20 V32 M60 88 V100 M20 60 H32 M88 60 H100 M32 32 L41 41 M79 79 L88 88 M88 32 L79 41 M41 79 L32 88" />
      </>
    ),
  },
  {
    par: 0.22,
    title: 'Best accuracy overall',
    body: 'Measured on the proper scoring rule, not just on how often it guesses right — and reported against tuned gradient boosting rather than an untuned strawman.',
    art: (
      <>
        <path d="M18 22 V100 H104" />
        <path d="M32 100 V74 M52 100 V56 M72 100 V82 M92 100 V40" strokeWidth="11" />
      </>
    ),
  },
];

export function Problem() {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1180,
        margin: '0 auto',
        padding: '120px 48px 140px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          maxWidth: '60ch',
          marginBottom: 52,
        }}
      >
        <div
          style={{
            fontFamily: font.hand,
            fontSize: 23,
            letterSpacing: '.01em',
            color: color.sketchLabel,
          }}
        >
          Why you need us?
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: font.hand,
            fontSize: 'clamp(40px,4.8vw,60px)',
            lineHeight: 1.02,
            color: color.ink,
            fontWeight: 700,
            letterSpacing: 0,
          }}
        >
          Right now, a single prediction task costs you a week and a data scientist.
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 22,
        }}
      >
        {PROBLEMS.map((p) => (
          <Par
            key={p.title}
            par={p.par}
            parMax={14}
            style={{
              border: `2px solid ${color.ink}`,
              borderRadius: 22,
              background: color.sketchFill,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ color: color.ink }}>
              <svg
                viewBox="0 0 120 120"
                width="84"
                height="84"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                filter="url(#rough)"
              >
                {p.art}
              </svg>
            </div>
            <h3
              style={{
                margin: 0,
                fontFamily: font.hand,
                fontSize: 29,
                color: color.ink,
                fontWeight: 700,
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: font.hand,
                fontSize: 21,
                lineHeight: 1.3,
                color: color.sketchMuted,
              }}
            >
              {p.body}
            </p>
          </Par>
        ))}
      </div>
    </section>
  );
}
