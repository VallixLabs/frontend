import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { mono, sans, wb } from '../theme';
import { MODELS, type ModelKey } from '../api';

type Model = (typeof MODELS)[number];

const TVARIT = MODELS.filter((m) => m.family === 'tvarit');
const VALLI = MODELS.filter((m) => m.family === 'valli');

/**
 * Which model the next run uses, as two choices:
 *   Tvarit  the pre-trained models, served as they are (TabICLv2, TabPFN v2, Kumo-Tabular large): the button
 *           opens a dialog to pick one, and then names the one picked;
 *   Valli   the Valli pipeline, which builds a model for each table.
 * A model whose server is not answering, or that cannot serve this table, is disabled with the reason on
 * hover. The run itself is routed by the backend to that model's own inference server.
 */
export function ModelPicker({
  value,
  available,
  unavailable,
  disabled,
  onChange,
}: {
  value: ModelKey;
  /** Servers answering now; null while the first status check is still out. */
  available: ModelKey[] | null;
  /** Models that cannot serve this table, with the reason. */
  unavailable: Partial<Record<ModelKey, string>>;
  disabled: boolean;
  onChange: (m: ModelKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const tvaritRef = useRef<HTMLButtonElement | null>(null);

  const isUp = (m: Model) => available === null || available.includes(m.key);
  const usable = (m: Model) => isUp(m) && !unavailable[m.key];
  const status = (m: Model) => (!isUp(m) ? 'server not answering' : unavailable[m.key] ? 'not for this table' : m.sub);
  const reason = (m: Model) =>
    !isUp(m) ? `The ${m.server} server is not answering right now` : unavailable[m.key] ?? `Runs on ${m.server}`;

  const chosen = MODELS.find((m) => m.key === value) ?? MODELS[0];
  const onTvarit = chosen.family === 'tvarit';

  const close = () => {
    setOpen(false);
    tvaritRef.current?.focus();          // back to the control that opened the dialog
  };

  return (
    <div
      role="group"
      aria-label="Model to run"
      aria-disabled={disabled || undefined}
      style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.08)', flexWrap: 'wrap' }}
    >
      <button
        ref={tvaritRef}
        type="button"
        className="wb-model-opt"
        aria-pressed={onTvarit}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        title={onTvarit ? `${chosen.name}: ${reason(chosen)}. Click to choose another model` : 'Choose a pre-trained model'}
        onClick={() => { if (!disabled) setOpen(true); }}
        style={option(onTvarit, disabled, !TVARIT.some(usable))}
      >
        <Label
          on={onTvarit}
          name="Tvarit"
          opens
          line={onTvarit ? chosen.name : 'pre-trained · choose a model'}
          attribution={onTvarit ? chosen.attribution : undefined}
        />
      </button>

      {VALLI.map((m) => {
        const on = m.key === value;
        const off = disabled || !usable(m);
        return (
          <button
            key={m.key}
            type="button"
            className="wb-model-opt"
            aria-pressed={on}
            aria-disabled={off || undefined}
            title={reason(m)}
            onClick={() => { if (!off) onChange(m.key); }}
            style={option(on, off, !usable(m))}
          >
            <Label on={on} name={m.name} line={status(m)} />
          </button>
        );
      })}

      {open && createPortal(
        <TvaritDialog
          value={value}
          usable={usable}
          status={status}
          reason={reason}
          onPick={(k) => { onChange(k); close(); }}
          onClose={close}
        />,
        document.body,
      )}
    </div>
  );
}

/**
 * The Tvarit dialog: the pre-trained models, one per row, the one chosen marked. Picking one closes it, and so do
 * Escape, the ✕ and a click outside; arrow keys move between the models. Rendered into <body> (a portal): the
 * panels' backdrop blur would otherwise confine a fixed-position overlay to the panel it sits in.
 */
function TvaritDialog({
  value,
  usable,
  status,
  reason,
  onPick,
  onClose,
}: {
  value: ModelKey;
  usable: (m: Model) => boolean;
  status: (m: Model) => string;
  reason: (m: Model) => string;
  onPick: (m: ModelKey) => void;
  onClose: () => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = useRef(Math.max(0, TVARIT.findIndex((m) => m.key === value)));

  useEffect(() => { refs.current[first.current]?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const move = (from: number, step: number) => refs.current[(from + step + TVARIT.length) % TVARIT.length]?.focus();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wb-tvarit-title"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 24,
        background: 'rgba(15,19,23,0.72)', backdropFilter: 'blur(3px)', fontFamily: sans,
      }}
    >
      {/* Opaque like the compatibility dialog: the table showing through would compete with the choice. */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(460px,100%)', background: wb.surface, border: `1px solid ${wb.rule}`,
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${wb.line}` }}>
          <span id="wb-tvarit-title" style={{ fontSize: 15, fontWeight: 600, color: wb.fg }}>Tvarit</span>
          <span style={{ flex: 1 }} />
          <button type="button" onClick={onClose} className="wb-close" aria-label="Close"
            style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 14, color: wb.dim }}>✕</button>
        </div>

        <p style={{ margin: 0, padding: '12px 20px', fontSize: 12.5, lineHeight: 1.6, color: wb.muted }}>
          Pre-trained models, served as they are: your training rows are their context, and nothing is
          trained on your table.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.08)' }}>
          {TVARIT.map((m, i) => {
            const on = m.key === value;
            const off = !usable(m);
            return (
              <button
                key={m.key}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                className="wb-model-opt"
                aria-pressed={on}
                aria-disabled={off || undefined}
                title={reason(m)}
                onClick={() => { if (!off) onPick(m.key); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); move(i, 1); }
                  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); move(i, -1); }
                }}
                style={{ ...option(on, off, off), minWidth: 0, padding: '12px 20px' }}
              >
                <Label on={on} name={m.name} line={status(m)} attribution={m.attribution} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** One option's box: olive when chosen, faded when its model cannot run. */
function option(on: boolean, off: boolean, faded: boolean): React.CSSProperties {
  return {
    all: 'unset', boxSizing: 'border-box', cursor: off ? 'not-allowed' : 'pointer',
    display: 'flex', flexDirection: 'column', gap: 3, padding: '7px 14px', minWidth: 150,
    background: on ? wb.acc : wb.surface, opacity: faded ? 0.45 : 1, fontFamily: sans,
  };
}

/**
 * One option's text: a dot that fills when it is the one chosen, the name (with a caret when it opens the
 * dialog), a status line, and the attribution the model's licence asks for.
 */
function Label({ on, name, line, attribution, opens }: {
  on: boolean; name: string; line: string; attribution?: string; opens?: boolean;
}) {
  return (
    <>
      <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: on ? 600 : 500, color: on ? wb.accInk : wb.fg }}>
        <span
          aria-hidden
          style={{
            width: 8, height: 8, flex: '0 0 8px', border: `1.5px solid ${on ? wb.accInk : wb.dim}`,
            background: on ? wb.accInk : 'transparent', borderRadius: '50%', boxSizing: 'border-box',
          }}
        />
        {name}
        {opens && <span aria-hidden style={{ marginLeft: 'auto', paddingLeft: 8, fontSize: 10, color: on ? wb.accInk : wb.dim }}>▾</span>}
      </span>
      <span style={{ fontFamily: mono, fontSize: 10.5, color: on ? wb.accWell : wb.dim }}>{line}</span>
      {attribution && (
        <span style={{ fontFamily: mono, fontSize: 10.5, color: on ? wb.accWell : wb.dim }}>{attribution}</span>
      )}
    </>
  );
}
