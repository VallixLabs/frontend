import { code, glass, glassWell, mono, primaryBtn, sans, stageEyebrow, stagePad, wb } from '../theme';
import type { Disclosure } from '../api';

const ACC_WIDTH = ['30%', '52%', '76%', '100%'];

export function StageDisclosure({
  disclosure,
  onPick,
  onNext,
}: {
  disclosure: Disclosure | null;
  onPick: (n: number) => void;
  onNext: () => void;
}) {
  const rung = disclosure?.rung ?? 3;
  const rungs = disclosure?.rungs ?? [];

  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={stageEyebrow}>Stage 02</div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>Disclosure level</h1>
        <p style={{ margin: 0, maxWidth: '70ch', fontSize: 15, lineHeight: 1.65, color: wb.muted }}>
          Four rungs. Each one names exactly what leaves your machine — and the panel on the right is
          the literal payload built from your table, not a summary of it.
        </p>
      </div>

      <div data-wbgrid="minmax(0,1fr) minmax(0,1fr)" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rungs.map((r, i) => {
            const on = rung === i + 1;
            return (
              <button
                key={r.symbol}
                type="button"
                onClick={() => onPick(i + 1)}
                className="wb-rung"
                style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', gap: 16, width: '100%', padding: 20, background: on ? wb.surfaceHi : wb.surface, borderLeft: `3px solid ${on ? wb.acc : 'transparent'}`, fontFamily: sans }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 3 }}>
                  <span style={{ fontFamily: mono, fontSize: 17, color: on ? wb.acc : wb.fg }}>{r.symbol}</span>
                  <span style={{ width: 1, flex: 1, background: wb.rule }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: on ? wb.acc : wb.fg }}>{r.name}</span>
                    {/* measured by serialising the payload, never estimated */}
                    <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{r.tag}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: wb.muted }}>{r.what}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                    <div style={{ flex: '0 0 96px', height: 5, background: wb.rule, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: ACC_WIDTH[i], background: on ? wb.acc : wb.ghost }} />
                    </div>
                    <span style={{ fontFamily: mono, fontSize: 11, color: wb.dim }}>disclosure</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={glassWell}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>
              <span style={{ width: 7, height: 7, background: wb.acc }} />
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.fg }}>what leaves your machine</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{disclosure?.size ?? '—'}</span>
            </div>
            <pre style={{ margin: 0, padding: '20px 18px', fontFamily: code, fontSize: 12, lineHeight: 1.75, color: wb.body, overflowX: 'auto', maxHeight: 460 }}>
              {disclosure?.payload ?? 'building…'}
            </pre>
            {rung === 4 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '0 18px 18px' }}>
                <span style={{ fontFamily: mono, fontSize: 13, color: wb.bad }}>!</span>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: wb.bad }}>
                  Every cell of every row is transmitted. Only pick Σ∞ if your data governance allows
                  the raw table to leave.
                </p>
              </div>
            )}
          </div>

          <div style={{ ...glass, padding: 20, display: 'flex', gap: 16 }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={wb.acc} strokeWidth="1.6" style={{ flex: '0 0 22px', marginTop: 2 }}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11 V17 M12 7.5 V8.5" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: wb.fg }}>
                Why every rung is defined invariant to preprocessing
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: wb.muted }}>
                Every tabular foundation model z-scores or quantile-transforms its columns before it
                sees anything. Location and scale are destroyed before the model looks, so a rung that
                spends privacy on means and variances buys you nothing. Skew and kurtosis are
                standardised moments; Spearman correlation survives any monotone transform; mutual
                information survives any invertible one. Mean and scale are transmitted at no rung
                below Σ∞.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <p style={{ margin: 0, flex: 1, fontSize: 13, color: wb.dim }}>
              Selected: <span style={{ fontFamily: mono, color: wb.acc }}>{rungs[rung - 1]?.symbol ?? '—'}</span> —
              locked into the reproducibility card.
            </p>
            <button type="button" onClick={onNext} style={{ ...primaryBtn, padding: '11px 18px' }}>
              Next · Fingerprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
