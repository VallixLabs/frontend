import { bleedDark, color, font } from '../theme';
import { CtaSilhouettes } from './CtaSilhouettes';

export function Cta() {
  return (
    <section id="cta" style={{ ...bleedDark, padding: '40px 48px 0' }}>
      <div
        style={{
          position: 'relative',
          border: `1px solid ${color.rule}`,
          background: color.inkCard,
          overflow: 'hidden',
          minHeight: 620,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '100px 40px 0',
          textAlign: 'center',
        }}
      >
        {/* graph-paper grid, echoing the notebook the page opened on */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.35,
            background:
              'repeating-linear-gradient(to right, rgba(255,255,255,0.05) 0 1px, transparent 1px 64px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0 1px, transparent 1px 64px)',
          }}
        />

        <div
          data-par="0.6"
          data-par-max="90"
          data-float="10"
          data-float-speed="0.5"
          data-mouse="26"
          data-rot="12"
          style={{ position: 'absolute', left: '12%', top: '14%', pointerEvents: 'none' }}
        >
          <svg viewBox="0 0 40 40" width="26" height="26" fill="none" stroke={color.accentSoft} strokeWidth="1.4">
            <path d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" />
          </svg>
        </div>
        <div
          data-par="-0.5"
          data-par-max="90"
          data-float="8"
          data-float-speed="0.7"
          data-mouse="-30"
          data-rot="-14"
          style={{ position: 'absolute', right: '14%', top: '9%', pointerEvents: 'none' }}
        >
          <svg viewBox="0 0 40 40" width="18" height="18" fill="none" stroke="#767f85" strokeWidth="1.4">
            <path d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" />
          </svg>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            width: '100%',
            maxWidth: 760,
          }}
        >
          <h2
            style={{
              margin: 0,
              maxWidth: '22ch',
              fontSize: 'clamp(34px,4.6vw,62px)',
              lineHeight: 1.03,
              letterSpacing: '-0.022em',
              color: color.textBright,
              fontWeight: 600,
              textWrap: 'balance',
            }}
          >
            Bring the messiest table <span style={{ color: color.accent }}>you have.</span>
          </h2>
          <p style={{ margin: 0, maxWidth: '46ch', fontSize: 17, lineHeight: 1.6, color: color.textMuted }}>
            We'll score it zero-shot against your current model and send you the comparison. No
            integration required.
          </p>
          <a
            href="#cta"
            data-tilt="1"
            style={{
              marginTop: 6,
              padding: '17px 34px',
              background: color.accent,
              color: color.accentInk,
              fontWeight: 600,
              fontSize: 16,
              display: 'inline-block',
            }}
          >
            Request access
          </a>
          <a href="mailto:hello@vallixlabs.com" style={{ fontFamily: font.mono, fontSize: 14, color: color.textFaint }}>
            hello@vallixlabs.com
          </a>
        </div>

        <CtaSilhouettes />
      </div>
    </section>
  );
}
