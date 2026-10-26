import { useEffect, useRef, useState, type CSSProperties, type FocusEvent } from 'react';

import { SiteFooter, SiteHeader } from './Chrome';

/**
 * The playground, ported from the Claude Design file `Playground.dc.html`: a small table whose first two rows
 * are labelled context; Predict fills in the rest. The "model" is the design's in-browser demo (a fixed linear
 * prior plus a kernel-weighted correction from the context rows), not one of the served models.
 */

const mono = "'Geist Mono', ui-monospace, monospace";
const label: CSSProperties = { fontFamily: "'Source Sans 3', system-ui, sans-serif", fontWeight: 600, textTransform: 'uppercase' };
const pad = 'clamp(16px, 4vw, 56px)';

const INIT = [[3.2, 7.4, 5.1], [8.3, 2.6, 6.0], [5.5, 4.8, 9.1]];
const INIT_LABELS = [3.0, 8.0];
const NAMES = ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'];
const W = [0.62, -0.38, 0.47, 0.24, -0.29];
const MAX = 5; // rows and columns
const TICKS = 14, TICK_MS = 45; // the "Predicting…" scramble

type Pred = { y: number; conf: number };

function prior(r: number[]) {
  const m = r.length; let z = 0;
  for (let j = 0; j < m; j++) z += W[j] * (r[j] - 5.5);
  if (m > 1) z += 0.045 * (r[0] - 5.5) * (r[1] - 5.5);
  return { y: 5.5 + 4.5 * Math.tanh(z / 4.2), z };
}

// In-context: prior + kernel-weighted correction from the two labelled rows.
function model(grid: number[][], labels: number[]): Pred[] {
  const m = grid[0].length, T = [0, 1].filter((k) => grid[k]);
  const res = T.map((k) => labels[k] - prior(grid[k]).y);
  const dist = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, v, j) => s + (v - b[j]) ** 2, 0) / m);
  return grid.map((r, i) => {
    if (i < 2) return { y: labels[i], conf: 1 };
    const p = prior(r); const ds = T.map((k) => dist(r, grid[k]));
    const ws = ds.map((d) => Math.exp(-(d * d) / 6)); const Wsum = ws.reduce((a, b) => a + b, 0) || 1;
    let y = p.y + ws.reduce((a, w, k) => a + w * res[k], 0) / Math.max(1, Wsum) * Math.min(1, Wsum);
    y = Math.max(1, Math.min(10, y));
    const near = Math.min(...ds);
    const conf = Math.max(0.5, Math.min(0.97, 0.93 - 0.075 * near + 0.015 * m - 0.03 * Math.abs(res.reduce((a, b) => a + b, 0)) / 2));
    return { y, conf };
  });
}

const rand1to10 = () => Math.round((1 + Math.random() * 9) * 10) / 10;
const round1 = (v: number) => Math.round(v * 10) / 10;
// What a cell accepts while typing: digits and one decimal point, at most 4 characters.
const sanitize = (s: string) => s.replace(',', '.').replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').slice(0, 4);
const selectAll = (e: FocusEvent<HTMLInputElement>) => { const t = e.target; setTimeout(() => t.select(), 0); };

/** A 1–10 number typed into a cell: applied as soon as it is valid, clamped into range on blur or Enter. */
function NumIn({ value, draft, label, size, onDraft, onCommit }: {
  value: number; draft: string | undefined; label: string; size: number; onDraft: (s: string) => void; onCommit: () => void;
}) {
  return (
    <input type="text" inputMode="decimal" autoComplete="off" spellCheck={false} className="vx-pg-in" aria-label={label}
      value={draft ?? value.toFixed(1)} onChange={(e) => onDraft(e.target.value)} onBlur={onCommit}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} onFocus={selectAll} style={{ fontSize: size }} />
  );
}

