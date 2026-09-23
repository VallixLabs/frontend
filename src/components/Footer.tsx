import { bleedDark, color, font } from '../theme';

const LINKS = [
  { href: '#model', label: 'Docs' },
  { href: '#benchmarks', label: 'Benchmarks' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#cta', label: 'Contact' },
];

export function Footer() {
  return (
    <footer
      style={{
        ...bleedDark,
        padding: '28px 48px 60px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: `1px solid ${color.ruleSoft}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: font.hand, fontSize: 28, color: color.textBright }}>
          Vallix Labs
        </span>
        <span style={{ fontFamily: font.mono, fontSize: 12, color: color.textFaint }}>
          Vallix-1 · 2026
        </span>
      </div>
      <div style={{ display: 'flex', gap: 22, fontSize: 14 }}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="v-footlink" style={{ color: color.textFaint }}>
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
