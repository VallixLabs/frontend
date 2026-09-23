import { bleedDark, color, eyebrow, font } from '../theme';
import { useStepCarousel } from '../hooks/useStepCarousel';

const STEPS = [
  {
    n: '01',
    rowTitle: 'Send the table as-is',
    heading: (
      <>
        Send the table <span style={{ color: color.accentSoft, whiteSpace: 'nowrap' }}>as-is</span>
      </>
    ),
    body: 'CSV, Parquet, a Snowflake query, or a DataFrame. Schema inference handles types, nulls and categoricals — nothing to declare.',
    art: (
      <svg
        viewBox="0 0 120 120"
        width="104"
        height="104"
        fill="none"
        stroke="#C4C4C4"
        strokeWidth="1.4"
      >
        <ellipse cx="60" cy="32" rx="32" ry="10" />
        <path d="M28 32 V88 A32 10 0 0 0 92 88 V32" />
        <path
          d="M28 54 A32 10 0 0 0 92 54 M28 72 A32 10 0 0 0 92 72"
          opacity="0.5"
          style={{ animation: 'omPulse 3.2s ease-in-out infinite' }}
        />
      </svg>
    ),
  },
  {
    n: '02',
    rowTitle: 'One forward pass',
    heading: (
      <>
        One <span style={{ color: color.accentSoft }}>forward pass</span>
      </>
    ),
    body: 'Rows become context. The model conditions on your data at inference time — no gradient step, no artifact to store or version.',
    art: (
      <svg
        viewBox="0 0 120 120"
        width="104"
        height="104"
        fill="none"
        stroke="#C4C4C4"
        strokeWidth="1.4"
      >
        <path
          d="M30 34 L60 60 L30 86 M90 60 L60 60 M30 60 L60 60"
          opacity="0.5"
          style={{
            strokeDasharray: 60,
            animation: 'omDash 2.6s linear infinite',
          }}
        />
        <circle cx="30" cy="34" r="7" />
        <circle cx="30" cy="60" r="7" />
        <circle cx="30" cy="86" r="7" />
        <circle
          cx="60"
          cy="60"
          r="11"
          fill={color.accent}
          stroke="none"
          style={{ animation: 'omPulse 2.1s ease-in-out infinite' }}
        />
        <circle cx="90" cy="60" r="7" />
      </svg>
    ),
  },
  {
    n: '03',
    rowTitle: 'Calibrated output',
    heading: (
      <>
        Calibrated <span style={{ color: color.accentSoft }}>output</span>
      </>
    ),
    body: 'Probabilities you can threshold, plus per-row uncertainty and feature attributions for the rows that matter.',
    art: (
      <svg
        viewBox="0 0 120 120"
        width="104"
        height="104"
        fill="none"
        stroke="#C4C4C4"
        strokeWidth="1.4"
      >
        <path d="M18 40 H104 M18 60 H104 M18 80 H104" opacity="0.25" />
        <path d="M18 22 V100 H104" />
        <polyline
          points="26,88 44,72 62,76 80,50 98,32"
          stroke={color.accent}
          strokeWidth="2"
          style={{
            strokeDasharray: 120,
            animation: 'omDash 3.4s linear infinite',
          }}
        />
        <circle cx="26" cy="88" r="2.6" fill={color.accent} stroke="none" />
        <circle cx="62" cy="76" r="2.6" fill={color.accent} stroke="none" />
        <circle
          cx="98"
          cy="32"
          r="2.6"
          fill={color.accent}
          stroke="none"
          style={{ animation: 'omPulse 2.4s ease-in-out infinite' }}
        />
      </svg>
    ),
  },
];

export function ModelSteps() {
  const { step, select, registerBar, wrapRef, hoverHandlers } = useStepCarousel(STEPS.length);

  return (
    <section id="model" style={{ ...bleedDark, padding: '90px 48px 140px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          maxWidth: '56ch',
          marginBottom: 70,
        }}
      >
        <div style={eyebrow}>How it works</div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(34px,4.4vw,58px)',
            lineHeight: 1.04,
            color: color.textBright,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          Three steps,
          <br />
          one request<span style={{ color: color.textFaint }}>.</span>
        </h2>
      </div>

      <div
        id="om-steps"
        ref={wrapRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,0.82fr) minmax(0,1.18fr)',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STEPS.map((s, i) => {
            const on = i === step;
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => select(i)}
                {...hoverHandlers}
                style={{
                  all: 'unset',
                  color: color.accentSoft,
                  fontFamily: font.sans,
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '22px 26px',
                  borderRadius: 2,
                  background: on ? color.inkRaised : 'transparent',
                  boxShadow: on ? '0 18px 40px rgba(0,0,0,0.35)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                  <span
                    style={{
                      fontFamily: font.mono,
                      fontSize: 12,
                      color: color.textFaint,
                    }}
                  >
                    {s.n}
                  </span>
                  <span
                    style={{
                      fontFamily: font.sans,
                      fontSize: 19,
                      fontWeight: 600,
                      color: on ? color.textBright : color.accentSoft,
                    }}
                  >
                    {s.rowTitle}
                  </span>
                </div>
                <div
                  style={{
                    margin: '16px 0 0 44px',
                    height: 2,
                    background: color.rule,
                  }}
                >
                  <div
                    ref={registerBar(i)}
                    style={{ height: 2, width: '0%', background: color.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative', perspective: '1200px' }}>
          {STEPS.map((s, i) => {
            const on = i === step;
            return (
              // Two nested elements because two things want to drive `transform`:
              // the carousel slides the card in and out, and the hover tilt tips it
              // toward the pointer. On one element they overwrite each other and a
              // carousel tick yanks the card out of an in-progress tilt, so the
              // slide lives out here and the tilt lives on the child, which owns
              // its transform outright.
              <div
                key={s.n}
                onPointerEnter={hoverHandlers.onPointerEnter}
                onPointerLeave={hoverHandlers.onPointerLeave}
                style={{
                  // The first card holds the grid's height; the rest stack over it.
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: i === 0 ? undefined : 0,
                  opacity: on ? 1 : 0,
                  pointerEvents: on ? 'auto' : 'none',
                  transform: on ? 'translateY(0)' : 'translateY(18px)',
                  transition: 'opacity .5s ease, transform .5s ease',
                }}
              >
                <div
                  data-shine="1"
                  data-tilt="1"
                  style={{
                    border: `1px solid ${color.rule}`,
                    background: color.inkRaised,
                    padding: '44px 44px 48px',
                    minHeight: 380,
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      overflow: 'hidden',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: 26,
                        bottom: 0,
                        fontFamily: font.sans,
                        fontSize: 186,
                        lineHeight: 0.86,
                        fontWeight: 600,
                        color: 'transparent',
                        WebkitTextStroke: '1px #3A3A3A',
                      }}
                    >
                      {s.n}
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: 36,
                      top: 36,
                      opacity: 0.5,
                      pointerEvents: 'none',
                    }}
                  >
                    {s.art}
                  </div>
                  <div style={eyebrow}>Step {s.n}</div>
                  <h3
                    style={{
                      margin: 0,
                      maxWidth: 'calc(100% - 116px)',
                      fontSize: 'clamp(26px,2.7vw,38px)',
                      textWrap: 'balance',
                      lineHeight: 1.08,
                      letterSpacing: '-0.015em',
                      fontWeight: 600,
                      color: color.textBright,
                    }}
                  >
                    {s.heading}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: '34ch',
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: color.textMuted,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
