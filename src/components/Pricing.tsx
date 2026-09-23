import { bleedDark, color, eyebrow, font } from '../theme';

const TIERS = [
  {
    name: 'Sandbox',
    price: 'Free',
    unit: null,
    body: '10k predictions a month, tables up to 5k rows, community support.',
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Team',
    price: '$0.60',
    unit: ' / 1k rows',
    body: 'Unlimited tables, 1M-row context, batch scoring, uncertainty and attributions, SSO.',
    cta: 'Get access',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Talk to us',
    unit: null,
    body: 'VPC or on-prem weights, fine-tuning on your domain, audit logging, DPA and SLAs.',
    cta: 'Contact sales',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" style={{ ...bleedDark, padding: '20px 48px 130px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: '52ch', marginBottom: 40 }}>
        <div style={eyebrow}>Pricing</div>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(28px,3.3vw,40px)',
            lineHeight: 1.1,
            color: color.textBright,
            fontWeight: 600,
            letterSpacing: '-0.015em',
          }}
        >
          Pay for predictions, not GPUs.
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
        {TIERS.map((t) => (
          <div
            key={t.name}
            data-shine="1"
            style={{
              position: 'relative',
              border: `1px solid ${t.featured ? color.accent : color.rule}`,
              background: t.featured ? '#303030' : color.inkRaised,
              padding: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {t.featured && (
              // Deliberately overflows the card edge; the shine hook clips its flare
              // in a wrapper rather than on the card so this badge survives.
              <div
                style={{
                  position: 'absolute',
                  top: -11,
                  left: 30,
                  background: color.accent,
                  color: color.accentInk,
                  fontFamily: font.mono,
                  fontSize: 11,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                }}
              >
                Most teams
              </div>
            )}
            <div
              style={{
                fontFamily: font.mono,
                fontSize: 12,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: t.featured ? color.accent : color.textFaint,
              }}
            >
              {t.name}
            </div>
            <div style={{ fontSize: 36, color: color.textBright, fontWeight: 600 }}>
              {t.price}
              {t.unit && (
                <span style={{ fontSize: 15, color: color.textFaint, fontWeight: 400 }}>{t.unit}</span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: color.textMuted }}>{t.body}</p>
            <a
              href="#cta"
              data-shine="1"
              style={{
                marginTop: 'auto',
                padding: '12px 18px',
                textAlign: 'center',
                fontSize: 14,
                ...(t.featured
                  ? { background: color.accent, color: color.accentInk, fontWeight: 600 }
                  : { border: '1px solid #565656', color: color.textBody }),
              }}
            >
              {t.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
