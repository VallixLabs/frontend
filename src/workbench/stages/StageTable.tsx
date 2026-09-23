import { glass, mono, primaryBtn, sans, stageEyebrow, stagePad, wb } from '../theme';
import type { RunState } from '../api';

const SOURCES = ['Upload CSV', 'Paste data', 'OpenML id', 'Demo datasets'];

export function StageTable({
  run,
  onNext,
  onClear,
  onDemo,
  onTarget,
}: {
  run: RunState;
  onNext: () => void;
  onClear: () => void;
  onDemo: () => void;
  onTarget: (t: string) => void;
}) {
  const failing = !run.compatible;
  const compatColor = failing ? wb.bad : wb.good;
  const failed = run.checks.find((c) => !c.ok);

  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={stageEyebrow}>Stage 01</div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>Your table</h1>
      </div>

      <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', width: 'fit-content' }}>
        {SOURCES.map((s, i) => (
          <div key={s} style={{ background: i === 0 ? wb.acc : wb.surface, color: i === 0 ? wb.accInk : wb.muted, padding: '9px 17px', fontSize: 13, fontWeight: i === 0 ? 600 : 400 }}>
            {s}
          </div>
        ))}
      </div>

      <div data-wbgrid="minmax(0,1.25fr) minmax(0,1fr)" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        <div style={glass}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '15px 20px', borderBottom: `1px solid ${wb.line}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
              <span style={{ fontFamily: mono, fontSize: 14, color: wb.fg }}>{run.filename}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>{run.shape}</span>
            </div>
            <button type="button" onClick={onClear} className="wb-link" style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 12, color: wb.dim }}>
              replace
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: mono, fontSize: 12 }}>
              <thead>
                <tr>
                  {run.columns.map((c) => (
                    <th key={c.name} style={{ textAlign: 'left', padding: '11px 14px', borderBottom: `1px solid ${wb.line}`, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                      <div style={{ color: c.name === run.target ? wb.acc : wb.fg, fontWeight: 500 }}>
                        {c.name}
                        {c.name === run.target && <span style={{ color: wb.dim, fontWeight: 400 }}> · target</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                        <span style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: c.type === 'num' ? wb.good : wb.accDim, padding: '2px 6px', background: 'rgba(255,255,255,0.07)' }}>
                          {c.type}
                        </span>
                        <span style={{ fontSize: 10, color: wb.faint }}>{c.card_label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {run.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j} style={{ padding: '9px 14px', borderBottom: `1px solid ${wb.lineSoft}`, color: wb.muted, whiteSpace: 'nowrap' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '12px 20px', fontFamily: mono, fontSize: 11, color: wb.faint, borderTop: `1px solid ${wb.line}` }}>
            first {run.rows.length} of {run.n_rows} rows
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ ...glass, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: wb.dim }}>
              Target &amp; task
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label htmlFor="wb-target" style={{ fontSize: 13, color: wb.muted }}>Target column</label>
              <select
                id="wb-target"
                value={run.target}
                onChange={(e) => onTarget(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.04)', color: wb.fg, border: 'none', padding: '10px 13px', fontFamily: mono, fontSize: 13, cursor: 'pointer' }}
              >
                {run.columns.map((c) => (
                  <option key={c.name} value={c.name} style={{ background: wb.surface }}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 13, color: wb.muted }}>
                Task type <span style={{ color: wb.faint }}>· auto-detected</span>
              </label>
              <div style={{ display: 'flex', flex: '0 0 auto', width: 'fit-content', gap: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {(['classification', 'regression'] as const).map((t) => (
                  <div key={t} style={{ background: run.task === t ? wb.acc : wb.surface, color: run.task === t ? wb.accInk : wb.muted, padding: '9px 14px', textAlign: 'center', fontSize: 13, fontWeight: run.task === t ? 600 : 400, textTransform: 'capitalize' }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={glass}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 20px', borderBottom: `1px solid ${wb.line}` }}>
              <span style={{ width: 8, height: 8, background: compatColor }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: compatColor }}>
                {failing ? 'Incompatible with this architecture' : 'Compatible'}
              </span>
            </div>

            {run.checks.map((ck) => (
              <div key={ck.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${wb.lineSoft}` }}>
                <span style={{ fontFamily: mono, fontSize: 14, color: ck.ok ? wb.good : wb.bad, width: 14 }}>{ck.ok ? '✓' : '✕'}</span>
                <span style={{ flex: 1, fontSize: 13, color: wb.fg }}>{ck.label}</span>
                <span style={{ fontFamily: mono, fontSize: 13, color: ck.ok ? wb.good : wb.bad }}>{ck.value}</span>
              </div>
            ))}

            {failing ? (
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, borderTop: `1px solid ${wb.line}` }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: wb.fg }}>
                  This table cannot be run, and we will not truncate columns or project it down to
                  fit. A recipe fitted to a mutilated table is a recipe for a different problem.
                </p>
                <div style={{ borderLeft: `2px solid ${wb.acc}`, padding: '12px 0 12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: mono, fontSize: 12, color: wb.acc }}>What failed</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: wb.muted }}>
                    <strong style={{ color: wb.fg, fontWeight: 600 }}>{failed?.label}</strong> — measured{' '}
                    <span style={{ fontFamily: mono, color: wb.bad }}>{failed?.value}</span>. The encoder has
                    exactly 17 slots: 16 features plus the target. This is a genuine limitation of the
                    architecture, not a quota.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button type="button" onClick={onDemo} style={{ ...primaryBtn, padding: '11px 18px' }}>
                    Load a table within the caps
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <p style={{ margin: 0, flex: 1, fontSize: 13, lineHeight: 1.6, color: wb.muted }}>
                  All three caps clear. Continue to disclosure.
                </p>
                <button type="button" onClick={onNext} style={{ ...primaryBtn, padding: '11px 18px', fontFamily: sans }}>
                  Next · Disclosure
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
