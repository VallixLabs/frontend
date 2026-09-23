import { useState } from 'react';

import { capLabel, code, glass, mono, primaryBtn, sans, stageEyebrow, stagePad, wb } from '../theme';
import { SCOPE_TIPS, scopeChrome, type Scope } from '../data';
import type { RecipeDetail, SearchResult } from '../api';

const CAND_COLS = 'minmax(0,1fr) 52px 52px 34px';

export function StageRecipe({
  search,
  recipe,
  onPickCandidate,
  onRefit,
  onNext,
}: {
  search: SearchResult | null;
  recipe: RecipeDetail | null;
  onPickCandidate: (i: number) => void;
  onRefit: () => void;
  onNext: () => void;
}) {
  const [tip, setTip] = useState<Scope | null>(null);
  const candidates = search?.candidates ?? [];
  const selected = candidates.findIndex((c) => c.name === recipe?.name);

  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={stageEyebrow}>Stage 04</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>The recipe</h1>
          <p style={{ margin: 0, maxWidth: '74ch', fontSize: 15, lineHeight: 1.65, color: wb.muted }}>
            Candidates are drawn from the generator space, compiled, screened for the label space, and
            ranked by fingerprint distance to your table.
          </p>
        </div>
        <button type="button" onClick={onRefit} className="wb-ghost-btn" style={{ all: 'unset', cursor: 'pointer', padding: '10px 16px', background: 'rgba(255,255,255,0.04)', color: wb.body, fontSize: 13, fontFamily: sans }}>
          Resample candidates
        </button>
      </div>

      {search?.class_screen_failed && (
        <div style={{ ...glass, padding: '14px 18px', borderLeft: `2px solid ${wb.bad}`, display: 'flex', gap: 12 }}>
          <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad }}>class screen</span>
          <span style={{ fontSize: 13, color: wb.muted }}>
            No candidate could express this table's label space. That is recorded as a failure of the
            method on this table rather than papered over; the closest candidate is shown anyway.
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
        {(search?.funnel ?? []).map((f) => (
          <div key={f.label} style={{ background: 'rgba(255,255,255,0.028)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: mono, fontSize: 32, fontWeight: 600, color: f.accent ? wb.acc : wb.fg }}>{f.n}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.faint }}>{f.delta}</span>
            </div>
            <div style={{ fontSize: 13, color: wb.fg }}>{f.label}</div>
            <div style={{ height: 4, background: wb.rule, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '0 auto 0 0', width: f.w, background: f.accent ? wb.acc : wb.fg }} />
            </div>
          </div>
        ))}
      </div>

      <div data-wbgrid="minmax(0,0.85fr) minmax(0,1.5fr)" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,0.85fr) minmax(0,1.5fr)', gap: 22, alignItems: 'start' }}>
        <div style={{ ...glass, minWidth: 290 }}>
          <div style={{ ...capLabel, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>Ranked candidates</div>
          <div style={{ display: 'grid', gridTemplateColumns: CAND_COLS, gap: 6, padding: '10px 14px', borderBottom: `1px solid ${wb.line}`, fontFamily: mono, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: wb.faint }}>
            <span>candidate</span>
            <span style={{ textAlign: 'right' }}>dist</span>
            <span style={{ textAlign: 'right' }}>compile</span>
            <span style={{ textAlign: 'right' }}>cls</span>
          </div>
          {candidates.map((c, i) => {
            const on = i === selected;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onPickCandidate(i)}
                className="wb-cand"
                style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'grid', gridTemplateColumns: CAND_COLS, gap: 6, width: '100%', padding: '12px 14px', borderBottom: `1px solid ${wb.lineSoft}`, background: on ? wb.surfaceHi : wb.surface, borderLeft: `2px solid ${on ? wb.acc : 'transparent'}`, fontFamily: mono, fontSize: 12, color: wb.muted }}
              >
                <span style={{ color: on ? wb.acc : wb.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <span style={{ textAlign: 'right', color: on ? wb.acc : wb.fg }}>{c.dist}</span>
                <span style={{ textAlign: 'right' }}>{c.compile}</span>
                <span style={{ textAlign: 'right' }}>{c.cls}</span>
              </button>
            );
          })}
          {!candidates.length && <div style={{ padding: 20, fontSize: 13, color: wb.dim }}>searching…</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={glass}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>
              <span style={capLabel}>Recipe inspector</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.acc }}>{recipe?.name ?? '—'}</span>
            </div>

            {recipe && (
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${wb.line}`, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.22)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: wb.bad }}>Reject(</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: wb.muted }}>
                  predicate={recipe.reject.predicate}, retries={recipe.reject.retries}
                </span>
                <span style={{ fontFamily: mono, fontSize: 11, color: wb.bad }}>)</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontSize: 11, color: wb.faint }}>wraps all seven stages</span>
              </div>
            )}

            {(recipe?.stages ?? []).map((rs) => (
              <div key={rs.stage} style={{ borderBottom: `1px solid ${wb.lineSoft}`, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: wb.fg, width: 88 }}>{rs.stage}</span>
                  <span style={{ fontFamily: mono, fontSize: 13, color: wb.acc }}>{rs.branch}</span>
                  {!rs.blanks.length && <span style={{ fontSize: 12, color: wb.faint }}>no free blanks</span>}
                </div>

                {rs.blanks.map((bl) => {
                  const chrome = scopeChrome(bl.scope as Scope);
                  return (
                    <div key={bl.key} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0,1fr)', gap: 10, alignItems: 'start', paddingLeft: 16 }}>
                      <span style={{ fontFamily: mono, fontSize: 12, color: wb.dim, paddingTop: 4 }}>{bl.key}</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{ fontFamily: mono, fontSize: 12.5, color: wb.fg, background: 'rgba(255,255,255,0.06)', padding: '3px 8px' }}>{bl.value}</span>
                        <span style={{ fontFamily: mono, fontSize: 12, color: wb.good, padding: '3px 8px', background: 'rgba(143,169,143,0.12)' }}>{bl.primitive}</span>
                        {/* Scope is a coordinate of the space, so it is encoded, not just named. */}
                        <button
                          type="button"
                          onMouseEnter={() => setTip(bl.scope as Scope)}
                          onMouseLeave={() => setTip(null)}
                          onFocus={() => setTip(bl.scope as Scope)}
                          onBlur={() => setTip(null)}
                          onClick={() => setTip(bl.scope as Scope)}
                          style={{ all: 'unset', cursor: 'help', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', background: chrome.bg, border: `1px solid ${chrome.border}`, fontFamily: mono, fontSize: 11.5, color: chrome.fg }}
                        >
                          <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
                            {chrome.pips.map((c, i) => (
                              <span key={i} style={{ width: 3, height: 9, background: c }} />
                            ))}
                          </span>
                          {bl.scope}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {tip && (
              <div style={{ padding: 18, background: wb.accWell, borderTop: `1px solid ${wb.acc}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: wb.acc }}>scope · {tip}</div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: wb.fg }}>{SCOPE_TIPS[tip]}</p>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.7, color: wb.muted }}>
                  The compiler honours this: a <em>run</em> blank is drawn once, a <em>task</em> blank once
                  per table, and layer / node / column / row blanks are redrawn at each of those points.
                </p>
              </div>
            )}
          </div>

          {recipe && (
            <div style={glass}>
              <div style={{ ...capLabel, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>Sampler · real vs fitted</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'your table', color: wb.dim, body: recipe.sampler.real, n: recipe.sampler.real_distinct },
                  { label: 'drawn from this recipe', color: wb.acc, body: recipe.sampler.fitted, n: recipe.sampler.fitted_distinct },
                ].map((p) => (
                  <div key={p.label} style={{ background: 'rgba(255,255,255,0.028)', padding: '16px 18px' }}>
                    <div style={{ fontFamily: mono, fontSize: 11, color: p.color, marginBottom: 10 }}>{p.label}</div>
                    <pre style={{ margin: 0, fontFamily: code, fontSize: 11.5, lineHeight: 1.8, color: wb.muted, overflowX: 'auto' }}>{p.body}</pre>
                    <div style={{ fontFamily: mono, fontSize: 11, color: wb.faint, marginTop: 10 }}>target: {p.n} distinct values</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 18px', borderTop: `1px solid ${wb.line}`, display: 'flex', gap: 12 }}>
                <span style={{ fontFamily: mono, fontSize: 13, color: wb.acc }}>≠</span>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: wb.muted }}>
                  These are <strong style={{ color: wb.fg, fontWeight: 600 }}>not faithful reconstructions</strong>, and
                  are not meant to be — your target takes {recipe.sampler.real_distinct} distinct values and the
                  recipe's {recipe.sampler.fitted_distinct}. Transfer does not require structural match, which is a
                  finding rather than a defect being hidden.
                </p>
              </div>
            </div>
          )}

          <button type="button" onClick={onNext} style={{ ...primaryBtn, fontFamily: sans }}>Next · Train</button>
        </div>
      </div>
    </div>
  );
}
