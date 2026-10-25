import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { SiteFooter, SiteHeader } from './Chrome';

/**
 * "Research & Benchmarks", ported from the Claude Design file `Research.dc.html`: the benchmark section (the
 * design's benchmarks.js, fed from fx/benchmark-data.js) and a filterable list of papers.
 */

const mono = "'Geist Mono', ui-monospace, monospace";
const pad = 'clamp(16px, 4vw, 56px)';

type PaperType = 'Conference' | 'Journal' | 'Workshop' | 'Preprint';
type Paper = {
  year: number; type: PaperType; title: string; authors: string; venue: string;
  pdf?: string; arxiv?: string; code?: string;
  /** Placeholder copy from the design, not a real publication: labelled as such and not citable. */
  placeholder?: boolean;
};

// The design's placeholder papers, kept at the user's request until the real list replaces them. None of
// these exist; each is shown with a "Placeholder" tag and its BibTeX button is disabled.
const PAPERS: Paper[] = [
  { year: 2026, type: 'Conference', title: 'PriorFM: A Tabular Foundation Model Pretrained on Synthetic Structural Priors', authors: 'Vallix Labs Research', venue: 'International Conference on Learning Representations (ICLR), 2026', placeholder: true },
  { year: 2026, type: 'Preprint', title: 'Scale-Adaptive Inference for Tabular Foundation Models', authors: 'Vallix Labs Research', venue: 'arXiv preprint, 2026', placeholder: true },
  { year: 2026, type: 'Workshop', title: 'Grammar: Learning a Shared Language of Table Schemas', authors: 'Vallix Labs Research · P² Lab, IIT Roorkee', venue: 'NeurIPS Workshop on Table Representation Learning, 2026', placeholder: true },
  { year: 2025, type: 'Journal', title: 'PriorSignal: Foundation Models for Irregular Time and Event Data', authors: 'Vallix Labs Research · P² Lab, IIT Roorkee', venue: 'Transactions on Machine Learning Research (TMLR), 2025', placeholder: true },
  { year: 2025, type: 'Conference', title: 'Self-Building Task Models from a Handful of Labelled Rows', authors: 'Vallix Labs Research', venue: 'International Conference on Machine Learning (ICML), 2025', placeholder: true },
  { year: 2025, type: 'Preprint', title: 'A Benchmark Suite for Tabular Prediction at Industrial Scale', authors: 'Vallix Labs Research', venue: 'arXiv preprint, 2025', placeholder: true },
];
const TYPES = ['All', 'Conference', 'Journal', 'Workshop', 'Preprint'] as const;

function bib(p: Paper) {
  const key = 'vallix' + p.year + p.title.split(/\W+/)[0].toLowerCase();
  return '@article{' + key + ',\n  title={' + p.title + '},\n  author={' + p.authors + '},\n  journal={' + p.venue + '},\n  year={' + p.year + '}\n}';
}