const big: CSSProperties = { fontSize: 24, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' };

export default function Playground() {
  const [grid, setGrid] = useState(() => INIT.map((r) => r.slice()));
  const [labels, setLabels] = useState(INIT_LABELS);
  const [prev, setPrev] = useState<number[] | null>(null);
  const [shown, setShown] = useState<Pred[] | null>(null);
  const [running, setRunning] = useState(false);
  const [stale, setStale] = useState(false);
  const [tick, setTick] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({}); // cell text being typed, keyed "i-j" or "L<i>"
  const iv = useRef(0);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    scrollTo(0, 0);
    let alive = true, kill: (() => void) | undefined;
    import('./fx/vine-art.js').then((V) => { if (alive && footerRef.current) kill = V.footerVines(footerRef.current); }).catch((e) => console.error(e));
    return () => { alive = false; kill?.(); clearInterval(iv.current); };
  }, []);

  const n = grid.length, m = grid[0].length;
  const preds = model(grid, labels);

  // Edit the grid; a change of shape drops the shown predictions, any other edit marks them outdated.
  const update = (fn: (g: number[][]) => void) => {
    const g = grid.map((r) => r.slice()); fn(g);
    const changedShape = g.length !== n || g[0].length !== m;
    setGrid(g);
    if (changedShape) { setShown(null); setStale(false); } else setStale(!!shown);
  };

  const setLabel = (i: number, nv: number) => {
    if (labels[i] === nv) return;
    const next = labels.slice(); next[i] = nv; setLabels(next); setStale(!!shown);
  };
  const setCell = (i: number, j: number, nv: number) => { if (grid[i] && grid[i][j] !== nv) update((g) => { g[i][j] = nv; }); };
  const apply = (k: string, nv: number) => {
    if (k[0] === 'L') setLabel(+k.slice(1), nv);
    else { const [i, j] = k.split('-').map(Number); setCell(i, j, nv); }
  };
  const draft = (k: string, raw: string) => {
    const t = sanitize(raw);
    setDrafts((d) => ({ ...d, [k]: t }));
    const nv = parseFloat(t);
    if (isFinite(nv) && nv >= 1 && nv <= 10) apply(k, round1(nv));
  };
  const finish = (k: string) => {
    const t = drafts[k]; if (t == null) return;
    const nv = parseFloat(t);
    if (isFinite(nv)) apply(k, round1(Math.min(10, Math.max(1, nv))));
    setDrafts((d) => { const c = { ...d }; delete c[k]; return c; });
  };

  const runPredict = () => {
    if (running) return;
    const target = model(grid, labels);
    setPrev(shown ? shown.map((p) => p.y) : null);
    setRunning(true); setStale(false); setTick(0);
    let k = 0; clearInterval(iv.current);
    iv.current = window.setInterval(() => {
      k++;
      if (k >= TICKS) { clearInterval(iv.current); setRunning(false); setShown(target); setTick(0); } else setTick(k);
    }, TICK_MS);
  };

  const reset = () => {
    clearInterval(iv.current);
    setGrid(INIT.map((r) => r.slice())); setLabels(INIT_LABELS); setPrev(null); setShown(null); setRunning(false); setStale(false); setDrafts({});
  };

  const gridCols = `48px repeat(${m}, minmax(140px, 1fr)) minmax(200px, 1.2fr)`;
  const predictLabel = running ? 'Predicting…' : stale ? 'Predict again' : shown ? 'Predicted' : 'Predict';

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: '#f6f5f2', minHeight: '100vh' }}>
      <SiteHeader page="playground" />

      <section style={{ padding: `84px ${pad} 28px`, background: 'radial-gradient(120% 80% at 50% 0%, #dedcd7 0%, #ebeae5 45%, #f6f5f2 85%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.035em' }}>Enter a value. Watch it <span style={{ color: '#2e5c36' }}>predict.</span></h1>
        </div>
      </section>

      <section style={{ padding: `8px ${pad} clamp(88px, 10vw, 140px)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: Math.max(760, 48 + m * 140 + 200), maxWidth: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...label, fontSize: 12, letterSpacing: '.08em', color: '#6c6963' }}>
                <span>{n} rows × {m} columns</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button type="button" className="vx-pg-btn vx-pg-add" disabled={n >= MAX}
                  onClick={() => update((g) => g.push(Array.from({ length: m }, rand1to10)))}
                  style={{ cursor: n < MAX ? 'pointer' : 'not-allowed', opacity: n < MAX ? 1 : 0.4 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>Row
                </button>
                <button type="button" className="vx-pg-btn vx-pg-add" disabled={m >= MAX}
                  onClick={() => update((g) => g.forEach((r) => r.push(rand1to10())))}
                  style={{ cursor: m < MAX ? 'pointer' : 'not-allowed', opacity: m < MAX ? 1 : 0.4 }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>Column
                </button>
                <button type="button" className="vx-pg-btn vx-pg-ghost" onClick={() => update((g) => g.forEach((r) => r.forEach((_, j) => { r[j] = rand1to10(); })))} style={{ cursor: 'pointer' }}>Randomize</button>
                <button type="button" className="vx-pg-btn vx-pg-ghost" onClick={reset} style={{ cursor: 'pointer' }}>Reset</button>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1.5px solid #141414', background: '#f9f8f5', boxShadow: '0 34px 70px -46px rgba(20,20,20,.45)' }}>
              <div style={{ minWidth: 48 + m * 140 + 200 }}>
                <div style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1.5px solid #141414', background: '#ecebe6' }}>
                  <div style={{ padding: '12px 10px' }} />
                  {NAMES.slice(0, m).map((name, j) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '10px 12px', borderLeft: '1px solid #d6d4ce', ...label, fontSize: 11, letterSpacing: '.1em' }}>
                      <span>{name}</span>
                      <button type="button" className="vx-pg-x" aria-label="Remove column" title="Remove column"
                        onClick={() => { if (m > 1) update((g) => g.forEach((r) => r.splice(m - 1, 1))); }}
                        style={{ visibility: m > 1 && j === m - 1 ? 'visible' : 'hidden' }}>×</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#141414', color: '#f6f5f2', ...label, fontSize: 11, letterSpacing: '.1em' }}><span>Prediction</span><span style={{ color: '#8f8b84' }}>1–10</span></div>
                </div>

                {grid.map((r, i) => {
                  const context = i < 2;
                  const sp = shown && shown[i];
                  const p = context ? preds[i] : (sp || { y: 0, conf: 0 });
                  const d = sp && prev && prev.length === n && !running ? sp.y - prev[i] : 0;
                  const scr = running && !context;
                  const pred = context ? p.y.toFixed(1) : scr ? (1 + ((tick * 37 + i * 53) % 90) / 10).toFixed(1) : sp ? p.y.toFixed(1) : '—';
                  const conf = scr || !sp ? '' : Math.round(p.conf * 100) + '%';
                  const confW = scr ? Math.round((tick / TICKS) * 100) + '%' : sp ? Math.round(p.conf * 100) + '%' : '0%';
                  const delta = context ? '' : scr ? 'Running' : !sp ? 'Press predict' : stale ? 'Outdated' : Math.abs(d) < 0.05 ? '' : (d > 0 ? '▲ ' : '▼ ') + Math.abs(d).toFixed(1);
                  return (
                    <div key={i} className="vx-pg-row" style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: i === 1 ? '1.5px solid #141414' : '1px solid #dcdad4' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '6px 4px', fontFamily: mono, fontSize: 11, color: '#8f8b84' }}>
                        <span>{String(i + 1).padStart(2, '0')}</span><span style={{ fontSize: 8.5, letterSpacing: '.1em', color: '#141414' }}>{context ? 'CONTEXT' : ''}</span>
                        <button type="button" className="vx-pg-x" aria-label="Remove row" title="Remove row"
                          onClick={() => { if (!context && n > 3) update((g) => g.splice(i, 1)); }}
                          style={{ visibility: !context && n > 3 ? 'visible' : 'hidden' }}>×</button>
                      </div>
                      {r.map((v, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderLeft: '1px solid #e3e1dc', background: context ? `rgba(20,20,20,${(0.02 + v * 0.008).toFixed(3)})` : `rgba(20,20,20,${(0.012 + v * 0.011).toFixed(3)})`, transition: 'background .2s' }}>
                          <NumIn value={v} draft={drafts[`${i}-${j}`]} label={`${NAMES[j]}, row ${i + 1}`} size={24}
                            onDraft={(t) => draft(`${i}-${j}`, t)} onCommit={() => finish(`${i}-${j}`)} />
                        </div>
                      ))}
                      {context ? (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, padding: '10px 16px 7px', borderLeft: '1.5px solid #141414', background: '#f9f8f5' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ ...label, fontSize: 9.5, letterSpacing: '.1em', color: '#6c6963' }}>Context label</span>
                          </div>
                          <NumIn value={p.y} draft={drafts['L' + i]} label={`Context label, row ${i + 1}`} size={22}
                            onDraft={(t) => draft('L' + i, t)} onCommit={() => finish('L' + i)} />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, padding: '10px 16px', borderLeft: '1.5px solid #141414', background: '#ecebe6', opacity: stale && !running ? 0.45 : 1, transition: 'opacity .3s' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ ...big, fontSize: 26 }}>{pred}</span>
                            <span style={{ ...label, fontSize: 10, letterSpacing: '.08em', color: '#6c6963' }}>{delta}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...label, fontSize: 10, letterSpacing: '.08em', color: '#6c6963' }}>
                            <span>Conf.</span>
                            <div style={{ flex: 1, height: 4, background: '#d6d4ce' }}><div style={{ height: 4, width: confW, background: '#141414', transition: 'width .35s cubic-bezier(.2,.7,.2,1)' }} /></div>
                            <span style={{ color: '#141414', minWidth: '3ch', textAlign: 'right' }}>{conf}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px 24px' }}>
              <div style={{ flex: '1 1 320px', maxWidth: '62ch', fontSize: 13.5, lineHeight: 1.5, color: '#6c6963' }}>The first two rows are context: type their features and labels, then press Predict. The model learns from them and predicts the rows below. Up to 5 rows × 5 columns, values 1 to 10. Demo model, runs in your browser.</div>
              <button type="button" onClick={runPredict} className="vx-pg-btn vx-pg-predict"
                style={{ cursor: 'pointer', gap: 9, padding: '12px 24px', fontWeight: 600, boxShadow: stale || !shown ? '0 0 0 4px rgba(20,20,20,.14)' : 'none' }}>
                <span>{predictLabel}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter page="playground" footerRef={footerRef} />
    </div>
  );
}
