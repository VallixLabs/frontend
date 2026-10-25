import type { CSSProperties, ReactNode, Ref } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from './Logo';

/** Header and footer shared by the site's pages, as the design repeats them on each. */

const mono = "'Geist Mono', ui-monospace, monospace";
const pad = 'clamp(16px, 4vw, 56px)';

/** A link to a section of the landing page: a plain in-page anchor there, a route + hash elsewhere. */
function ToSection({ hash, home, style, className, children }: { hash: string; home: boolean; style?: CSSProperties; className?: string; children: ReactNode }) {
  return home
    ? <a href={'#' + hash} style={style} className={className}>{children}</a>
    : <Link to={'/#' + hash} style={style} className={className}>{children}</Link>;
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
  );
}

type Page = 'home' | 'who' | 'playground' | 'research';

export function SiteHeader({ page, logoRef }: { page: Page; logoRef?: Ref<HTMLAnchorElement> }) {
  const home = page === 'home';
  const current: CSSProperties = { textDecoration: 'underline', textUnderlineOffset: 6, textDecorationThickness: 1 };
  return (
    <header className="vx-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 64, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', alignItems: 'center', padding: `0 ${pad}`, background: 'rgba(246,245,242,.74)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(20,20,20,.08)' }}>
      <nav className="vx-nav" style={{ display: 'flex', gap: 26, fontSize: 14, fontWeight: 500 }}>
        <Link to="/who-we-are" style={page === 'who' ? current : undefined}>Who we are</Link>
        <Link to="/research" style={page === 'research' ? current : undefined}>Research &amp; Benchmarks</Link>
        <ToSection hash="access" home={home}>Contact us</ToSection>
      </nav>
      {home ? (
        <a href="#top" aria-label="Vallix Labs" ref={logoRef} style={{ display: 'flex' }}>
          <Logo width={109} height={42} />
        </a>
      ) : (
        <Link to="/" aria-label="Vallix Labs" style={{ display: 'flex' }}>
          <Logo width={109} height={42} />
        </Link>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 22 }}>
        <Link to="/playground" className="vx-nav-extra" style={{ fontSize: 14, fontWeight: 500, ...(page === 'playground' ? current : {}) }}>Playground</Link>
        <ToSection hash="access" home={home} className="vx-btn-soft" style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '7px 9px 7px 15px', borderRadius: 999, fontSize: 14, fontWeight: 500 }}>
          <span>Get access</span>
          <Arrow />
        </ToSection>
      </div>
    </header>
  );
}

const footHead: CSSProperties = { fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8f8b84', marginBottom: 6 };
const footCol: CSSProperties = { flex: '1 1 110px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14.5 };

export function SiteFooter({ page, footerRef }: { page: Page; footerRef?: Ref<HTMLElement> }) {
  const home = page === 'home';
  return (
    <footer ref={footerRef} style={{ position: 'relative', overflowX: 'clip', borderTop: '1px solid #e3e1dc', padding: `64px ${pad} 28px` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '48px 40px' }}>
        <div style={{ flex: '2 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Logo width={374} height={144} style={{ maxWidth: '100%', alignSelf: 'flex-start' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, marginTop: 18 }}>
            <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8f8b84' }}>Originated from</span>
            <img src="/plab-logo.svg" alt="P² Lab, EE, IIT Roorkee" width={2235} height={1698} style={{ height: 80, width: 'auto', display: 'block' }} />
          </div>
        </div>
        <div style={footCol}>
          <div style={footHead}>Products</div>
          <ToSection hash="ecosystem" home={home}>Valli</ToSection><ToSection hash="ecosystem" home={home}>Tana</ToSection><ToSection hash="ecosystem" home={home}>Tvarit</ToSection>
        </div>
        <div style={footCol}>
          <div style={footHead}>Company</div>
          <ToSection hash="business" home={home}>For business</ToSection><Link to="/who-we-are">Who we are</Link><ToSection hash="top" home={home}>Careers</ToSection><ToSection hash="access" home={home}>Contact</ToSection>
        </div>
        <div style={footCol}>
          <div style={footHead}>Social</div>
          <ToSection hash="top" home={home}>X</ToSection><ToSection hash="top" home={home}>LinkedIn</ToSection><ToSection hash="top" home={home}>GitHub</ToSection>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '64px auto 0', paddingTop: 22, borderTop: '1px solid #e3e1dc', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, fontSize: 13, color: '#8f8b84' }}>
        <span>© 2026. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 22 }}><ToSection hash="top" home={home} style={{ color: '#8f8b84' }}>Privacy</ToSection><ToSection hash="top" home={home} style={{ color: '#8f8b84' }}>Terms</ToSection></div>
      </div>
    </footer>
  );
}
