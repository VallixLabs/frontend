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
            'radial-gradient(76% 84% at 22% 50%, rgba(224,225,221,0.985) 0%, rgba(224,225,221,0.93) 42%, rgba(224,225,221,0.5) 70%, rgba(224,225,221,0.05) 100%)',
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
            No data scientist, no ML pipeline, only predict.
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
