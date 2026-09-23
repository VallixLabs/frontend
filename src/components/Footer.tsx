import { Link } from 'react-router-dom';

import { bleedDark, color, font } from '../theme';
import { Logo } from '../brand/Logo';

type Item = { label: string; to?: string; href?: string };

const COLUMNS: { title: string; items: Item[] }[] = [
  {
    title: 'Navigation',
    items: [
      { label: 'Home', to: '/' },
      { label: 'Contact us', to: '/contact' },
      { label: 'Careers', to: '/careers' },
    ],
  },
  {
    // No destinations yet — rendered as plain text rather than as links that go
    // nowhere, so nothing on the page lies about being clickable.
    title: 'Socials',
    items: [{ label: 'X' }, { label: 'LinkedIn' }],
  },
  {
    title: 'Company',
    items: [
      { label: 'Team', to: '/team' },
      { label: 'Research' },
      { label: 'Hugging Face' },
    ],
  },
];

const LEGAL = [
  'Terms and Conditions',
  'Privacy Policy',
  'Data and Protection Addendum',
  'Payments and Refunds Policy',
];

const linkStyle: React.CSSProperties = { color: color.textMuted, fontSize: 14, lineHeight: 2 };
const deadStyle: React.CSSProperties = { ...linkStyle, color: color.textFaint, cursor: 'default' };

export function Footer() {
  return (
    <footer className="v-gutter" style={{ ...bleedDark, padding: '56px 48px 40px', borderTop: `1px solid ${color.ruleSoft}` }}>
      <div
        className="v-cards"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px,1.4fr) repeat(auto-fit,minmax(150px,1fr))',
          gap: 40,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 320 }}>
          <Logo tone="onDark" height={45} className="v-logo-md" />
          <p style={{ margin: 0, fontFamily: font.mono, fontSize: 12.5, lineHeight: 1.6, color: color.textFaint }}>
            Originated from P² Labs, EE, IIT Roorkee.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                fontFamily: font.mono, fontSize: 12, letterSpacing: '.14em',
                textTransform: 'uppercase', color: color.accent, fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {col.title}
            </div>
            {col.items.map((item) =>
              item.to ? (
                <Link key={item.label} to={item.to} className="v-footlink" style={linkStyle}>
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} style={deadStyle} title="Not available yet">
                  {item.label}
                </span>
              ),
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 48, paddingTop: 22, borderTop: `1px solid ${color.ruleSoft}`,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 22px',
        }}
      >
        <span style={{ fontSize: 13, color: color.textFaint }}>
          © 2026 Vallix Labs. All rights reserved.
        </span>
        <span style={{ flex: 1 }} />
        {LEGAL.map((l) => (
          <span key={l} style={{ fontSize: 13, color: color.textFaint, cursor: 'default' }} title="Not available yet">
            {l}
          </span>
        ))}
      </div>
    </footer>
  );
}
