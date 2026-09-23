import { useState } from 'react';

import { capLabel, glass, glassAccent, mono, primaryBtn, sans, stageEyebrow, stagePad, wb } from '../theme';
import type { Fingerprint } from '../api';

export function StageFingerprint({
  fp,
  neighbours,
  onNext,
}: {
  fp: Fingerprint | null;
  neighbours: { rank: string; name: string; d: string; w: string }[];
  onNext: () => void;
}) {
  const [block, setBlock] = useState(0);
  const blocks = fp?.blocks ?? [];
  const active = blocks[Math.min(block, Math.max(0, blocks.length - 1))];

  return (
    <div style={stagePad}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={stageEyebrow}>Stage 03</div>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.018em' }}>Fingerprint</h1>
          <p style={{ margin: 0, maxWidth: '74ch', fontSize: 15, lineHeight: 1.65, color: wb.muted }}>
            We measure the table by testing it, not describing it: cheap standard learners run at
            three support sizes and we read the pattern of their scores.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 22, fontFamily: mono, fontSize: 12, color: wb.dim }}>
          <div>{fp ? `${fp.n_coords} coords` : '—'}</div>
          <div>{fp ? `${fp.seconds.toFixed(2)} s` : '—'}</div>
          <div>3 supports</div>
        </div>
      </div>

      <div style={glass}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${wb.line}` }}>
          <span style={capLabel}>The signature</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>
            block-level summary · click a block to drill down
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
          {blocks.map((b, i) => {
            const on = block === i;
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => setBlock(i)}
                className="wb-fpblock"
                style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, padding: 18, background: on ? 'rgba(232,150,60,0.10)' : 'rgba(255,255,255,0.025)', fontFamily: sans }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: on ? wb.acc : wb.fg }}>{b.name}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{b.n}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 56 }}>
                  {b.bars.map((h, j) => (
                    <span key={j} style={{ flex: 1, height: `${h.toFixed(0)}%`, background: on ? wb.acc : 'rgba(255,255,255,0.28)' }} />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: '#8C8C8C' }}>{b.desc}</p>
              </button>
            );
          })}
          {!blocks.length && <div style={{ padding: 24, color: wb.dim, fontSize: 13 }}>running the battery…</div>}
        </div>

        {active && (
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${wb.line}`, display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: wb.acc }}>{active.name}</span>
            {/* the reading is generated from this table's own coordinates */}
            <span style={{ fontSize: 13, lineHeight: 1.6, color: wb.muted }}>{active.detail}</span>
          </div>
        )}
      </div>

      <div data-wbgrid="minmax(0,1.4fr) minmax(0,1fr)" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        <div style={glass}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${wb.line}` }}>
            <span style={capLabel}>Coordinates</span>
            <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint }}>{active?.name ?? ''} · {active?.n ?? 0} values</span>
          </div>
          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 10 }}>
            {(active?.values ?? []).map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 12, color: wb.muted, borderBottom: `1px solid ${wb.lineSoft}`, paddingBottom: 4 }}>
                <span style={{ color: wb.faint }}>{i}</span>
                <span style={{ color: wb.fg }}>{v.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={glass}>
            <div style={{ ...capLabel, padding: '14px 18px', borderBottom: `1px solid ${wb.line}` }}>
              Nearest candidate generators
            </div>
            {neighbours.length ? neighbours.map((nb) => (
              <div key={nb.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: `1px solid ${wb.lineSoft}` }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: wb.faint, width: 14 }}>{nb.rank}</span>
                <span style={{ flex: 1, fontFamily: mono, fontSize: 12, color: wb.fg, overflow: 'hidden', textOverflow: 'ellipsis' }}>{nb.name}</span>
                <div style={{ flex: '0 0 60px', height: 4, background: wb.rule, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '0 auto 0 0', width: nb.w, background: wb.acc }} />
                </div>
                <span style={{ fontFamily: mono, fontSize: 13, color: wb.acc, width: 38, textAlign: 'right' }}>{nb.d}</span>
              </div>
            )) : (
              <div style={{ padding: '16px 18px', fontSize: 13, color: wb.dim }}>
                Fit recipes in stage 04 and the nearest candidates appear here.
              </div>
            )}
          </div>

          <div style={{ ...glassAccent, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: wb.acc }}>
              How to read this
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: wb.fg }}>
              A learner's score pattern is a property of the <em>rule</em>, not of the columns. Two
              tables can have identical marginals while one is a straight line and the other a tree —
              only a learner notices, so we measure with learners.
            </p>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: wb.muted, paddingTop: 6, borderTop: '1px solid rgba(255,196,124,0.14)' }}>
              Distances are on a scale fitted across this run's candidates. The published pipeline
              freezes that scale against its generator corpus, which is not on this machine, so
              distances compare within a run and are not on the paper's absolute scale.
            </p>
          </div>

          <button type="button" onClick={onNext} style={primaryBtn}>Next · Fit the recipe</button>
        </div>
      </div>
    </div>
  );
}
