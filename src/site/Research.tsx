import { useEffect, useRef, type CSSProperties } from 'react';

import { SiteFooter, SiteHeader } from './Chrome';

/**
 * "Research & Benchmarks", ported from the Claude Design file `Research.dc.html`: the benchmark section (the
 * design's benchmarks.js, fed from data/benchmarks.json: the valli benchmark export) and the list of papers.
 */

const pad = 'clamp(16px, 4vw, 56px)';

type PaperType = 'Conference' | 'Journal' | 'Workshop' | 'Preprint';
type Paper = {
  year: number; type: PaperType; title: string; authors: string; venue: string;
  pdf?: string;
  /** Figure shown beside the entry (the design's image slot); an empty panel until one is supplied. */
  img?: string;
  /** Placeholder copy from the design, not a real publication: labelled as such and not citable. */
  placeholder?: boolean;
};

// The design's placeholder papers, kept at the user's request until the real list replaces them. None of
// these exist; each is shown with a "Placeholder" tag.
const PAPERS: Paper[] = [
  { year: 2026, type: 'Conference', title: 'PriorFM: A Tabular Foundation Model Pretrained on Synthetic Structural Priors', authors: 'Vallix Labs Research', venue: 'International Conference on Learning Representations (ICLR), 2026', placeholder: true },
  { year: 2026, type: 'Preprint', title: 'Scale-Adaptive Inference for Tabular Foundation Models', authors: 'Vallix Labs Research', venue: 'arXiv preprint, 2026', placeholder: true },
  { year: 2026, type: 'Workshop', title: 'Grammar: Learning a Shared Language of Table Schemas', authors: 'Vallix Labs Research · P² Lab, IIT Roorkee', venue: 'NeurIPS Workshop on Table Representation Learning, 2026', placeholder: true },
  { year: 2025, type: 'Journal', title: 'PriorSignal: Foundation Models for Irregular Time and Event Data', authors: 'Vallix Labs Research · P² Lab, IIT Roorkee', venue: 'Transactions on Machine Learning Research (TMLR), 2025', placeholder: true },
  { year: 2025, type: 'Conference', title: 'Self-Building Task Models from a Handful of Labelled Rows', authors: 'Vallix Labs Research', venue: 'International Conference on Machine Learning (ICML), 2025', placeholder: true },
  { year: 2025, type: 'Preprint', title: 'A Benchmark Suite for Tabular Prediction at Industrial Scale', authors: 'Vallix Labs Research', venue: 'arXiv preprint, 2025', placeholder: true },
];
const warn: CSSProperties = { fontFamily: "'Source Sans 3', system-ui, sans-serif", fontWeight: 600, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#f6f5f2', background: '#a2553f', padding: '4px 8px' };

export default function Research() {
  const benchRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    scrollTo(0, 0);
    let alive = true;
    const kills: (() => void)[] = [];
    Promise.all([import('./fx/benchmarks.js'), import('./data/benchmarks.json')]).then(([B, data]) => {
      if (!alive || !benchRef.current) return;
      const kill = B.mountBenchmarks(benchRef.current, data.default);
      if (kill) kills.push(kill);
    }).catch((e) => console.error(e));
    import('./fx/vine-art.js').then((V) => { if (alive && footerRef.current) kills.push(V.footerVines(footerRef.current)); }).catch((e) => console.error(e));
    return () => { alive = false; kills.forEach((k) => k()); };
  }, []);

  const papers = [...PAPERS].sort((a, b) => b.year - a.year);
  const anyPlaceholder = PAPERS.some((p) => p.placeholder);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: '#f6f5f2', minHeight: '100vh' }}>
      <SiteHeader page="research" />

      <section style={{ padding: `84px ${pad} 28px`, background: 'radial-gradient(120% 70% at 50% 0%, #dedcd7 0%, #ebeae5 45%, #f6f5f2 85%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.035em' }}>Measured in <span style={{ color: '#2e5c36' }}>the open.</span></h1>
          <p style={{ margin: '14px 0 0', maxWidth: '56ch', fontSize: 18, lineHeight: 1.5, color: '#3e3c38', textWrap: 'balance' }}>This is where we stand</p>
        </div>
      </section>

      <section id="benchmarks" style={{ padding: `8px ${pad} clamp(64px, 8vw, 110px)` }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div ref={benchRef} style={{ minHeight: 400 }} />
        </div>
      </section>

      <section id="papers" style={{ padding: `0 ${pad} clamp(96px, 11vw, 150px)`, scrollMarginTop: 84 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ paddingBottom: 24, borderBottom: '1px solid #141414' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(30px, 3.4vw, 46px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.03em' }}>Papers</h2>
          </div>

          {anyPlaceholder && (
            <div role="note" style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap', marginTop: 24, padding: '14px 18px', border: '1px solid #a2553f', background: 'rgba(162,85,63,.07)', fontSize: 15, lineHeight: 1.5 }}>
              <span style={warn}>Placeholder</span>
              <span>Entries marked placeholder are design copy, not real publications. They have not been published or accepted anywhere and cannot be cited.</span>
            </div>
          )}

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {papers.map((p) => (
              <li key={p.title} className="vx-paper-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)', gap: 28, alignItems: 'center', padding: '28px 0', borderBottom: '1px solid #e0ded8' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', background: '#efeee9', border: '1px solid #dfddd7', overflow: 'hidden' }}>
                  {p.img && <img src={p.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  {p.placeholder && <span style={{ ...warn, alignSelf: 'flex-start', marginBottom: 4 }}>Placeholder</span>}
                  <a href={p.pdf ?? '#papers'} className="vx-paper-title" style={{ fontSize: 20, lineHeight: 1.35, fontWeight: 600, letterSpacing: '-0.01em', textWrap: 'pretty' }}>{p.title}</a>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: '#4c4a45' }}>{p.authors}</div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: '#6c6963', fontStyle: 'italic' }}>{p.venue}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteFooter page="research" footerRef={footerRef} />
    </div>
  );
}
