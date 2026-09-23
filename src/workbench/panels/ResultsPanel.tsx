import { capLabel, glass, mono, stageEyebrow, wb } from '../theme';
import type { Run } from '../api';

const SERIES = [wb.acc, '#8b9295', wb.faint];

/**
 * How well the model did, on the statistic that was fixed in advance.
 *
 * Only the proper scoring rule lives here. *What* the model said is joined onto
 * the rows themselves in `DataTable`, where the inputs it said it about are
 * visible on the same line.
 */
export function ResultsPanel({ run }: { run: Run }) {
  const res = run.result;

  if (!res) return null;

  const ctx = res.contexts;
  const all = res.arms.flatMap((a) => ctx.map((c) => a.scores[String(c)]?.loss)).filter((v): v is number => Number.isFinite(v));
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const px = (i: number) => 46 + (i * 300) / Math.max(1, ctx.length - 1);
  const py = (v: number) => 22 + (1 - (v - lo) / span) * 150;

  const best = Math.min(...res.arms.map((a) => a.scores['8']?.loss ?? Infinity));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, paddingTop: 22, borderTop: `1px solid ${wb.line}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={stageEyebrow}>Result</div>
          <h2 style={{ margin: 0, fontSize: 23, fontWeight: 600, letterSpacing: '-0.015em' }}>{res.summary}</h2>
        </div>
        <div style={{ display: 'flex', gap: 18, fontFamily: mono, fontSize: 12, color: wb.dim, paddingBottom: 3 }}>
          <span>{res.seconds}s</span>
          <span>{res.n_predictions} rows predicted</span>
        </div>
      </div>

        {/* ---------------------------------------------------------- log loss */}
        <div style={{ ...glass, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: `1px solid ${wb.line}` }}>
            <span style={capLabel}>{res.metric_name}</span>
            <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>lower is better</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: mono, fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '9px 16px', borderBottom: `1px solid ${wb.line}`, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: wb.faint, fontWeight: 400 }}>arm</th>
                  {ctx.map((c) => (
                    <th key={c} style={{ textAlign: 'right', padding: '9px 14px', borderBottom: `1px solid ${wb.line}`, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: c === 8 ? wb.acc : wb.faint, fontWeight: 400 }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.arms.map((a) => (
                  <tr key={a.key}>
                    <td style={{ padding: '10px 16px', borderBottom: `1px solid ${wb.lineSoft}`, color: a.served ? wb.acc : wb.fg, whiteSpace: 'nowrap' }}>{a.name}</td>
                    {ctx.map((c) => {
                      const v = a.scores[String(c)]?.loss;
                      const win = c === 8 && Math.abs((v ?? NaN) - best) < 1e-9;
                      return (
                        <td key={c} style={{ textAlign: 'right', padding: '10px 14px', borderBottom: `1px solid ${wb.lineSoft}`, color: win ? wb.acc : wb.muted, fontWeight: win ? 600 : 400 }}>
                          {Number.isFinite(v) ? v!.toFixed(3) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <svg viewBox="0 0 380 220" style={{ width: '100%', display: 'block', flex: 1, minHeight: 0 }} fill="none" fontFamily={mono}>
            <path d="M46 22 H356 M46 72 H356 M46 122 H356 M46 172 H356" stroke={wb.grid} />
            <path d="M46 16 V186 H362" stroke={wb.axis} strokeWidth="1.1" />
            {res.arms.map((a, k) => (
              <polyline key={a.key}
                points={ctx.map((c, i) => { const v = a.scores[String(c)]?.loss; return Number.isFinite(v) ? `${px(i)},${py(v!)}` : ''; }).filter(Boolean).join(' ')}
                stroke={SERIES[k % SERIES.length]} strokeWidth={a.served ? 2.1 : 1.3}
                strokeDasharray={a.served ? undefined : '5 4'} />
            ))}
            {ctx.map((c, i) => <text key={c} x={px(i) - 5} y="202" fill={wb.faint} fontSize="9">{c}</text>)}
            <text x="158" y="216" fill={wb.faint} fontSize="9">context rows</text>
          </svg>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, padding: '10px 16px', borderTop: `1px solid ${wb.line}` }}>
            {res.arms.map((a, k) => (
              <span key={a.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: mono, fontSize: 11, color: wb.muted }}>
                <span style={{ width: 10, height: 2, background: SERIES[k % SERIES.length] }} />{a.name}
              </span>
            ))}
          </div>
        </div>

    </div>
  );
}
