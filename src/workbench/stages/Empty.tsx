import { useRef } from 'react';

import { glass, mono, primaryBtn, sans, wb } from '../theme';
import type { Capabilities } from '../api';

export function Offline() {
  return (
    <div style={{ ...glass, margin: '20px 40px 0', padding: '14px 18px', display: 'flex', gap: 12, borderLeft: `2px solid ${wb.bad}` }}>
      <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad }}>offline</span>
      <span style={{ fontSize: 13, color: wb.muted }}>
        The workbench API is not answering on <code style={{ fontFamily: mono }}>:8000</code>. Start it with{' '}
        <code style={{ fontFamily: mono, color: wb.fg }}>./backend/run.sh</code>.
      </span>
    </div>
  );
}

export function Banner({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div style={{ ...glass, margin: '20px 40px 0', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', borderLeft: `2px solid ${wb.bad}` }}>
      <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad }}>error</span>
      <span style={{ flex: 1, fontSize: 13, color: wb.fg }}>{text}</span>
      <button type="button" onClick={onClose} className="wb-close" style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 13, color: wb.dim }}>
        ✕
      </button>
    </div>
  );
}

/** Long stages really take seconds, so the wait is narrated rather than hidden. */
export function BusyOverlay({ label }: { label: string }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 8, display: 'flex',
        alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120,
        background: 'rgba(28,27,26,0.62)', backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{ ...glass, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 8, height: 8, background: wb.acc, animation: 'wbPulse 1.2s ease-in-out infinite' }} />
        <span style={{ fontFamily: mono, fontSize: 13, color: wb.fg }}>{label}…</span>
      </div>
    </div>
  );
}

export function EmptyState({
  demos,
  caps,
  onDemo,
  onFile,
}: {
  demos: { id: string; label: string; note: string }[];
  caps: Capabilities | null;
  onDemo: (id: string) => void;
  onFile: (f: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: '64px 40px', textAlign: 'center' }}>
      <svg viewBox="0 0 120 120" width="80" height="80" fill="none" stroke={wb.ghost} strokeWidth="1.4">
        <rect x="14" y="24" width="92" height="76" strokeDasharray="6 5" />
        <path d="M14 44 H106 M45 24 V100 M76 24 V100" strokeDasharray="4 6" opacity="0.6" />
        <path d="M60 78 V50 M50 60 L60 50 L70 60" stroke={wb.acc} strokeWidth="2" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-0.015em' }}>No table in this run</h2>
        <p style={{ margin: 0, maxWidth: '52ch', fontSize: 15, lineHeight: 1.65, color: wb.muted }}>
          Everything downstream — fingerprint, recipe, training arms — is derived from one table.
          Load it and the seven stages unlock in order.
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        <button type="button" onClick={() => fileRef.current?.click()} style={{ ...primaryBtn, padding: '13px 22px', fontSize: 14 }}>
          Upload a CSV
        </button>
        {demos.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onDemo(d.id)}
            className="wb-ghost-btn"
            title={d.note}
            style={{ all: 'unset', cursor: 'pointer', padding: '13px 18px', background: 'rgba(255,255,255,0.04)', color: wb.body, fontSize: 13, fontFamily: sans }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: mono, fontSize: 12, color: wb.faint }}>
        the last column is taken as the target · change it in stage 01
      </div>

      {caps && (
        // What this deployment cannot do, said up front rather than discovered later.
        <div style={{ ...glass, maxWidth: 620, padding: '16px 18px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: wb.accDim }}>
            what this deployment runs
          </div>
          {caps.notes.map((n) => (
            <p key={n} style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: wb.muted }}>— {n}</p>
          ))}
        </div>
      )}
    </div>
  );
}
