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

      {/* A radial scrim anchored over the copy, so the scenery stays legible
          behind the headline without dimming the illustration on the right. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: -160,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'radial-gradient(76% 84% at 22% 50%, rgba(207,207,207,0.985) 0%, rgba(207,207,207,0.93) 42%, rgba(207,207,207,0.5) 70%, rgba(207,207,207,0.05) 100%)',
        }}
      />

      <div
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
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: font.hand,
              fontSize: 23,
              letterSpacing: '.01em',
              color: color.sketchLabel,
            }}
          >
            <span
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#8F8F8F' }}
            />
            Vallix-1 · tabular foundation model
          </div>

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
              understood
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
            Point Vallix-1 at a raw table — nulls, mixed types, forty columns, four hundred
            rows — and get calibrated predictions back in one forward pass. No training run.
            No feature engineering. No pipeline to babysit.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
              marginTop: 6,
            }}
          >
            <Link
              to="/workbench"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 32px',
                color: '#EDEDED',
                fontSize: 17,
                fontWeight: 500,
              }}
            >
              <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <svg
                  viewBox="0 0 240 66"
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                  fill="none"
                  filter="url(#rough)"
                >
                  <path
                    d="M16 6 H222 C232 6, 235 18, 234 33 C 233 50, 230 60, 218 60 H20 C 8 60, 4 46, 5 31 C 6 15, 7 6, 16 6 Z"
                    fill={color.ink}
                  />
                </svg>
              </span>
              <span
                style={{
                  position: 'relative',
                  fontFamily: font.hand,
                  fontSize: 27,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Upload a CSV
              </span>
              <svg
                viewBox="0 0 44 14"
                width="30"
                height="12"
                fill="none"
                stroke={color.sketchSoft}
                strokeWidth="2.6"
                strokeLinecap="round"
                filter="url(#rough)"
                style={{ position: 'relative' }}
              >
                <path d="M2 7 H36 M29 2 L38 7 L29 12" />
              </svg>
            </Link>

            <a
              href="#model"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '18px 30px',
                color: color.ink,
                fontSize: 17,
              }}
            >
              <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <svg
                  viewBox="0 0 240 66"
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                  fill="none"
                  stroke={color.ink}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  filter="url(#rough)"
                >
                  <path d="M16 8 H220 C230 8, 233 18, 232 33 C 231 48, 228 58, 216 58 H20 C 9 58, 6 46, 7 31 C 8 16, 8 8, 16 8 Z" />
                  <path d="M22 12 H214" strokeWidth="1.3" opacity="0.4" />
                </svg>
              </span>
              <span
                style={{
                  position: 'relative',
                  fontFamily: font.hand,
                  fontSize: 26,
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                Read the technical report
              </span>
            </a>
          </div>
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
          color: '#3F3F3F',
        }}
      >
        missing? fine.
      </Par>
    </section>
  );
}
