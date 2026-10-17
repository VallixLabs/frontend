import { useRef } from 'react';

import { mono, sans, wb } from '../theme';
import { MODELS, type ModelKey } from '../api';

/**
 * Which model the next run uses. A radio group: one choice, arrow keys move between the
 * options, and an option whose server is not answering is disabled with the reason on hover.
 * The run itself is routed by the backend to that model's own inference server.
 */
export function ModelPicker({
  value,
  available,
  disabled,
  onChange,
}: {
  value: ModelKey;
  /** Servers answering now; null while the first status check is still out. */
  available: ModelKey[] | null;
  disabled: boolean;
  onChange: (m: ModelKey) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const isUp = (k: ModelKey) => available === null || available.includes(k);

  const move = (from: number, step: number) => {
    for (let n = 1; n <= MODELS.length; n++) {
      const i = (from + step * n + MODELS.length) % MODELS.length;
      if (isUp(MODELS[i].key)) {
        onChange(MODELS[i].key);
        refs.current[i]?.focus();
        return;
      }
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Model to run"
      aria-disabled={disabled || undefined}
      style={{ display: 'flex', gap: 1, background: 'rgba(255,255,255,0.08)', flexWrap: 'wrap' }}
    >
      {MODELS.map((m, i) => {
        const on = m.key === value;
        const up = isUp(m.key);
        const off = disabled || !up;
        return (
          <button
            key={m.key}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-disabled={off || undefined}
            tabIndex={on ? 0 : -1}
            className="wb-model-opt"
            title={!up ? `The ${m.server} server is not answering right now` : `Runs on ${m.server}`}
            onClick={() => { if (!off) onChange(m.key); }}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(i, 1); }
              if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(i, -1); }
            }}
            style={{
              all: 'unset', boxSizing: 'border-box', cursor: off ? 'not-allowed' : 'pointer',
              display: 'flex', flexDirection: 'column', gap: 3, padding: '7px 14px', minWidth: 150,
              background: on ? wb.acc : wb.surface, opacity: !up ? 0.45 : 1, fontFamily: sans,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: on ? 600 : 500, color: on ? wb.accInk : wb.fg }}>
              <span
                aria-hidden
                style={{
                  width: 8, height: 8, flex: '0 0 8px', border: `1.5px solid ${on ? wb.accInk : wb.dim}`,
                  background: on ? wb.accInk : 'transparent', borderRadius: '50%', boxSizing: 'border-box',
                }}
              />
              {m.name}
            </span>
            <span style={{ fontFamily: mono, fontSize: 10.5, color: on ? wb.accWell : wb.dim }}>
              {up ? m.sub : 'server not answering'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
