import { Link } from 'react-router-dom';

import { color, font } from '../theme';
import { HeroDecor, Par } from './HeroDecor';

export function Hero() {
  return (
    <section
      id="om-hero-grid"
      style={{
        position: 'relative',
        minHeight: '94vh',
        padding: '0 0 40px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <HeroDecor />

      {/* The radial scrim that used to sit here is gone.
          It was a white wash at up to 86% alpha, painted above the grain, so it
          washed the texture out of exactly the area it covered — the left half —
          and the grain read as uneven across the page. Its two jobs no longer
          needed doing: it cannot brighten a ground that is already pure white, and
          the scenery it was meant to quieten now sits at opacity 0.10 and below. */}

      <div
        className="v-gutter"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1320,
          margin: '0 auto',
          padding: '10px 48px 0',
          width: '100%',
        }}
      >
        <div
          id="om-hero-copy"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
            maxWidth: 'min(620px,58%)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: font.hand,
              fontSize: 'clamp(54px,7.2vw,104px)',
              lineHeight: 0.95,
              letterSpacing: 0,
              color: color.ink,
              fontWeight: 700,
              textWrap: 'pretty',
            }}
          >
            Your messy spreadsheet,{' '}
            <span
              style={{
                fontFamily: font.hand,
                fontWeight: 700,
                fontSize: 'clamp(58px,7.8vw,112px)',
                color: color.accentDeep,
                display: 'inline-block',
                lineHeight: 0.86,
                transform: 'rotate(-1.5deg)',
              }}
            >
              predicted
            </span>{' '}
            on the first look.
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: '36ch',
              fontFamily: font.hand,
              fontSize: 'clamp(22px,1.9vw,29px)',
              lineHeight: 1.32,
              color: color.sketchMuted,
              textWrap: 'pretty',
            }}
          >
            No data scientist, no ML pipeline,{' '}
            {/* The last word of the sentence is the way in. It keeps the handwriting
                rather than becoming a separate CTA block, so the line still reads as
                one sentence — the sketched outline is what marks it as pressable.
                "just" travels with it so the line never breaks between the two. */}
            <span style={{ whiteSpace: 'nowrap' }}>
              just{' '}
              <Link
                to="/workbench"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  padding: '2px 15px 4px',
                  fontFamily: font.hand,
                  fontWeight: 700,
                  fontSize: '1.12em',
                  lineHeight: 1,
                  color: color.accentDeep,
                }}
              >
                <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
                  <svg
                    viewBox="0 0 150 52"
                    preserveAspectRatio="none"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                    fill="none"
                    stroke={color.accentDeep}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    filter="url(#rough)"
                  >
                    <path d="M13 7 H137 C146 7, 147 17, 146 27 C 145 39, 143 45, 133 45 H17 C 7 45, 4 35, 4 26 C 4 14, 5 7, 13 7 Z" />
                  </svg>
                </span>
                <span style={{ position: 'relative' }}>predict</span>
              </Link>
            </span>
          </p>

        </div>
      </div>

      {/* Margin annotations, drifting on the same parallax track as the table
          they annotate so they never separate from it. */}
      <Par
        par={-0.26}
        parMax={260}
        float={22}
        floatSpeed={0.42}
        mouse={60}
        rot={3.5}
        rot0={-5}
        deco="label"
        style={{
          position: 'absolute',
          right: '1.5%',
          top: '9%',
          zIndex: 3,
          pointerEvents: 'none',
          fontFamily: font.hand,
          fontSize: 'clamp(19px,2vw,28px)',
          color: color.accentDeep,
        }}
      >
        predicted, with error bars
      </Par>

      <Par
        par={-0.26}
        parMax={260}
        float={22}
        floatSpeed={0.42}
        mouse={60}
        rot={3.5}
        rot0={3}
        deco="label"
        style={{
          position: 'absolute',
          right: '36%',
          bottom: '11%',
          zIndex: 3,
          pointerEvents: 'none',
          fontFamily: font.hand,
          fontSize: 'clamp(18px,1.9vw,26px)',
          color: '#485259',
        }}
      >
        missing? fine.
      </Par>
    </section>
  );
}
