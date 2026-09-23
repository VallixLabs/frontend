import { capLabel, glass, glassAccent, mono, primaryBtn, sans, stageEyebrow, stagePad, wb } from '../theme';
import type { Capabilities, TrainResult } from '../api';

const ARM_ROWS = [
  { key: 'priorfm', name: 'PriorFM', note: 'your fitted recipe', color: wb.acc, locked: true },
  { key: 'generic', name: 'Generic mixture', note: 'a broad mixture of priors', color: '#8C8C8C', locked: false },
  { key: 'mismatched', name: 'Mismatched prior', note: 'the farthest candidate · control', color: '#5C5C5C', locked: false },
  { key: 'gbt', name: 'Gradient boosting', note: 'untrained reference', color: wb.muted, locked: false },
  { key: 'knn', name: 'Nearest neighbours', note: 'untrained reference', color: wb.faint, locked: false },
];

const LockIcon = ({ stroke }: { stroke: string }) => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={stroke} strokeWidth="2">
    <rect x="5" y="11" width="14" height="10" />
    <path d="M8 11 V7 a4 4 0 0 1 8 0 v4" />
  </svg>
);

export function StageTrain({
  arms,
  onToggleArm,
  fairOpen,
  onToggleFair,
  train,
  caps,
  busy,
  onRun,
  onNext,
}: {
  arms: Record<string, boolean>;
  onToggleArm: (k: string) => void;
  fairOpen: boolean;
  onToggleFair: () => void;
  train: TrainResult | null;
  caps: Capabilities | null;
  busy: boolean;
  onRun: () => void;
  onNext: () => void;
}) {
  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={stageEyebrow}>Stage 05</div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>Train</h1>
        <p style={{ margin: 0, maxWidth: '74ch', fontSize: 15, lineHeight: 1.65, color: wb.muted }}>
          A controlled comparison, not a hyperparameter playground. Each trained arm sees only
          synthetic tables from its own generator — your rows are touched at evaluation and nowhere
          else.
        </p>
      </div>

      <div data-wbgrid="minmax(0,1fr) minmax(0,1.15fr)" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={glass}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>
              <span style={capLabel}>What each arm does</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: mono, fontSize: 11, color: wb.faint }}>
                <LockIcon stroke={wb.faint} />
                locked by design
              </span>
            </div>
            {[
              ['pretraining', 'synthetic tables from this arm’s generator'],
              ['client rows seen', '0 during pretraining'],
              ['what is selected', 'a weighting over inductive biases'],
              ['evaluation', 'in-context at 8 / 16 / 32 / 48 rows'],
              ['seed', '0 · identical across arms'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: `1px solid ${wb.lineSoft}` }}>
                <span style={{ flex: 1, fontSize: 13, color: wb.muted }}>{k}</span>
                <span style={{ fontFamily: mono, fontSize: 12.5, color: wb.fg, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
            {caps && (
              <div style={{ padding: '14px 18px', fontSize: 12.5, lineHeight: 1.65, color: wb.dim }}>
                {caps.notes[1]}
              </div>
            )}
          </div>

          <div style={glassAccent}>
            <button
              type="button"
              onClick={onToggleFair}
              aria-expanded={fairOpen}
              style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '16px 18px', fontFamily: sans }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={wb.acc} strokeWidth="1.6">
                <path d="M12 3 L20 6 V12 c0 4.5 -3.5 7.5 -8 9 c-4.5 -1.5 -8 -4.5 -8 -9 V6 Z" />
                <path d="M8.5 12 L11 14.5 L15.5 9.5" />
              </svg>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: wb.acc, textAlign: 'left' }}>
                {train ? 'Fair fight verified' : 'Fair fight — checked at run time'}
              </span>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.accWarm }}>{fairOpen ? '−' : '+'}</span>
            </button>

            {fairOpen && (
              <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(train?.fair ?? []).map((fc) => (
                  <div key={fc.k} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 12 }}>
                    <span style={{ color: wb.acc }}>✓</span>
                    <span style={{ flex: 1, color: wb.fg }}>{fc.k}</span>
                    <span style={{ color: wb.muted }}>{fc.v}</span>
                  </div>
                ))}
                {!train && <p style={{ margin: 0, fontSize: 12.5, color: wb.muted }}>Run the arms and the measured checks appear here.</p>}
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: wb.muted, paddingTop: 8, borderTop: '1px solid rgba(255,196,124,0.14)' }}>
                  If any assertion fails the run aborts. We would rather return nothing than report a
                  comparison that is not like-for-like.
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={glass}>
            <div style={{ ...capLabel, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>Arms</div>
            {ARM_ROWS.map((a) => {
              const on = a.locked ? true : !!arms[a.key];
              const fitted = train?.arms.find((x) => x.key === a.key);
              return (
                <button
                  key={a.key}
                  type="button"
                  disabled={a.locked}
                  onClick={() => !a.locked && onToggleArm(a.key)}
                  className={a.locked ? undefined : 'wb-arm'}
                  style={{ all: 'unset', boxSizing: 'border-box', cursor: a.locked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '15px 18px', borderBottom: `1px solid ${wb.lineSoft}`, fontFamily: sans }}
                >
                  <span style={{ width: 15, height: 15, border: `1px solid ${on ? wb.acc : wb.ghost}`, background: on ? wb.acc : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: wb.accInk }}>
                    {on ? '✓' : ''}
                  </span>
                  <span style={{ width: 9, height: 9, background: a.color }} />
                  <span style={{ flex: 1, fontSize: 14, color: wb.fg }}>{a.name}</span>
                  {/* once run, show the weighting the prior actually chose */}
                  <span style={{ fontFamily: mono, fontSize: 11, color: fitted ? wb.accDim : wb.dim, textAlign: 'right', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fitted?.bias ?? (a.locked ? `${a.note} · always on` : a.note)}
                  </span>
                </button>
              );
            })}
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <p style={{ margin: 0, flex: 1, fontSize: 13, color: wb.muted }}>
                {train ? `Completed in ${train.seconds}s.` : 'Each trained arm draws its own synthetic tables. Expect ~10–40 s.'}
              </p>
              <button type="button" onClick={onRun} disabled={busy} style={{ ...primaryBtn, padding: '11px 18px', opacity: busy ? 0.5 : 1 }}>
                {busy ? 'running…' : train ? 'Re-run arms' : 'Run the arms'}
              </button>
            </div>
          </div>

          {train && (
            <button type="button" onClick={onNext} style={primaryBtn}>Next · Results</button>
          )}
        </div>
      </div>
    </div>
  );
}
