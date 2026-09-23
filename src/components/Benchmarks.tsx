import { bleedDark, color, eyebrow, font } from '../theme';

const COLS = '1.6fr 1fr 1fr 1fr';

const ROWS = [
  { suite: 'OpenML-CC18 (small)', vallix: '0.894', xgb: '0.871', automl: '0.879' },
  { suite: 'Credit & risk (7 sets)', vallix: '0.812', xgb: '0.803', automl: '0.808' },
  { suite: 'Churn & retention', vallix: '0.847', xgb: '0.829', automl: '0.841' },
  { suite: 'Time-to-first-prediction', vallix: '1.2 s', xgb: '3 h', automl: '1 h' },
];

export function Benchmarks() {
  return (
    <section id="benchmarks" className="v-gutter" style={{ ...bleedDark, padding: '20px 48px 130px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 36,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: '52ch' }}>
          <div style={eyebrow}>Benchmarks</div>
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
            Zero-shot, against tuned baselines.
          </h2>
        </div>
        {/* The provenance line stays next to the table, never in a footnote. */}
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 12,
            color: color.textFaint,
            border: `1px solid ${color.rule}`,
            padding: '10px 14px',
          }}
        >
          mean ROC-AUC · 5 seeds · placeholder figures
        </div>
      </div>

      <div
        data-shine="1"
        style={{ border: `1px solid ${color.rule}`, background: color.inkRaised, overflow: 'hidden' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            fontFamily: font.mono,
            fontSize: 12,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: color.textFaint,
            borderBottom: `1px solid ${color.rule}`,
          }}
        >
          <div style={{ padding: '16px 22px' }}>Suite</div>
          <div style={{ padding: '16px 22px' }}>Vallix-1</div>
          <div style={{ padding: '16px 22px' }}>XGBoost (tuned)</div>
          <div style={{ padding: '16px 22px' }}>AutoML (1h)</div>
        </div>

        {ROWS.map((r, i) => (
          <div
            key={r.suite}
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              fontSize: 15,
              color: color.textBody,
              borderBottom: i < ROWS.length - 1 ? `1px solid ${color.ruleSoft}` : undefined,
            }}
          >
            <div style={{ padding: '18px 22px' }}>{r.suite}</div>
            <div style={{ padding: '18px 22px', color: color.accent, fontWeight: 600 }}>{r.vallix}</div>
            <div style={{ padding: '18px 22px', color: color.textMuted }}>{r.xgb}</div>
            <div style={{ padding: '18px 22px', color: color.textMuted }}>{r.automl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
