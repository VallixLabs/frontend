import { bleedDark, color, eyebrow, font } from '../theme';

const COLS = '1.6fr 1fr 1fr 1fr';

// Measured in Phase 1 (results/summary.md): TabArena's official splits, 3 folds x 3 seeds,
// mean ± standard deviation. TabICLv2 with 8 ensemble members and all training rows; gradient
// boosting is scikit-learn's HistGradientBoosting with default settings (not tuned).
// `best` is the column that wins the row, so the highlight follows the data.
const ROWS = [
  { suite: 'Diabetes · ROC-AUC ↑', cells: ['0.843 ± 0.006', '0.785 ± 0.095', '0.806 ± 0.005'], best: 0 },
  { suite: 'Diabetes · log loss ↓', cells: ['0.463 ± 0.005', '0.527 ± 0.065', '0.633 ± 0.022'], best: 0 },
  { suite: 'Concrete · RMSE ↓', cells: ['3.70 ± 0.03', '8.02 ± 0.59', '4.60 ± 0.07'], best: 0 },
  { suite: 'Time per table', cells: ['0.35 s', '7–10 min*', '0.15 s'], best: 2 },
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
            Measured on two held-out tables.
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
          TabArena splits · 3 folds × 3 seeds · mean ± sd
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
          <div style={{ padding: '16px 22px' }}>Table · metric</div>
          <div style={{ padding: '16px 22px' }}>TabICLv2 (served)</div>
          <div style={{ padding: '16px 22px' }}>PriorFM</div>
          <div style={{ padding: '16px 22px' }}>Gradient boosting (defaults)</div>
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
            {r.cells.map((v, j) => (
              <div key={j} style={{ padding: '18px 22px', color: j === r.best ? color.accent : color.textMuted, fontWeight: j === r.best ? 600 : 400 }}>{v}</div>
            ))}
          </div>
        ))}
      </div>
      <p style={{ margin: '14px 0 0', fontFamily: font.mono, fontSize: 12, color: color.textFaint, lineHeight: 1.6 }}>
        * PriorFM builds a model per table: 26–28 s routing plus 6–10 min training for most recipes;
        the slowest recipe measured took about 2.4 h. Two tables only; not evidence of general performance.
      </p>
    </section>
  );
}
