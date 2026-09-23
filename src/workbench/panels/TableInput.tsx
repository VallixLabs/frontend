import { useRef, useState } from 'react';

import { glass, mono, primaryBtn, sans, stageEyebrow, wb } from '../theme';
import type { Demo, Run } from '../api';

type Tab = 'upload' | 'paste' | 'demo';

const PLACEHOLDER = `age,income,region,churned
34,52000,north,no
51,81000,south,yes
28,39000,north,no`;

/** Where a table comes from: a file, a paste, or one of the bundled datasets. */
export function TableInput({
  run,
  demos,
  busy,
  onFile,
  onPaste,
  onDemo,
}: {
  run: Run | null;
  demos: Demo[];
  busy: string | null;
  onFile: (f: File) => void;
  onPaste: (t: string) => void;
  onDemo: (id: string) => void;
}) {
  const [tab, setTab] = useState<Tab>('upload');
  const [text, setText] = useState('');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upload', label: 'Upload CSV' },
    { id: 'paste', label: 'Paste table' },
    { id: 'demo', label: 'Demo datasets' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={stageEyebrow}>Your table</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.018em' }}>
          {run ? run.filename : 'Load a table'}
        </h1>
      </div>

      <div style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', width: 'fit-content' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              all: 'unset', cursor: 'pointer', padding: '9px 17px', fontSize: 13, fontFamily: sans,
              background: tab === t.id ? wb.acc : wb.surface,
              color: tab === t.id ? wb.accInk : wb.muted,
              fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------ upload */}
      {tab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) onFile(f);
          }}
          style={{
            ...glass, padding: '38px 24px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 14, textAlign: 'center',
            outline: drag ? `2px dashed ${wb.acc}` : `1px dashed ${wb.rule}`, outlineOffset: -8,
          }}
        >
          <svg viewBox="0 0 120 120" width="52" height="52" fill="none" stroke={wb.ghost} strokeWidth="1.6">
            <rect x="18" y="26" width="84" height="70" strokeDasharray="6 5" />
            <path d="M60 78 V48 M49 59 L60 48 L71 59" stroke={wb.acc} strokeWidth="2.2" />
          </svg>
          <div style={{ fontSize: 15, color: wb.fg }}>Drop a CSV here, or</div>
          <input ref={fileRef} type="file" accept=".csv,text/csv" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
          <button type="button" onClick={() => fileRef.current?.click()} style={{ ...primaryBtn, padding: '11px 20px' }}>
            Choose a file
          </button>
          <div style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>
            the last column is taken as the target · change it below
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- paste */}
      {tab === 'paste' && (
        <div style={glass}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderBottom: `1px solid ${wb.line}` }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: wb.muted }}>paste rows</span>
            <span style={{ flex: 1 }} />
            {/* a paste out of Excel or Sheets is tab-separated; the parser sniffs it */}
            <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>CSV or TSV · header row required</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            rows={10}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'vertical', border: 'none',
              outline: 'none', background: 'transparent', padding: '16px 18px',
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: 12.5, lineHeight: 1.7, color: wb.fg,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderTop: `1px solid ${wb.line}` }}>
            <span style={{ flex: 1, fontFamily: mono, fontSize: 11, color: wb.faint }}>
              {text.trim() ? `${text.trim().split('\n').length - 1} data rows` : 'nothing pasted yet'}
            </span>
            <button type="button" onClick={() => setText('')} className="wb-link"
              style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 12, color: wb.dim }}>
              clear
            </button>
            <button type="button" disabled={!text.trim() || !!busy} onClick={() => onPaste(text)}
              style={{ ...primaryBtn, padding: '10px 18px', opacity: !text.trim() || busy ? 0.45 : 1 }}>
              Use this table
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------- demo */}
      {tab === 'demo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
          {demos.map((d) => (
            <button key={d.id} type="button" onClick={() => onDemo(d.id)} className="wb-fpblock"
              style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, padding: 18, background: 'rgba(255,255,255,0.028)', fontFamily: sans }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: wb.fg }}>{d.label}</span>
              <span style={{ fontSize: 12.5, lineHeight: 1.5, color: wb.muted }}>{d.note}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
