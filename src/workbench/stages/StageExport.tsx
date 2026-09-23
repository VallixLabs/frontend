import { useEffect, useState } from 'react';

import { capLabel, code, glass, glassWell, mono, stageEyebrow, stagePad, wb } from '../theme';
import { api, type Disclosure, type RecipeDetail, type RunState } from '../api';

type Kind = 'recipe' | 'card' | 'cli';

const FILES: { kind: Kind; ext: string; name: string; desc: string }[] = [
  { kind: 'recipe', ext: 'json', name: 'Recipe', desc: 'The filled-in form: seven stages, chosen branches, every blank with value, primitive and scope.' },
  { kind: 'card', ext: 'json', name: 'Reproducibility card', desc: 'Seed, disclosure rung, fingerprint distance, episode counts, and what this deployment could not run.' },
  { kind: 'cli', ext: 'txt', name: 'CLI invocation', desc: 'The command that reproduces this run from the table and the rung it actually used.' },
];

/** Downloads are built in the browser from the API's text, so nothing is written server-side. */
function save(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/octet-stream' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function StageExport({
  run,
  recipe,
  disclosure,
}: {
  run: RunState;
  recipe: RecipeDetail | null;
  disclosure: Disclosure | null;
}) {
  const [cli, setCli] = useState('');
  const [card, setCard] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<Kind | null>(null);

  useEffect(() => {
    api.exportFile(run.id, 'cli').then((r) => setCli(r.content)).catch(() => {});
    api.exportFile(run.id, 'card').then((r) => setCard(r.content)).catch(() => {});
  }, [run.id]);

  const download = async (kind: Kind) => {
    setBusy(kind);
    try {
      const r = await api.exportFile(run.id, kind);
      save(r.filename, r.content);
    } finally {
      setBusy(null);
    }
  };

  const rung = disclosure?.rungs[(disclosure?.rung ?? run.rung) - 1];

  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={stageEyebrow}>Stage 07</div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>Export</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
        {FILES.map((f) => (
          <div key={f.kind} style={{ background: 'rgba(255,255,255,0.028)', padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{f.ext}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: wb.fg }}>{f.name}</div>
            <p style={{ margin: 0, flex: 1, fontSize: 13, lineHeight: 1.6, color: wb.muted }}>{f.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 12, borderTop: `1px solid ${wb.line}` }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{run.id}</span>
              <button type="button" onClick={() => download(f.kind)} className="wb-link" style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 12, color: wb.acc }}>
                {busy === f.kind ? 'building…' : 'download ↓'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div data-wbgrid="minmax(0,1fr) minmax(0,1fr)" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        <div style={glass}>
          <div style={{ ...capLabel, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>Reproducibility card</div>
          {[
            ['run', run.id, wb.fg],
            ['table', run.filename, wb.fg],
            ['target · task', `${run.target} · ${run.task}`, wb.fg],
            ['disclosure rung used', rung ? `${rung.symbol} · ${rung.name}` : '—', wb.acc],
            ['recipe', recipe?.name ?? '—', wb.fg],
            ['fingerprint distance', recipe?.dist ?? '—', wb.acc],
            ['seed', '0', wb.muted],
          ].map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: `1px solid ${wb.lineSoft}` }}>
              <span style={{ flex: 1, fontSize: 13, color: wb.muted }}>{k}</span>
              <span style={{ fontFamily: mono, fontSize: 13, color: c }}>{v}</span>
            </div>
          ))}
          <pre style={{ margin: 0, padding: 18, fontFamily: code, fontSize: 11.5, lineHeight: 1.7, color: wb.muted, overflowX: 'auto', maxHeight: 260 }}>
            {card || 'building…'}
          </pre>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={glassWell}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: `1px solid ${wb.line}` }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim }}>reproduce this run</span>
              <button
                type="button"
                className="wb-link"
                onClick={() => {
                  navigator.clipboard?.writeText(cli).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
                style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 12, color: wb.acc }}
              >
                {copied ? 'copied ✓' : 'copy'}
              </button>
            </div>
            <pre style={{ margin: 0, padding: 18, fontFamily: code, fontSize: 12.5, lineHeight: 1.9, color: wb.body, overflowX: 'auto' }}>
              {cli || 'building…'}
            </pre>
          </div>

          <div style={{ ...glass, padding: 18, display: 'flex', gap: 14 }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={wb.acc} strokeWidth="1.6" style={{ flex: '0 0 20px' }}>
              <path d="M12 3 L20 6 V12 c0 4.5 -3.5 7.5 -8 9 c-4.5 -1.5 -8 -4.5 -8 -9 V6 Z" />
            </svg>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: wb.muted }}>
              The card records the disclosure rung actually used, and the capabilities this deployment
              was missing. Re-run at a different rung and the fingerprint distance changes, so the card
              will not match — by design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
