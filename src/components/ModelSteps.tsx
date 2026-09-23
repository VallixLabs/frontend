import { useState } from 'react';

import { bleedDark, color, eyebrow, font } from '../theme';
import { useStepCarousel } from '../hooks/useStepCarousel';

const INSTANT = [
  {
    n: '01',
    rowTitle: 'Send the table as-is',
    heading: (
      <>
        Send the table <span style={{ color: color.accent, whiteSpace: 'nowrap' }}>as-is</span>
      </>
    ),
    body: 'CSV, Parquet, a Snowflake query, or a DataFrame. Schema inference handles types, nulls and categoricals — nothing to declare.',
    art: (
      <svg
        viewBox="0 0 120 120"
        width="104"
        height="104"
        fill="none"
        stroke="#c2c4c3"
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
        One <span style={{ color: color.accent }}>forward pass</span>
      </>
    ),
    body: 'Rows become context. The model conditions on your data at inference time — no gradient step, no artifact to store or version.',
    art: (
      <svg
        viewBox="0 0 120 120"
        width="104"
        height="104"
        fill="none"
        stroke="#c2c4c3"
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
        Calibrated <span style={{ color: color.accent }}>output</span>
      </>
    ),
    body: 'Probabilities you can threshold, plus per-row uncertainty and feature attributions for the rows that matter.',
    art: (
      <svg
        viewBox="0 0 120 120"
        width="104"
        height="104"
        fill="none"
        stroke="#c2c4c3"
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

const CUSTOM = [
  {
    n: '01',
    rowTitle: 'Get the best prior for your data',
    heading: (
      <>
        Fit the <span style={{ color: color.accent, whiteSpace: 'nowrap' }}>prior</span>
      </>
    ),
    body: 'We search a space of generators for the one whose synthetic tables behave like yours — measured by running learners on both, not by comparing summary statistics.',
    art: (
      <svg viewBox="0 0 120 120" width="104" height="104" fill="none" stroke={color.textBody} strokeWidth="1.4">
        <circle cx="52" cy="52" r="26" />
        <path d="M71 71 L98 98" strokeWidth="2.4" />
        <circle cx="52" cy="52" r="11" stroke={color.accent} strokeWidth="1.8" style={{ animation: 'omPulse 2.6s ease-in-out infinite' }} />
        <path d="M30 34 L38 30 M66 30 L74 34 M30 70 L38 74" opacity="0.45" />
      </svg>
    ),
  },
  {
    n: '02',
    rowTitle: 'Train on that prior',
    heading: (
      <>
        Train on <span style={{ color: color.accent }}>synthetic draws</span>
      </>
    ),
    body: 'A small model is pretrained from scratch on tables drawn from that fitted generator. Millions of them, none of which are yours — your rows are never in the training set.',
    art: (
      <svg viewBox="0 0 120 120" width="104" height="104" fill="none" stroke={color.textBody} strokeWidth="1.4">
        <path d="M20 96 V28 M20 96 H100" />
        <polyline points="26,88 44,66 62,50 80,40 98,34" stroke={color.accent} strokeWidth="2"
          style={{ strokeDasharray: 150, animation: 'omDash 3.2s linear infinite' }} />
        <path d="M32 26 H44 M32 34 H40 M52 26 H64 M52 34 H60" opacity="0.4" />
        <circle cx="98" cy="34" r="2.8" fill={color.accent} stroke="none" style={{ animation: 'omPulse 2.2s ease-in-out infinite' }} />
      </svg>
    ),
  },
  {
    n: '03',
    rowTitle: 'Calibrated output',
    heading: (
      <>
        A model that <span style={{ color: color.accent }}>fits your domain</span>
      </>
    ),
    body: 'The same calibrated predictive distribution as Instant — now from a model whose assumptions were fitted to your data rather than averaged over everyone’s.',
    art: (
      <svg viewBox="0 0 120 120" width="104" height="104" fill="none" stroke={color.textBody} strokeWidth="1.4">
        <path d="M18 88 H104 M18 22 V88" />
        <path d="M26 84 C 44 84, 44 34, 62 34 C 80 34, 80 84, 98 84" stroke={color.accent} strokeWidth="2" />
        <path d="M44 84 V60 M62 84 V40 M80 84 V60" opacity="0.35" />
        <circle cx="62" cy="34" r="3" fill={color.accent} stroke="none" style={{ animation: 'omPulse 2.4s ease-in-out infinite' }} />
      </svg>
    ),
  },
];

const TRACKS = {
  instant: { label: 'Vallix Instant', title: 'Vallix Instant', steps: INSTANT },
  custom: { label: 'Vallix Custom', title: 'Vallix Custom', steps: CUSTOM },
} as const;

type TrackId = keyof typeof TRACKS;

export function ModelSteps() {
  const [track, setTrack] = useState<TrackId>('instant');
  const steps = TRACKS[track].steps;
  const { step, select, registerBar, wrapRef, hoverHandlers } = useStepCarousel(steps.length);

  return (
    <section id="model" className="v-gutter" style={{ ...bleedDark, padding: '90px 48px 140px' }}>
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: 24, marginBottom: 70,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: '56ch' }}>
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
            {TRACKS[track].title}<span style={{ color: color.textFaint }}>.</span>
          </h2>
        </div>

        {/* Two products, one shape: the same three-beat explanation either way, so
            they share the carousel rather than being two sections a reader has to
            compare across. */}
        <div
          role="tablist"
          aria-label="How it works"
          style={{ display: 'flex', gap: 1, background: color.rule, width: 'fit-content' }}
        >
          {(Object.keys(TRACKS) as TrackId[]).map((id) => {
            const on = track === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                // Reset from the event that caused it, rather than from an effect
                // watching the track: leaving the carousel on index 2 of the track
                // that just went away is how you get a blank panel.
                onClick={() => { setTrack(id); select(0); }}
                className={on ? undefined : 'wb-ghost-btn'}
                style={{
                  all: 'unset', cursor: 'pointer', padding: '11px 20px', fontFamily: font.sans,
                  fontSize: 14, fontWeight: on ? 600 : 400,
                  background: on ? color.accent : color.inkRaised,
                  color: on ? color.accentInk : color.textMuted,
                }}
              >
                {TRACKS[id].label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="om-steps"
        ref={wrapRef}
        className="v-stack"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,0.82fr) minmax(0,1.18fr)',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {steps.map((s, i) => {
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
          {steps.map((s, i) => {
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
                        WebkitTextStroke: '1px #39424a',
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
