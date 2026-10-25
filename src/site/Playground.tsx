import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { SiteFooter, SiteHeader } from './Chrome';

/**
 * The playground, ported from the Claude Design file `Playground.dc.html`: a small table whose first two rows
 * are labelled context; Predict fills in the rest. The "model" is the design's in-browser demo (a fixed linear
 * prior plus a kernel-weighted correction from the context rows), not one of the served models.
 */

const mono = "'Geist Mono', ui-monospace, monospace";
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
const pctOf = (v: number) => ((v - 1) / 9 * 100).toFixed(1) + '%';
const trackBg = (v: number): CSSProperties => ({ backgroundImage: `linear-gradient(to right, #141414 ${pctOf(v)}, #cfccc5 ${pctOf(v)})` });

function Range({ value, onSet, label }: { value: number; onSet: (v: number) => void; label: string }) {
  return (
    <>
      <input className="vx-range" type="range" min="1" max="10" step="0.1" value={value.toFixed(1)} aria-label={label}
        onChange={(e) => onSet(Math.round(+e.target.value * 10) / 10)} style={trackBg(value)} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -3, fontFamily: mono, fontSize: 9, lineHeight: 1, color: '#a29e97' }}><span>1</span><span>10</span></div>
    </>
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
  const iv = useRef(0);

  useEffect(() => {
    scrollTo(0, 0);
    let alive = true, kill: (() => void) | undefined;
    import('./fx/cursor-trail.js').then((m) => { if (alive) kill = m.cursorTrail(); }).catch(() => {});
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
    setGrid(INIT.map((r) => r.slice())); setLabels(INIT_LABELS); setPrev(null); setShown(null); setRunning(false); setStale(false);
  };

  const gridCols = `48px repeat(${m}, minmax(140px, 1fr)) minmax(200px, 1.2fr)`;
  const predictLabel = running ? 'Predicting…' : stale ? 'Predict again' : shown ? 'Predicted' : 'Predict';

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: '#f6f5f2', minHeight: '100vh' }}>
      <SiteHeader page="playground" />

      <section style={{ padding: `84px ${pad} 28px`, background: 'radial-gradient(120% 80% at 50% 0%, #dedcd7 0%, #ebeae5 45%, #f6f5f2 85%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.035em' }}>Slide a value. Watch it predict.</h1>
          <p style={{ margin: '14px 0 0', maxWidth: '54ch', fontSize: 18, lineHeight: 1.5, color: '#3e3c38', textWrap: 'balance' }}>A small table and a live model. Change any cell and the prediction column updates instantly.</p>
        </div>
      </section>

      <section style={{ padding: `8px ${pad} clamp(88px, 10vw, 140px)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 'fit-content', maxWidth: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6c6963' }}>
                <span>{n} rows × {m} columns</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button type="button" onClick={runPredict} className="vx-pg-btn vx-pg-predict"
                  style={{ cursor: 'pointer', gap: 9, padding: '9px 18px', fontWeight: 600, boxShadow: stale || !shown ? '0 0 0 4px rgba(20,20,20,.14)' : 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.7 4.6L14.5 6 10.8 9l1.2 4.9L8 11.3 4 13.9 5.2 9 1.5 6l4.8-.4z" /></svg>
                  <span>{predictLabel}</span>
                </button>
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
                    <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: '10px 12px', borderLeft: '1px solid #d6d4ce', fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      <span>{name}</span>
                      <button type="button" className="vx-pg-x" aria-label="Remove column" title="Remove column"
                        onClick={() => { if (m > 1) update((g) => g.forEach((r) => r.splice(m - 1, 1))); }}
                        style={{ visibility: m > 1 && j === m - 1 ? 'visible' : 'hidden' }}>×</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#141414', color: '#f6f5f2', fontFamily: mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}><span>◆ Prediction</span><span style={{ color: '#8f8b84' }}>1–10</span></div>
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
                        <div key={j} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 14px 7px', borderLeft: '1px solid #e3e1dc', background: context ? `rgba(20,20,20,${(0.02 + v * 0.008).toFixed(3)})` : `rgba(20,20,20,${(0.012 + v * 0.011).toFixed(3)})`, transition: 'background .2s' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}><span style={big}>{v.toFixed(1)}</span></div>
                          <Range value={v} label={`${NAMES[j]}, row ${i + 1}`} onSet={(nv) => { if (nv !== grid[i][j]) update((g) => { g[i][j] = nv; }); }} />
                        </div>
                      ))}
                      {context ? (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, padding: '10px 16px 7px', borderLeft: '1.5px solid #141414', background: '#f9f8f5' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                            <span style={big}>{pred}</span>
                            <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6c6963' }}>Context label</span>
                          </div>
                          <Range value={p.y} label={`Context label, row ${i + 1}`} onSet={(nv) => {
                            if (labels[i] === nv) return;
                            const next = labels.slice(); next[i] = nv; setLabels(next); setStale(!!shown);
                          }} />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, padding: '10px 16px', borderLeft: '1.5px solid #141414', background: '#ecebe6', opacity: stale && !running ? 0.45 : 1, transition: 'opacity .3s' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ ...big, fontSize: 26 }}>{pred}</span>
                            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6c6963' }}>{delta}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6c6963' }}>
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
            <div style={{ fontSize: 13.5, color: '#6c6963' }}>The first two rows are context: set their features and labels, then press Predict. The model learns from them and predicts the rows below. Up to 5 rows × 5 columns, values 1 to 10. Demo model, runs in your browser.</div>
          </div>
        </div>
      </section>

      <SiteFooter page="playground" />
    </div>
  );
}
