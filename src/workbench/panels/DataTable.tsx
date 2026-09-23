import { useCallback, useMemo, useState } from 'react';

import { glass, mono, primaryBtn, sans, wb } from '../theme';
import { api, type JoinedRow, type Run } from '../api';
import { usePaged } from '../usePaged';
import { Pager } from './Pager';

const ROWS_PER_PAGE = 10;

/**
 * The table and the model's answers, on one row each.
 *
 * They are fused rather than shown as two panels because they describe the same
 * rows: reading across gives you the inputs and the prediction together. That also
 * means one pager, which is the only way the two halves cannot drift — two pagers
 * over the same data disagree the moment either one clamps differently.
 *
 * Before a run the answer columns are present but empty, so the shape of what is
 * coming is visible from the start. A row the model received as *context* stays
 * empty afterwards too: it was evidence rather than a question, and inventing a
 * prediction for it would misreport what the model was asked.
 */
export function DataTable({
  run,
  busy,
  modelReady,
  onTarget,
  onRun,
  onShowCompatibility,
}: {
  run: Run;
  busy: string | null;
  modelReady: boolean;
  onTarget: (t: string) => void;
  onRun: () => void;
  onShowCompatibility: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const fetchRows = useCallback(
    (offset: number, limit: number) => api.rows(run.id, offset, limit),
    [run.id],
  );
  const paged = usePaged<JoinedRow>(fetchRows, ROWS_PER_PAGE, `${run.id}-${run.state}`);

  const featureCols = useMemo(
    () => run.columns.filter((c) => c.name !== run.target),
    [run.columns, run.target],
  );
  const targetIdx = run.columns.findIndex((c) => c.name === run.target);
  const lastColumn = run.columns.at(-1)?.name ?? '';

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? run.columns.filter((c) => c.name.toLowerCase().includes(q)) : run.columns;
  }, [run.columns, query]);

  const pick = (name: string) => {
    setQuery('');
    setOpen(false);
    if (name !== run.target) onTarget(name);
  };

  const cls = run.task === 'classification';
  const head: React.CSSProperties = {
    padding: '9px 13px', borderBottom: `1px solid ${wb.line}`, whiteSpace: 'nowrap',
    fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 400,
  };
  const cell: React.CSSProperties = {
    padding: '9px 13px', borderBottom: `1px solid ${wb.lineSoft}`, whiteSpace: 'nowrap',
  };
  // The answer columns are pinned to the right edge: a wide table scrolls its
  // features horizontally, and a prediction you have to scroll away from its own
  // row to read defeats the point of joining them. Sticky cells cannot be
  // translucent — whatever scrolls under them would show through — so these carry
  // an opaque tone matched to the panel rather than the glass tint used elsewhere.
  const ANSWER_HEAD = '#333c3e';
  const ANSWER_CELL = '#2e373a';
  // One sticky cell holding all three values, not three sticky cells side by side.
  // Three would each need a `right` offset equal to the rendered width of those to
  // its right — and the browser is free to widen a column past whatever width we
  // ask for, at which point every offset is wrong and the cells overlap. A single
  // cell with an internal grid has no offsets to get wrong.
  const ANSWER_COLS = '92px 104px 66px';
  const stick: React.CSSProperties = { position: 'sticky', right: 0, zIndex: 1 };

  return (
    <div style={glass}>
      {/* ------------------------------------------------------------ header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, padding: '13px 16px', borderBottom: `1px solid ${wb.line}` }}>
        {/* Compatibility as a status, not a panel. Clicking it opens the detail. */}
        <button
          type="button"
          onClick={onShowCompatibility}
          className="wb-ghost-btn"
          title="Show the architecture caps"
          style={{
            all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 11px', background: 'rgba(255,255,255,0.05)', fontFamily: mono, fontSize: 12,
            color: run.compatible ? wb.good : wb.bad,
          }}
        >
          <span style={{ width: 7, height: 7, background: run.compatible ? wb.good : wb.bad }} />
          {run.compatible ? 'compatible' : 'incompatible'}
        </button>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
          <span style={{ fontFamily: mono, fontSize: 13, color: wb.fg }}>{run.filename}</span>
          <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>{run.shape}</span>
        </div>

        <span style={{ flex: 1 }} />

        <button
          type="button"
          onClick={onRun}
          disabled={!!busy || !modelReady}
          title={!modelReady ? 'The model is still fitting' : undefined}
          style={{ ...primaryBtn, padding: '10px 22px', opacity: busy || !modelReady ? 0.45 : 1 }}
        >
          {busy ? 'running…' : run.state === 'scored' ? 'Re-run' : 'Run'}
        </button>
      </div>

      {/* ---------------------------------------------- target, over its columns */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: `1px solid ${wb.line}`, background: 'rgba(0,0,0,0.16)' }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: wb.dim }}>
          {featureCols.length} features
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: wb.dim }}>
          target
        </span>

        <div style={{ position: 'relative', minWidth: 190 }}>
          <input
            value={open ? query : run.target}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { setQuery(''); setOpen(true); }}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            placeholder="search columns…"
            aria-label="Target column"
            style={{
              width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)',
              color: open ? wb.fg : wb.acc, border: `1px solid ${open ? wb.acc : 'transparent'}`,
              padding: '7px 11px', fontFamily: mono, fontSize: 12.5, outline: 'none',
            }}
          />
          {open && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, minWidth: 240, zIndex: 9, maxHeight: 220,
              overflowY: 'auto', background: wb.surface, border: `1px solid ${wb.rule}`,
              boxShadow: '0 18px 40px -18px rgba(0,0,0,0.9)',
            }}>
              {matches.length === 0 && (
                <div style={{ padding: '9px 12px', fontFamily: mono, fontSize: 12, color: wb.dim }}>no column matches</div>
              )}
              {matches.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); pick(c.name); }}
                  className="wb-cand"
                  style={{
                    all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px',
                    fontFamily: mono, fontSize: 12.5,
                    color: c.name === run.target ? wb.acc : wb.fg,
                    background: c.name === run.target ? wb.surfaceHi : 'transparent',
                  }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', color: c.type === 'num' ? wb.good : wb.accDim }}>{c.type}</span>
                  {c.name === lastColumn && <span style={{ fontSize: 10, color: wb.dim }}>default</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <span style={{ fontFamily: mono, fontSize: 11, color: wb.dim, textTransform: 'capitalize' }}>{run.task}</span>
      </div>

      {/* ------------------------------------------------------------- the rows */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: mono, fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...head, textAlign: 'right', color: wb.faint }}>#</th>
              {featureCols.map((c) => (
                <th key={c.name} style={{ ...head, textAlign: 'left', color: wb.faint, verticalAlign: 'top' }}>
                  <div style={{ color: wb.fg, fontSize: 12, letterSpacing: 0, textTransform: 'none', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ marginTop: 4, color: c.type === 'num' ? wb.good : wb.accDim }}>{c.type}</div>
                </th>
              ))}
              {/* the answer block, tinted so the join is visible at a glance */}
              <th className="wb-answer" style={{ ...head, ...stick, background: ANSWER_HEAD, borderLeft: `1px solid ${wb.rule}`, padding: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: ANSWER_COLS, gap: 10, padding: '9px 14px' }}>
                  <span style={{ textAlign: 'right', color: wb.dim }}>actual</span>
                  <span style={{ textAlign: 'right', color: wb.acc }}>predicted</span>
                  <span style={{ textAlign: 'right', color: wb.dim }}>conf.</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {(paged.page?.rows ?? []).map((r) => {
              const cells = r.cells.filter((_, j) => j !== targetIdx);
              const p = r.pred;
              const hit = p && String(p.actual) === String(p.predicted);
              return (
                <tr key={r.i}>
                  <td style={{ ...cell, textAlign: 'right', color: wb.ghost }}>{r.i}</td>
                  {cells.map((v, j) => (
                    <td key={j} style={{ ...cell, color: wb.muted }}>{v}</td>
                  ))}
                  <td className="wb-answer" style={{ ...cell, ...stick, background: ANSWER_CELL, borderLeft: `1px solid ${wb.rule}`, padding: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: ANSWER_COLS, gap: 10, padding: '9px 14px' }}>
                      <span style={{ textAlign: 'right', color: p ? wb.muted : wb.ghost }}>{p ? p.actual : '—'}</span>
                      <span style={{ textAlign: 'right', color: p ? (cls ? (hit ? wb.good : wb.bad) : wb.fg) : wb.ghost }}>{p ? p.predicted : '—'}</span>
                      <span style={{ textAlign: 'right', color: p ? wb.dim : wb.ghost }}>{p && p.confidence !== '' ? p.confidence : '—'}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pager {...paged} total={paged.total || run.n_rows}>
        {run.state !== 'scored' && (
          <span style={{ fontFamily: sans, fontSize: 11.5, color: wb.dim }}>
            answers fill in after a run
          </span>
        )}
        {run.state === 'scored' && (
          <button type="button" className="wb-link"
            onClick={() => api.exportFile(run.id, 'predictions').then((r) => {
              const url = URL.createObjectURL(new Blob([r.content], { type: 'text/csv' }));
              const a = document.createElement('a');
              a.href = url; a.download = r.filename; a.click();
              URL.revokeObjectURL(url);
            }).catch(() => {})}
            style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: mono, fontSize: 11, color: wb.acc }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4 V15 M7.5 10.5 L12 15 L16.5 10.5" /><path d="M4.5 18.5 H19.5" />
            </svg>
            csv
          </button>
        )}
      </Pager>
    </div>
  );
}
