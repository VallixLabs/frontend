import { bleedDark, color, eyebrow, font } from '../theme';

const CLAIMS = [
  'p50 latency 240 ms for 10k-row context',
  'VPC and on-prem deployment for regulated data',
  'No training data retained, ever',
];

export function ApiSection() {
  return (
    <section
      id="api"
      style={{
        ...bleedDark,
        padding: '20px 48px 130px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,0.85fr) minmax(0,1.15fr)',
        gap: 56,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={eyebrow}>API</div>
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
          Four lines, then it's a product decision.
        </h2>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: color.textMuted, maxWidth: '44ch' }}>
          Python and TypeScript SDKs, a REST endpoint, and a batch mode for scoring warehouse
          tables in place. Predictions stream back with row ids so you can join them straight home.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: color.textMuted }}>
          {CLAIMS.map((c) => (
            <div key={c} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: color.accent, fontFamily: font.mono }}>→</span> {c}
            </div>
          ))}
        </div>
      </div>

      <div data-shine="1" style={{ border: `1px solid ${color.rule}`, background: color.inkWell }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            borderBottom: `1px solid ${color.rule}`,
            fontFamily: font.mono,
            fontSize: 12,
            color: color.textFaint,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color.accent }} />
          predict.py
        </div>
        <pre
          style={{
            margin: 0,
            padding: '24px 22px',
            fontFamily: font.code,
            fontSize: 14,
            lineHeight: 1.9,
            color: color.textBody,
            overflowX: 'auto',
          }}
        >
          <span style={{ color: color.textFaint }}>from</span> vallix{' '}
          <span style={{ color: color.textFaint }}>import</span> Vallix{'\n'}
          {'\n'}
          model = Vallix(<span style={{ color: color.sketchFaint }}>"vallix-1"</span>){'\n'}
          pred  = model.predict({'\n'}
          {'    '}table=<span style={{ color: color.sketchFaint }}>"churn.csv"</span>,{'\n'}
          {'    '}target=<span style={{ color: color.sketchFaint }}>"churned"</span>,{'\n'}
          {')'}
          {'\n'}
          {'\n'}
          pred.proba[:<span style={{ color: color.accent }}>3</span>]{'\n'}
          <span style={{ color: color.textFaint }}># [0.91, 0.07, 0.48]</span>
        </pre>
      </div>
    </section>
  );
}
