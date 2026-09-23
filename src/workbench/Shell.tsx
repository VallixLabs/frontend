import { Link } from 'react-router-dom';
import { mono, sans, wb } from './theme';
import { STAGE_NAMES, STATUS_DOT, type StageStatus } from './data';
import type { HistoryRow } from './api';

// ------------------------------------------------------------------ top bar

export function TopBar({
  runName,
  state,
  elapsed,
  historyCount,
  onToggleDrawer,
}: {
  runName: string;
  state: { label: string; color: string };
  elapsed: string;
  historyCount: number;
  onToggleDrawer: () => void;
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        isolation: 'isolate',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
        padding: '0 22px',
        height: 60,
        background: 'linear-gradient(180deg, rgba(52,48,45,0.86), rgba(36,34,32,0.9))',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingRight: 20,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          height: '100%',
          color: wb.fg,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Vallix Labs</span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: wb.dim,
            padding: '2px 7px',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          PriorFM
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
        <span style={{ fontFamily: mono, fontSize: 14, color: wb.fg }}>{runName}</span>
        <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>seed 0</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 11px',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <span style={{ width: 7, height: 7, background: state.color }} />
        <span style={{ fontFamily: mono, fontSize: 12, color: state.color }}>{state.label}</span>
      </div>

      <div style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>elapsed {elapsed}</div>
      <div style={{ flex: 1 }} />

      <button
        type="button"
        onClick={onToggleDrawer}
        className="wb-ghost-btn"
        style={{
          all: 'unset',
          cursor: 'pointer',
          fontFamily: mono,
          fontSize: 12,
          color: wb.muted,
          background: 'rgba(255,255,255,0.04)',
          padding: '7px 13px',
        }}
      >
        Run history · {historyCount}
      </button>
    </div>
  );
}

// ------------------------------------------------------------------ left rail

export function Rail({
  stage,
  statuses,
  onGo,
  summary,
}: {
  stage: number;
  /** Status per stage, as the API derives it from what actually exists. */
  statuses: string[];
  onGo: (n: number) => void;
  summary: { rung: string; arms: string; table: string };
}) {
  return (
    <div
      style={{
        width: 260,
        flex: '0 0 260px',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(180deg, rgba(48,45,42,0.6), rgba(33,31,30,0.75))',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        padding: '18px 0 40px',
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 11,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: wb.dim,
          padding: '0 20px 14px',
        }}
      >
        Pipeline
      </div>

      {STAGE_NAMES.map((name, i) => {
        const status = (statuses[i] ?? 'idle') as StageStatus;
        const active = stage === i + 1;
        const dot = STATUS_DOT[status] ?? STATUS_DOT.idle;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onGo(i + 1)}
            className="wb-rail-btn"
            style={{
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '13px 20px',
              borderLeft: `2px solid ${active ? wb.acc : 'transparent'}`,
              background: active ? wb.surfaceHi : 'transparent',
              fontFamily: sans,
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 11, color: wb.dim, width: 14 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ width: 8, height: 8, background: dot, flex: '0 0 8px' }} />
            <span
              style={{
                flex: 1,
                fontSize: 14,
                color: active ? wb.fg : status === 'skipped' ? wb.faint : wb.muted,
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontFamily: mono,
                fontSize: 10,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: dot,
              }}
            >
              {status}
            </span>
          </button>
        );
      })}

      <div
        style={{
          margin: '26px 20px 0',
          paddingTop: 18,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 11,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: wb.dim,
          }}
        >
          This run
        </div>
        {[
          ['Disclosure', summary.rung, wb.acc],
          ['Arms', summary.arms, wb.fg],
          ['Table', summary.table, wb.fg],
        ].map(([k, v, c]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: wb.muted }}>
            <span>{k}</span>
            <span style={{ fontFamily: mono, color: c }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ drawer

const HISTORY_COLOUR: Record<string, string> = { good: wb.good, bad: wb.bad, dim: wb.dim };

export function RunHistoryDrawer({ history, onClose }: { history: HistoryRow[]; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 60,
        right: 0,
        bottom: 0,
        width: 'min(320px,86vw)',
        zIndex: 30,
        overflowY: 'auto',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(180deg, rgba(46,43,40,0.92), rgba(30,29,28,0.95))',
        boxShadow: '-28px 0 60px -30px rgba(0,0,0,0.9)',
        backdropFilter: 'blur(18px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 18px',
          borderBottom: `1px solid ${wb.line}`,
        }}
      >
        <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: wb.muted }}>
          Run history
        </span>
        <button
          type="button"
          onClick={onClose}
          className="wb-close"
          aria-label="Close run history"
          style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 14, color: wb.dim }}
        >
          ✕
        </button>
      </div>

      {history.length === 0 && (
        <div style={{ padding: '16px 18px', fontSize: 13, color: wb.dim }}>No runs yet.</div>
      )}
      {history.map((h) => (
        <div
          key={h.name}
          style={{
            padding: '15px 18px',
            borderBottom: `1px solid ${wb.lineSoft}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            borderLeft: `2px solid ${h.current ? wb.acc : 'transparent'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 7, height: 7, background: HISTORY_COLOUR[h.colour] ?? wb.dim }} />
            <span style={{ flex: 1, fontFamily: mono, fontSize: 13, color: wb.fg }}>{h.name}</span>
            <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{h.when}</span>
          </div>
          <div style={{ display: 'flex', gap: 14, fontFamily: mono, fontSize: 11, color: wb.dim }}>
            <span>{h.table}</span>
            <span>{h.rung}</span>
            <span>{h.dur}</span>
          </div>
          <div style={{ fontSize: 12, color: HISTORY_COLOUR[h.colour] ?? wb.dim }}>{h.result}</div>
        </div>
      ))}

      <div style={{ padding: '16px 18px', fontSize: 12, lineHeight: 1.6, color: wb.faint }}>
        Runs take ~5 minutes per arm. Close the tab — results are kept here.
      </div>
    </div>
  );
}