const chip: CSSProperties = { padding: '4px 8px' };
const warn: CSSProperties = { fontFamily: mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#f6f5f2', background: '#a2553f', padding: '4px 8px' };

export default function Research() {
  const [filter, setFilter] = useState<(typeof TYPES)[number]>('All');
  const [copied, setCopied] = useState(-1);
  const benchRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const copyTimer = useRef(0);

  useEffect(() => {
    scrollTo(0, 0);
    let alive = true;
    const kills: (() => void)[] = [];
    Promise.all([import('./fx/benchmarks.js'), import('./fx/benchmark-data.js')]).then(([B, data]) => {
      if (!alive || !benchRef.current) return;
      const kill = B.mountBenchmarks(benchRef.current, data.benchmarkData);
      if (kill) kills.push(kill);
    }).catch((e) => console.error(e));
    import('./fx/cursor-trail.js').then((m) => { if (alive) kills.push(m.cursorTrail()); }).catch(() => {});
    import('./fx/vine-art.js').then((V) => { if (alive && footerRef.current) kills.push(V.footerVines(footerRef.current)); }).catch((e) => console.error(e));
    return () => { alive = false; kills.forEach((k) => k()); clearTimeout(copyTimer.current); };
  }, []);

  const total = PAPERS.length;
  const list = PAPERS.map((p, i) => ({ ...p, i })).filter((p) => filter === 'All' || p.type === filter);
  const years = [...new Set(list.map((p) => p.year))].sort((a, b) => b - a);
  const anyPlaceholder = PAPERS.some((p) => p.placeholder);

  const copy = (p: Paper & { i: number }) => {
    if (p.placeholder) return;
    navigator.clipboard?.writeText(bib(p)).catch(() => {});
    setCopied(p.i); clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(-1), 1600);
  };

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: '#f6f5f2', minHeight: '100vh' }}>
      <SiteHeader page="research" />

      <section style={{ padding: `148px ${pad} 72px`, background: 'radial-gradient(120% 70% at 50% 0%, #dedcd7 0%, #ebeae5 45%, #f6f5f2 85%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#6c6963' }}>Research &amp; Benchmarks</div>
          <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.035em' }}>Measured in the open.</h1>
          <p style={{ margin: '18px 0 0', maxWidth: '56ch', fontSize: 18, lineHeight: 1.5, color: '#3e3c38', textWrap: 'balance' }}>Valli against 40 released tabular models on real scientific and business datasets, synthetic tables and TabArena, at 25 to 1,000 labelled rows. Every number below reproduces from our repository.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#benchmarks" className="vx-btn-dark" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderRadius: 999, fontSize: 14.5, fontWeight: 500 }}>Benchmarks</a>
            <a href="#papers" className="vx-pg-ghost" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderRadius: 999, fontSize: 14.5, fontWeight: 500 }}>Publications</a>
          </div>
        </div>
      </section>

      <section id="benchmarks" style={{ padding: `24px ${pad} clamp(64px, 8vw, 110px)` }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div ref={benchRef} style={{ minHeight: 400 }} />
        </div>
      </section>

      <section id="papers" style={{ padding: `0 ${pad} clamp(96px, 11vw, 150px)`, scrollMarginTop: 84 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '18px 40px', paddingBottom: 24, borderBottom: '1px solid #141414' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#6c6963' }}>02 — Publications</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(30px, 3.4vw, 46px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.03em' }}>Papers</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TYPES.map((t) => {
                const on = t === filter;
                return (
                  <button key={t} type="button" onClick={() => setFilter(t)}
                    style={{ all: 'unset', cursor: 'pointer', padding: '7px 13px', borderRadius: 999, border: `1px solid ${on ? '#141414' : '#d6d4ce'}`, background: on ? '#141414' : 'transparent', color: on ? '#f6f5f2' : '#141414', fontSize: 13.5, fontWeight: 500, transition: 'background .2s, color .2s' }}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {anyPlaceholder && (
            <div role="note" style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap', marginTop: 24, padding: '14px 18px', border: '1px solid #a2553f', background: 'rgba(162,85,63,.07)', fontSize: 15, lineHeight: 1.5 }}>
              <span style={warn}>Placeholder</span>
              <span>Entries marked placeholder are design copy, not real publications. They have not been published or accepted anywhere and cannot be cited.</span>
            </div>
          )}

          {years.map((y) => (
            <div key={y} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 120px) minmax(0, 1fr)', gap: '0 32px' }}>
              <div style={{ paddingTop: 30, fontFamily: mono, fontSize: 13, color: '#8f8b84' }}>{y}</div>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
                {list.filter((p) => p.year === y).map((p) => (
                  <li key={p.i} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 16, padding: '26px 0', borderBottom: '1px solid #e0ded8' }}>
                    <span style={{ fontFamily: mono, fontSize: 12, color: '#8f8b84', paddingTop: 4 }}>[{total - p.i}]</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                      <a href={p.pdf ?? '#papers'} className="vx-paper-title" style={{ fontSize: 19, lineHeight: 1.35, fontWeight: 600, letterSpacing: '-0.01em', textWrap: 'pretty' }}>{p.title}</a>
                      <div style={{ fontSize: 15, lineHeight: 1.5, color: '#4c4a45' }}>{p.authors}</div>
                      <div style={{ fontSize: 15, lineHeight: 1.5, color: '#6c6963', fontStyle: 'italic' }}>{p.venue}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8, fontFamily: mono, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                        {p.placeholder && <span style={{ ...warn, fontSize: 11, letterSpacing: '.08em' }}>Placeholder</span>}
                        <span style={{ ...chip, background: '#141414', color: '#f6f5f2' }}>{p.type}</span>
                        <a href={p.pdf ?? '#papers'} className="vx-paper-chip" style={chip}>PDF</a>
                        <a href={p.arxiv ?? '#papers'} className="vx-paper-chip" style={chip}>arXiv</a>
                        <a href={p.code ?? '#papers'} className="vx-paper-chip" style={chip}>Code</a>
                        <button type="button" onClick={() => copy(p)} disabled={p.placeholder}
                          title={p.placeholder ? 'Not citable: placeholder entry' : 'Copy BibTeX'}
                          style={{ all: 'unset', ...chip, cursor: p.placeholder ? 'not-allowed' : 'pointer', border: '1px solid #d6d4ce', color: '#141414', opacity: p.placeholder ? 0.4 : 1 }}>
                          {copied === p.i ? 'Copied ✓' : 'BibTeX'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter page="research" footerRef={footerRef} />
    </div>
  );
}
