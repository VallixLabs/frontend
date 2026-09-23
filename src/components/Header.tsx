import { Link } from 'react-router-dom';

import { color, font } from '../theme';
import { Logo } from '../brand/Logo';

const NAV = [
  { href: '#benchmarks', label: 'Benchmarks' },
  { href: '#pricing', label: 'Pricing' },
];

const navLink: React.CSSProperties = {
  color: color.sketchMuted,
  padding: '4px 2px',
  fontFamily: font.hand,
  fontSize: 24,
  lineHeight: 1,
};

export function Header() {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: 1320,
        margin: '0 auto',
        padding: '24px 48px 10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* The scribbled underline that used to sit here was decoration for a text
              wordmark. The logo carries its own grid rule, so it now reads as an
              artifact rather than a flourish. */}
          <Logo tone="onLight" height={60} />
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 15 }}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="v-navlink" style={navLink}>
              {item.label}
            </a>
          ))}
          <Link
            to="/workbench"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              color: color.ink,
              fontFamily: font.hand,
              fontWeight: 700,
              fontSize: 24,
              lineHeight: 1,
            }}
          >
            <span style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <svg
                viewBox="0 0 160 52"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', display: 'block' }}
                fill="none"
                stroke={color.ink}
                strokeWidth="2.4"
                strokeLinecap="round"
                filter="url(#rough)"
              >
                <path
                  d="M14 6 H146 C154 6, 156 16, 155 26 C 154 38, 152 46, 142 46 H18 C 8 46, 5 36, 5 26 C 5 14, 6 6, 14 6 Z"
                  fill={color.sketchFill}
                />
                <path d="M16 9 H144" strokeWidth="1.4" opacity="0.45" />
              </svg>
            </span>
            <span style={{ position: 'relative' }}>Get access</span>
          </Link>
        </nav>
      </div>

      <svg
        viewBox="0 0 1200 8"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 7, marginTop: 14, display: 'block' }}
        fill="none"
        stroke="#8b9599"
        strokeWidth="1.8"
        strokeLinecap="round"
        filter="url(#rough)"
      >
        <path d="M4 4 C 300 1, 700 7, 1196 3" />
      </svg>
    </header>
  );
}
