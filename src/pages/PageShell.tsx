import { Link } from 'react-router-dom';

import { color, font } from '../theme';
import { Logo } from '../brand/Logo';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { Footer } from '../components/Footer';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/team', label: 'Team' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
];

/**
 * The frame the standalone pages share.
 *
 * These sit entirely on the navy ground — there is no paper half to transition
 * from, so they take the typeset half of the brand throughout and reuse the
 * landing page's footer verbatim.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  useSmoothScroll();

  return (
    <div style={{ background: color.ink, minHeight: '100vh', fontFamily: font.sans, color: color.textBright }}>
      <header
        style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(33,41,48,0.92)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${color.ruleSoft}`,
        }}
      >
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/" aria-label="Vallix Labs home"><Logo tone="onDark" height={45} /></Link>
          <span style={{ flex: 1 }} />
          <nav style={{ display: 'flex', gap: 24, fontSize: 14 }}>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="v-pagelink" style={{ color: color.textMuted }}>
                {n.label}
              </Link>
            ))}
            <Link to="/workbench" style={{ color: color.accent, fontWeight: 500 }}>Workbench</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '76px 48px 110px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '62ch', marginBottom: 56 }}>
          <div style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: color.textFaint }}>
            {eyebrow}
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px,4.4vw,52px)', lineHeight: 1.05, letterSpacing: '-0.022em', fontWeight: 600 }}>
            {title}
          </h1>
          {lede && (
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: color.textMuted }}>{lede}</p>
          )}
        </div>
        {children}
      </main>

      <Footer />
    </div>
  );
}
