import { capLabel, glass, glassWarn, mono, primaryBtn, stageEyebrow, stagePad, wb } from '../theme';
import type { Results } from '../api';

export function StageResults({
  results,
  onPickContext,
  onNext,
}: {
  results: Results | null;
  onPickContext: (n: number) => void;
  onNext: () => void;
}) {
  if (!results) {
    return (
      <div style={stagePad}>
        <div style={stageEyebrow}>Stage 06</div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600 }}>Results</h1>
        <p style={{ margin: 0, fontSize: 14, color: wb.muted }}>Run the arms in stage 05 first.</p>
      </div>
    );
  }

  const curveNames = Object.keys(results.curves);
  const all = curveNames.flatMap((k) => results.curves[k]).filter((v) => Number.isFinite(v));
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const px = (i: number) => 50 + (i * 300) / Math.max(1, results.contexts.length - 1);
  const py = (v: number) => 30 + (1 - (v - lo) / span) * 200;

  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={stageEyebrow}>Stage 06</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>Results</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: wb.dim }}>
            context rows
          </span>
          <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', width: 'fit-content' }}>
            {results.contexts.map((n) => {
              const on = results.context === n;
              return (
                <button key={n} type="button" onClick={() => onPickContext(n)} className="wb-ctx"
                  style={{ all: 'unset', cursor: 'pointer', padding: '8px 16px', background: on ? wb.acc : wb.surface, color: on ? wb.accInk : n === 8 ? wb.acc : wb.muted, fontFamily: mono, fontSize: 13, fontWeight: n === 8 ? 600 : 400 }}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', borderLeft: `2px solid ${wb.acc}`, padding: '10px 0 10px 14px' }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: wb.muted, maxWidth: '86ch' }}>
          The <strong style={{ color: wb.acc, fontWeight: 600 }}>8-row column is the point of the whole product</strong>:
          a prior only matters when the context cannot carry the information itself.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
        {results.headline.map((h) => (
          <div key={h.vs} style={{ background: 'rgba(255,255,255,0.028)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, color: wb.muted }}>vs {h.vs}</div>
            <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 600, color: h.win ? wb.acc : wb.muted }}>{h.delta}</div>
            <div style={{ fontFamily: mono, fontSize: 12, color: h.win ? wb.good : wb.bad, paddingTop: 8, borderTop: `1px solid ${wb.line}` }}>
              {h.win ? 'PriorFM ahead' : 'PriorFM behind'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {results.families.map((fam) => (
          <div key={fam.title} style={glass}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12, padding: '15px 18px', borderBottom: `1px solid ${wb.line}`, background: 'rgba(255,255,255,0.045)' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: fam.accent ? wb.acc : wb.fg }}>{fam.title}</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: '#8C8C8C' }}>{fam.metrics}</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 12, color: wb.dim }}>{fam.note}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: mono, fontSize: 13 }}>
                <thead>
                  <tr>
                    {['arm', ...fam.cols].map((c, i) => (
                      <th key={c} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '11px 18px', borderBottom: `1px solid ${wb.line}`, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: wb.faint, fontWeight: 400 }}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fam.rows.map((r) => (
                    <tr key={r.arm}>
                      <td style={{ padding: '12px 18px', borderBottom: `1px solid ${wb.lineSoft}`, color: r.lead ? wb.acc : wb.fg, whiteSpace: 'nowrap' }}>{r.arm}</td>
                      {r.vals.map((v, i) => (
                        <td key={i} style={{ textAlign: 'right', padding: '12px 18px', borderBottom: `1px solid ${wb.lineSoft}`, color: v.best ? wb.acc : wb.muted, fontWeight: v.best ? 600 : 400 }}>
                          {v.t}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: mono, fontSize: 13, color: wb.acc }}>→</span>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: wb.muted, maxWidth: '92ch' }}>
            Read the blocks separately, on purpose.{' '}
            <strong style={{ color: wb.fg, fontWeight: 600 }}>A win on the proper scoring rule is not a win on accuracy</strong>,
            and merging them into one ranking would erase whichever result actually happened.
          </p>
        </div>
      </div>

      <div style={glass}>
        <div style={{ ...capLabel, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>
          Loss against context size
        </div>
        <svg viewBox="0 0 400 300" style={{ width: '100%', maxWidth: 640, display: 'block' }} fill="none" fontFamily={mono}>
          <path d="M50 30 H370 M50 96 H370 M50 162 H370 M50 228 H370" stroke={wb.grid} />
          <path d="M50 20 V250 H380" stroke={wb.axis} strokeWidth="1.2" />
          {curveNames.map((name, k) => {
            const pts = results.curves[name]
              .map((v, i) => (Number.isFinite(v) ? `${px(i)},${py(v)}` : ''))
              .filter(Boolean)
              .join(' ');
            const lead = k === 0;
            return <polyline key={name} points={pts} stroke={lead ? wb.acc : ['#8C8C8C', '#5C5C5C', wb.muted, wb.faint][k % 4]} strokeWidth={lead ? 2 : 1.4} strokeDasharray={lead ? undefined : '5 4'} />;
          })}
          {results.contexts.map((c, i) => (
            <text key={c} x={px(i) - 6} y="268" fill={wb.faint} fontSize="10">{c}</text>
          ))}
          <text x="170" y="288" fill={wb.faint} fontSize="10">context rows</text>
        </svg>
        <div style={{ padding: '12px 18px', borderTop: `1px solid ${wb.line}`, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {curveNames.map((name, k) => (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: mono, fontSize: 11, color: wb.muted }}>
              <span style={{ width: 10, height: 2, background: k === 0 ? wb.acc : ['#8C8C8C', '#5C5C5C', wb.muted, wb.faint][k % 4] }} />
              {name}
            </span>
          ))}
        </div>
      </div>

      <div style={glassWarn}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${wb.line}` }}>
          <span style={{ fontFamily: mono, fontSize: 13, color: wb.bad }}>—</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: wb.fg }}>What this does not show</span>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['ECE', 'Deliberately not reported. It depends on a bin count with no principled value and is not a proper scoring rule. Calibration here is the CORP reliability term, which needs no bins.'],
            ['capacity', 'Each arm is a weighting over small sklearn learners, not an 812k-parameter in-context transformer. The comparison between arms is like-for-like; the absolute numbers are not the paper’s.'],
            ['seeds', 'One seed. A gap smaller than the seed spread is not a result, and nothing here has been re-run to check which of these are.'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad, flex: '0 0 auto', minWidth: 62 }}>{k}</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: wb.muted }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={onNext} style={{ ...primaryBtn, width: 'fit-content' }}>Next · Export</button>
    </div>
  );
}
