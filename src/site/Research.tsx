import { useEffect, useRef } from 'react';

import { SiteFooter, SiteHeader } from './Chrome';
import { usePageMeta } from './seo';

/**
 * "Research & Benchmarks", ported from the Claude Design file `Research.dc.html`: the benchmark section (the
 * design's benchmarks.js, fed from data/benchmarks.json: the valli benchmark export) and the list of papers.
 */

const pad = 'clamp(16px, 4vw, 56px)';

type Paper = {
  year: number; title: string; authors: string; venue: string; href: string;
  /** The paper's architecture / method figure, cropped from the arXiv PDF (public/papers/<id>.png). */
  fig: string; figAlt: string;
};

// From the design's Research.dc.html; titles, authors and IDs checked against the arXiv API (27 Oct 2026).
const PAPERS: Paper[] = [
  { year: 2026, title: 'Gradient-Free Topology Adaptation for Power Flow Surrogates via In-Context Whitening', authors: 'Ayushi Jolotia, Parikshit Pareek', venue: 'arXiv preprint arXiv:2607.12241, 2026', href: 'https://arxiv.org/abs/2607.12241',
    fig: '/papers/2607.12241.png', figAlt: 'Fig. 2 of arXiv:2607.12241: In-Context Whitening, training once on the base topology and gradient-free inference on a new topology' },
  { year: 2026, title: 'Structural Disentanglement in Bilinear MLPs via Architectural Inductive Bias', authors: 'Ojasva Nema, Kaustubh Sharma, Aditya Chauhan, Parikshit Pareek', venue: 'arXiv preprint arXiv:2602.05635, 2026', href: 'https://arxiv.org/abs/2602.05635',
    fig: '/papers/2602.05635.png', figAlt: 'Fig. 1 of arXiv:2602.05635: unlearning dynamics for multiplicative (Bilinear, SwiGLU, GeGLU) and pointwise (ReLU, Tanh, Sigmoid) architectures' },
  { year: 2026, title: 'Mechanistic Evidence for Spectral Structures in Prior-Data Fitted Networks', authors: 'Kaustubh Sharma, Srijan Tiwari, Ojasva Nema, Parikshit Pareek', venue: 'arXiv preprint arXiv:2601.21731, 2026', href: 'https://arxiv.org/abs/2601.21731',
    fig: '/papers/2601.21731.png', figAlt: 'Fig. 2 of arXiv:2601.21731: the Filter Bank Decoder reading a frozen PFN to recover an explicit kernel' },
  { year: 2025, title: 'Decoupled-Value Attention for Prior-Data Fitted Networks: GP Inference for Physical Equations', authors: 'Kaustubh Sharma, Simardeep Singh, Parikshit Pareek', venue: 'arXiv preprint arXiv:2509.20950, 2025', href: 'https://arxiv.org/abs/2509.20950',
    fig: '/papers/2509.20950.png', figAlt: 'Table 1 of arXiv:2509.20950: vanilla, kernel-based and decoupled-value attention compared by query, key and value' },
];

export default function Research() {
  usePageMeta('/research');
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

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
            {papers.map((p) => (
              <li key={p.href} className="vx-paper-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 220px) minmax(0, 1fr)', gap: 28, alignItems: 'center', padding: '28px 0', borderBottom: '1px solid #e0ded8' }}>
                {/* The whole figure, fitted (not cropped) so a wide architecture diagram stays readable. */}
                <a href={p.fig} target="_blank" rel="noopener" title="Open the full figure" style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '4 / 3', background: '#fff', border: '1px solid #dfddd7', overflow: 'hidden' }}>
                  <img src={p.fig} alt={p.figAlt} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 8, width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', objectFit: 'contain' }} />
                </a>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                  <a href={p.href} target="_blank" rel="noopener" className="vx-paper-title" style={{ fontSize: 20, lineHeight: 1.35, fontWeight: 600, letterSpacing: '-0.01em', textWrap: 'pretty' }}>{p.title}</a>
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
