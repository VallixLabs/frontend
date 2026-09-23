import { mono, primaryBtn, sans, wb } from '../theme';
import type { Check } from '../api';

/**
 * The architecture screen, shown as a dialog when a run is attempted on a table
 * that cannot be served.
 *
 * The caps are hard properties of the encoder, not a quota: it has exactly 17
 * slots, sixteen features plus the target. A table that misses them is refused
 * whole rather than truncated, because a model fitted to a mutilated table answers
 * a different question than the one that was asked.
 */
export function CompatibilityDialog({
  checks,
  onClose,
}: {
  checks: Check[];
  onClose: () => void;
}) {
  const failed = checks.filter((c) => !c.ok);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compatibility"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 24,
        background: 'rgba(15,19,23,0.72)', backdropFilter: 'blur(3px)',
      }}
    >
      {/* Opaque, not the usual translucent glass: a dialog that lets the table
          show through it is harder to read than the thing it interrupted. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px,100%)',
          background: wb.surface,
          border: `1px solid ${wb.rule}`,
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${wb.line}` }}>
          <span style={{ width: 8, height: 8, background: failed.length ? wb.bad : wb.good }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: failed.length ? wb.bad : wb.good }}>
            {failed.length ? 'This table cannot be served' : 'Compatible'}
          </span>
          <span style={{ flex: 1 }} />
          <button type="button" onClick={onClose} className="wb-close" aria-label="Close"
            style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 14, color: wb.dim }}>✕</button>
        </div>

        {checks.map((c) => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: `1px solid ${wb.lineSoft}` }}>
            <span style={{ fontFamily: mono, fontSize: 14, color: c.ok ? wb.good : wb.bad, width: 14 }}>{c.ok ? '✓' : '✕'}</span>
            <span style={{ flex: 1, fontSize: 13.5, color: wb.fg }}>{c.label}</span>
            <span style={{ fontFamily: mono, fontSize: 13, color: c.ok ? wb.good : wb.bad }}>{c.value}</span>
          </div>
        ))}

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {failed.length > 0 && (
            <>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: wb.fg, fontFamily: sans }}>
                We will not truncate columns or project the table down to make it fit. A model
                fitted to a mutilated table answers a different question than the one you asked.
              </p>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: wb.muted, fontFamily: sans }}>
                The encoder has exactly 17 slots: 16 feature columns plus the target. Of 331
                published OpenML datasets, 189 fail that cap — it is a limitation of the
                architecture, not a quota.
              </p>
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ ...primaryBtn, padding: '10px 20px' }}>
              {failed.length ? 'Use another table' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
