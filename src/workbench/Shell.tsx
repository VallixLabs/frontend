import { Link } from 'react-router-dom';

import { mono, sans, wb } from './theme';
import { MODELS, type HistoryRow, type ModelStatus } from './api';
import { Logo } from '../brand/Logo';

const DOT: Record<string, string> = { good: wb.good, bad: wb.bad, dim: wb.dim };

export function TopBar({
  model,
  runName,
  elapsed,
  onNew,
  onToggleSide,
  account,
}: {
  model: ModelStatus | null;
  runName: string;
  elapsed: string;
  onNew: () => void;
  onToggleSide: () => void;
  /** The signed-in account and its sign-out control. */
  account?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 20, isolation: 'isolate',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        padding: '8px 16px', minHeight: 70,
        background: 'linear-gradient(180deg, rgba(42,51,58,0.86), rgba(36,34,32,0.9))',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      {/* Only rendered as a control below 900px; the stylesheet hides it above. */}
      <button
        type="button"
        onClick={onToggleSide}
        className="wb-side-toggle wb-ghost-btn"
        aria-label="Toggle run history"
        style={{
          all: 'unset', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column',
          gap: 4, padding: '9px 8px', color: wb.muted,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 18, height: 2, background: 'currentColor', display: 'block' }} />
        ))}
      </button>

      <Link
        to="/"
        style={{
          display: 'flex', alignItems: 'center', gap: 12, paddingRight: 20,
          borderRight: '1px solid rgba(255,255,255,0.07)', height: '100%', color: wb.fg,
        }}
      >
        <Logo tone="onDark" height={45} className="v-logo-md" />
        
      </Link>

      {/* Which model servers are answering: each run goes to one of them. */}
      <div title={model?.error ?? undefined} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '5px 11px', background: 'rgba(255,255,255,0.05)' }}>
        {model === null ? (
          <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>checking models…</span>
        ) : (
          MODELS.map((sv) => {
            const up = model.available?.includes(sv.key) ?? false;
            return (
              <span key={sv.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 7, height: 7, background: up ? wb.good : wb.bad }} />
                <span style={{ fontFamily: mono, fontSize: 12, color: up ? wb.body : wb.bad }}>
                  {sv.name}{up ? '' : ' · down'}
                </span>
              </span>
            );
          })
        )}
      </div>

      {runName && (
        <div className="v-hide-sm" style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
          <span style={{ fontFamily: mono, fontSize: 13, color: wb.muted }}>{runName}</span>
          <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>{elapsed}</span>
        </div>
      )}

      <div style={{ flex: 1 }} />
      {account}
      <button type="button" onClick={onNew} className="wb-ghost-btn"
        style={{ all: 'unset', cursor: 'pointer', fontFamily: sans, fontSize: 13, color: wb.body, background: 'rgba(255,255,255,0.04)', padding: '7px 14px' }}>
        New run
      </button>
    </div>
  );
}

/**
 * The left rail is the run history: the pipeline it replaced described a sequence
 * the product no longer has. Every past run is one click away and a scored one
 * carries its result with it.
 */
export function HistorySidebar({
  history,
  currentId,
  open,
  onOpen,
  onClose,
}: {
  history: HistoryRow[];
  currentId: string | null;
  /** Only meaningful below 900px, where the rail is an off-canvas drawer. */
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`wb-side${open ? ' wb-side-open' : ''}`}
      style={{
        width: 268, flex: '0 0 268px', borderRight: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(180deg, rgba(40,48,55,0.6), rgba(27,34,40,0.75))',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        padding: '18px 0 40px', overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0 20px 14px' }}>
        <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: wb.dim }}>
          Run history
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{history.length}</span>
        {/* The drawer covers the whole viewport on a phone, including the bar that
            opened it, so it carries its own way out. */}
        <button
          type="button"
          onClick={onClose}
          className="wb-side-toggle wb-close"
          aria-label="Close run history"
          style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 15, color: wb.dim, padding: '0 2px' }}
        >
          ✕
        </button>
      </div>

      {history.length === 0 && (
        <div style={{ padding: '4px 20px', fontSize: 13, lineHeight: 1.6, color: wb.dim }}>
          No runs yet. Load a table and the run appears here.
        </div>
      )}

      {history.map((h) => {
        const on = h.id === currentId;
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => onOpen(h.id)}
            className="wb-rail-btn"
            style={{
              all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex',
              flexDirection: 'column', gap: 7, width: '100%', padding: '13px 20px',
              borderLeft: `2px solid ${on ? wb.acc : 'transparent'}`,
              background: on ? wb.surfaceHi : 'transparent', fontFamily: sans,
              borderBottom: `1px solid ${wb.lineSoft}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 7, height: 7, background: DOT[h.colour] ?? wb.dim, flex: '0 0 7px' }} />
              <span style={{ flex: 1, fontFamily: mono, fontSize: 13, color: on ? wb.acc : wb.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {h.table}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{h.when}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontFamily: mono, fontSize: 11, color: wb.dim }}>
              <span>{h.id}</span>
              {h.shape && <span>{h.shape}</span>}
              {h.state === 'scored' && <span>{h.dur}</span>}
            </div>
            <div style={{ fontSize: 12, color: DOT[h.colour] ?? wb.dim, lineHeight: 1.45 }}>{h.result}</div>
          </button>
        );
      })}
    </div>
  );
}
