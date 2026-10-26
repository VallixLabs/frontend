import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent } from 'react';

import { SiteFooter, SiteHeader } from './Chrome';
import type { Milestone } from './fx/timeline-vine.js';

/**
 * "Who we are", ported from the Claude Design file `WhoWeAre.dc.html`: a vine timeline that grows with the
 * scroll (a plain list below 760px), then the founders and the advisors.
 */

const mono = "'Geist Mono', ui-monospace, monospace";
const label: CSSProperties = { fontFamily: "'Source Sans 3', system-ui, sans-serif", fontWeight: 600, textTransform: 'uppercase' };
const green = '#2e5c36';
const pad = 'clamp(16px, 4vw, 56px)';

// Milestones as the design lays them out: which vine path, the node's point on it (viewBox units), and where
// the date (d) and text (t) labels sit with their anchoring (c/l/r). `href: '#'` = no link yet in the design.
const MILESTONES: Milestone[] = [
  { p: 'main', x: 205, y: 82, date: 'Sept 2024', text: 'Joined', kind: 'Lab', host: 'psquare-lab.github.io', href: 'https://psquare-lab.github.io/', img: '', d: [169, 37, 'c'], t: [128, 64, 'r'], w: 12 },
  { p: 'main', x: 340, y: 149, date: 'Dec 2024', text: 'Developed decoupled value attention for PFNs', kind: 'Paper', host: 'arxiv.org', href: '#', img: '', d: [340, 126, 'c'], t: [340, 162, 'c'], w: 12 },
  { p: 'main', x: 510, y: 170, date: 'Mar 2025', text: 'Scaled PFNs for power flow', kind: 'Paper', host: 'arxiv.org', href: '#', img: '', d: [512, 147, 'c'], t: [512, 184, 'c'], w: 10 },
  { p: 'main', x: 572, y: 283, date: 'Oct 2025', text: 'Mechanistic interpretability of PFNs', kind: 'Paper', host: 'arxiv.org', href: '#', img: '', d: [592, 306, 'l'], t: [592, 324, 'l'], w: 10 },
  { p: 'main', x: 385, y: 297, date: 'Jan 2026', text: 'Tabular foundation model for scientific research', kind: 'Paper', host: 'arxiv.org', href: '#', img: '', d: [394, 276, 'l'], t: [398, 314, 'l'], w: 9 },
  { p: 'tvarit', x: 470, y: 431, date: 'Mar 2026', text: 'Started work on Tvarit, with GEMM optimization in PTX', kind: 'Blog', host: 'vallixlabs.com/blog', href: '#', img: '', d: [446, 444, 'l'], t: [446, 462, 'l'], w: 15 },
  { p: 'main', x: 200, y: 350, date: 'Mar 2026', text: 'Identified low-data issues for scientific data', kind: 'Blog', host: 'vallixlabs.com/blog', href: '#', img: '', d: [184, 326, 'r'], t: [216, 354, 'l'], w: 9 },
  { p: 'left', x: 122, y: 422, date: 'Apr 2026', text: 'Slow inference issues at scale', kind: 'Blog', host: 'vallixlabs.com/blog', href: '#', img: '', d: [112, 392, 'r'], t: [108, 412, 'r'], w: 7 },
  { p: 'left', x: 40, y: 526, date: 'Jun 2026', text: 'Developed Tvarit TabICL', kind: 'Release', host: 'github.com/vallixlabs', href: '#', img: '', d: [30, 542, 'l'], t: [30, 560, 'l'], w: 10 },
  { p: 'main', x: 265, y: 468, date: 'Jul 2026', text: 'Developed PriorFM', kind: 'Paper', host: 'arxiv.org', href: '#', img: '', d: [252, 484, 'r'], t: [252, 502, 'r'], w: 10 },
  { p: 'main', x: 405, y: 515, date: 'Sept 2026', text: 'Developed Valli', kind: 'Release', host: 'vallixlabs.com/valli', href: '#', img: '', d: [405, 536, 'c'], t: [405, 554, 'c'], w: 9 },
  { p: 'main', x: 518, y: 531, date: 'Today', text: 'TabFMs condition only on rows, not on priors — originated Tana', kind: 'Blog', host: 'vallixlabs.com/blog', href: '#', img: '', d: [560, 514, 'l'], t: [508, 552, 'l'], w: 15 },
];

/** The 8×8 pixel figure on each milestone's card in the photo stack: a small motif per kind of work, seeded per card. */
function figCells(i: number): string[] {
  const P = '#f6f5f2', G = green, GL = '#cfdcc9', grey = (v: number) => { const k = Math.round(246 - v * 200); return `rgb(${k},${k - 1},${k - 4})`; };
  let s = 17 + i * 31; const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const type = ['table', 'attn', 'flow', 'probe', 'table', 'kernel', 'mask', 'flow', 'table', 'prior', 'mask', 'prior'][i % 12];
  const out: string[] = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    let col = P;
    if (type === 'table') col = r === 0 ? grey(0.85) : c === 7 ? (rnd() < 0.5 ? G : GL) : (rnd() < 0.12 ? grey(0.15) : P);
    else if (type === 'attn') { const v = Math.exp(-Math.abs(r - c) * 0.9) * (0.75 + rnd() * 0.25); col = r === c ? G : grey(v * 0.9); }
    else if (type === 'flow') { const node = r % 3 === 1 && c % 3 === 1; col = node ? G : ((r % 3 === 1 || c % 3 === 1) && rnd() < 0.7 ? grey(0.35) : P); }
    else if (type === 'probe') { const v = Math.max(0, Math.sin(r * 0.9 + 0.4) * Math.cos(c * 0.7 - 0.3)); col = v > 0.55 ? G : grey(v * 0.8); }
    else if (type === 'kernel') { col = (r + c) % 2 === 0 ? grey(0.12 + 0.1 * (r % 4)) : (c >= r ? grey(0.6) : P); if (r === 7 || c === 7) col = G; }
    else if (type === 'mask') { const miss = rnd() < 0.3; col = r === 0 ? grey(0.85) : miss ? (rnd() < 0.6 ? G : GL) : grey(0.08 + rnd() * 0.12); }
    else if (type === 'prior') { const v = Math.exp(-((r - 3.5) ** 2 + (c - 3.5) ** 2) / 7); col = v > 0.7 ? G : v > 0.45 ? GL : grey(v * 0.5); }
    out.push(col);
  }
  return out;
}
const FIG_CELLS = MILESTONES.map((_, i) => figCells(i));

type Person = { id: string; role: string; name: string; lines: string[]; links: [string, string][] };

const FOUNDERS: Person[] = [
  {
    id: 'founder-kaustubh', role: 'Founder & CSO', name: 'Kaustubh Sharma',
    lines: ['Undergraduate researcher at P² Lab, IIT Roorkee', 'Intern, Goldman Sachs'],
    links: [['P² Lab', 'https://psquare-lab.github.io/Team/'], ['LinkedIn', 'https://www.linkedin.com/search/results/people/?keywords=Kaustubh%20Sharma%20IIT%20Roorkee']],
  },
  {
    id: 'founder-swastic', role: 'Co-founder & CEO', name: 'Swastic Keshari',
    lines: ['Undergraduate researcher at P² Lab, IIT Roorkee', 'Intern, Elementary (YC F26)'],
    links: [['P² Lab', 'https://psquare-lab.github.io/Team/'], ['LinkedIn', 'https://www.linkedin.com/search/results/people/?keywords=Swastic%20Keshari%20IIT%20Roorkee']],
  },
];

const ADVISORS: Person[] = [
  {
    id: 'advisor-pareek', role: 'Advisor · Founder, P² Lab', name: 'Prof. Parikshit Pareek',
    lines: ['Assistant Professor, Electrical Engineering, IIT Roorkee', 'Leads P² Lab — prior-data fitted networks, Bayesian ML and power systems'],
    links: [['P² Lab', 'https://psquare-lab.github.io/'], ['Scholar', 'https://scholar.google.com/citations?user=LIWKqnYAAAAJ'], ['LinkedIn', 'https://www.linkedin.com/in/parikshit-pareek']],
  },
  {
    id: 'advisor-singla', role: 'Mentor · Founder, Singla Lab', name: 'Prof. Jitin Singla',
    lines: ['Assistant Professor, Biosciences & Bioengineering, IIT Roorkee', 'Leads Singla Lab — computational biology and AI for healthcare'],
    links: [['Singla Lab', 'https://www.jitinsingla.in/'], ['Scholar', 'https://scholar.google.com/citations?user=OBXIcNAAAAAJ']],
  },
];

// Label placement: viewBox (0 20 720 600) units to percentages of the stage.
const X0 = 0, Y0 = 20, VW = 720, VH = 600;
const dateTf = (a: string) => a === 'c' ? 'translate(-50%, -50%)' : a === 'r' ? 'translate(-100%, -50%)' : 'translate(0, -50%)';
const textTf = (a: string) => a === 'c' ? 'translateX(-50%)' : a === 'r' ? 'translateX(-100%)' : 'none';
const halo = '0 0 3px #f6f5f2, 0 0 3px #f6f5f2, 0 0 6px #f6f5f2';

/**
 * A portrait from public/team/<id>.jpg, in greyscale as the design shows it. The design leaves these as empty
 * drop slots, so until a photo is added the frame shows the person's initials.
 */
function Photo({ id, name }: { id: string; name: string }) {
  const [missing, setMissing] = useState(false);
  const initials = name.replace(/^Prof\.\s*/, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2);
  return missing ? (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 40, letterSpacing: '.08em', color: '#bdb9b2' }}>{initials}</div>
  ) : (
    <img src={`/team/${id}.jpg`} alt={name} onError={() => setMissing(true)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.05)' }} />
  );
}

function PersonCard({ p }: { p: Person }) {
  return (
    <article className="vx-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', background: '#f9f8f5', border: '1px solid #dcdad4' }}>
      <div style={{ position: 'relative', aspectRatio: '4 / 3.4', borderBottom: '1px solid #dcdad4', overflow: 'hidden', background: '#efeee9' }}>
        <Photo id={p.id} name={p.name} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, padding: '22px 24px 24px' }}>
        <div style={{ ...label, fontSize: 11, letterSpacing: '.14em', color: '#6c6963' }}>{p.role}</div>
        <h3 style={{ margin: '4px 0 0', fontSize: 26, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.02em' }}>{p.name}</h3>
        <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, lineHeight: 1.45, color: '#4c4a45' }}>
          {p.lines.map((l) => (
            <li key={l} style={{ display: 'flex', gap: 10 }}><span style={{ flex: 'none', width: 10, height: 1, marginTop: '.75em', background: '#141414' }} /><span>{l}</span></li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 18, ...label, fontSize: 11, letterSpacing: '.08em' }}>
          {p.links.map(([text, href]) => (
            <a key={text} href={href} target="_blank" rel="noopener" className="vx-chip" style={{ padding: '7px 11px' }}>{text} ↗</a>
          ))}
        </div>
      </div>
    </article>
  );
}

const sectionHead: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 28, marginBottom: 56, borderBottom: '1px solid #dcdad4' };
const h2: CSSProperties = { margin: 0, fontSize: 'clamp(30px, 3.4vw, 46px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.03em' };
const cardGrid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(48px, 6vw, 80px)', maxWidth: 920, margin: '0 auto' };

export default function WhoWeAre() {
  const [wide, setWide] = useState(() => innerWidth >= 760);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nowRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Page-wide effects: start at the top (arriving by client-side navigation), footer vines.
  useEffect(() => {
    scrollTo(0, 0);
    let alive = true;
    const kills: (() => void)[] = [];
    const onResize = () => setWide(innerWidth >= 760);
    addEventListener('resize', onResize);
    import('./fx/vine-art.js').then((V) => { if (alive && footerRef.current) kills.push(V.footerVines(footerRef.current)); }).catch((e) => console.error(e));
    return () => { alive = false; removeEventListener('resize', onResize); kills.forEach((k) => k()); };
  }, []);

  // The growing vine, (re)built whenever the wide layout mounts.
  useEffect(() => {
    if (!wide) return;
    let kill: (() => void) | undefined, alive = true;
    import('./fx/timeline-vine.js').then((m) => {
      if (!alive || !svgRef.current || !stageRef.current || !trackRef.current) return;
      kill = m.mountTimeline({
        svg: svgRef.current, stage: stageRef.current, track: trackRef.current, now: nowRef.current, hint: hintRef.current, photos: photoRef.current,
        milestones: MILESTONES, onNodeOff: (i) => setHover((h) => (h && h.i === i ? null : h)),
      });
    }).catch((e) => console.error(e));
    return () => { alive = false; kill?.(); };
  }, [wide]);

  // Link preview card: below the label, or above it when there is no room, kept inside the stage.
  const enter = (i: number) => (e: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>) => {
    const st = stageRef.current; if (!st) return;
    const sr = st.getBoundingClientRect(), r = e.currentTarget.getBoundingClientRect();
    const pw = Math.max(170, Math.min(230, sr.width * 0.22));
    let x = r.left - sr.left + r.width / 2 - pw / 2, y = r.bottom - sr.top + 12;
    if (y + pw > sr.height + 40) y = r.top - sr.top - pw - 12;
    x = Math.max(-20, Math.min(sr.width - pw + 20, x));
    setHover({ i, x: Math.round(x), y: Math.round(y) });
  };
  const leave = () => setHover(null);
  const hv = hover ? MILESTONES[hover.i] : null;

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: '#f6f5f2', minHeight: '100vh' }}>
      <SiteHeader page="who" />

      <section style={{ padding: `96px ${pad} 0`, background: 'radial-gradient(120% 80% at 50% 0%, #dedcd7 0%, #ebeae5 45%, #f6f5f2 85%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.035em' }}>A lab. <span style={{ color: green }}>Grown</span> from a lab <span style={{ color: green }}>@IIT-R.</span></h1>
        </div>
      </section>

      {wide ? (
        <section ref={trackRef} style={{ position: 'relative', height: '560vh', marginTop: -28 }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden', paddingTop: 64, boxSizing: 'border-box' }}>
            <div ref={stageRef} style={{ position: 'relative', width: 'min(94vw, calc((100vh - 110px) * 1.2))', aspectRatio: '720 / 600', containerType: 'inline-size' }}>
              <svg ref={svgRef} viewBox="0 20 720 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path data-vine="main" d="M205 82C215 105 235 118 270 130C300 140 320 146 340 149C400 158 470 160 510 170C560 182 600 200 612 232C622 262 600 278 572 283C520 292 440 292 385 297C330 302 280 306 250 318C225 328 210 338 200 350C186 368 182 395 192 418C205 445 235 458 265 468C310 482 360 505 405 515C450 525 485 528 518 531C545 533 570 534 592 535" stroke="none" />
                  <path data-vine="tvarit" d="M352 301C352 325 358 345 372 365C388 388 410 405 440 418C452 424 462 428 470 431" stroke="none" />
                  <path data-vine="left" d="M194 356C170 360 150 366 140 380C130 395 126 410 122 422C110 455 85 490 62 512C55 519 48 523 40 526" stroke="none" />
                </g>
                <g data-vinegfx="" />
                <g data-nodes="" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <img src="/plab-logo.svg" alt="P² Lab, EE IIT Roorkee" style={{ position: 'absolute', left: '18.6%', top: '5.6%', width: '9.6%', height: '8.75%', objectFit: 'contain' }} />
                {MILESTONES.map((m, i) => {
                  const placeholder = m.href === '#';
                  return (
                    <div key={i} data-label={i} style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .7s cubic-bezier(.2,.7,.2,1), filter .7s, transform .7s cubic-bezier(.2,.7,.2,1)', filter: 'blur(4px)', transform: 'translateY(6px)' }}>
                      <div style={{ position: 'absolute', left: `${((m.d[0] - X0) / VW * 100).toFixed(2)}%`, top: `${((m.d[1] - Y0) / VH * 100).toFixed(2)}%`, transform: dateTf(m.d[2]), ...label, fontSize: 'clamp(8px, 1.25cqw, 13px)', letterSpacing: '.1em', color: '#6c6963', whiteSpace: 'nowrap', textShadow: halo }}>{m.date}</div>
                      <a data-link={i} href={m.href} className="vx-tl-link"
                        {...(placeholder ? { onClick: (e: MouseEvent) => e.preventDefault() } : { target: '_blank', rel: 'noopener' })}
                        onMouseEnter={enter(i)} onMouseLeave={leave} onFocus={enter(i)} onBlur={leave}
                        style={{ position: 'absolute', left: `${((m.t[0] - X0) / VW * 100).toFixed(2)}%`, top: `${((m.t[1] - Y0) / VH * 100).toFixed(2)}%`, transform: textTf(m.t[2]), width: 'max-content', maxWidth: `${m.w}em`, textAlign: m.t[2] === 'c' ? 'center' : m.t[2] === 'r' ? 'right' : 'left', fontSize: 'clamp(9px, 1.6cqw, 17px)', lineHeight: 1.3, fontWeight: 500, color: '#141414', textWrap: 'balance', pointerEvents: 'none', textDecoration: 'underline', textDecorationThickness: 1, textUnderlineOffset: 3, textShadow: halo }}>
                        {m.text}<span style={{ fontSize: '.85em', marginLeft: '.25em' }}>↗</span>
                      </a>
                    </div>
                  );
                })}
                {hv && hover && (
                  <div style={{ position: 'absolute', left: hover.x, top: hover.y, width: 'clamp(170px, 22cqw, 230px)', aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column', background: '#f9f8f5', border: '1px solid #141414', boxShadow: '0 18px 40px -18px rgba(20,20,20,.35)', pointerEvents: 'none', zIndex: 5, animation: 'popIn .28s cubic-bezier(.2,.7,.2,1) both' }}>
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderBottom: '1px solid #dcdad4', background: '#f1f0ec' }}>
                      {hv.img ? (
                        <div style={{ position: 'absolute', inset: 0, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundImage: `url(${hv.img})` }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, padding: 12, background: '#fff', boxShadow: '0 1px 0 #e3e1dc, 0 6px 14px -10px rgba(0,0,0,.25)' }}>
                          <div style={{ ...label, fontSize: 8, letterSpacing: '.12em', color: '#8f8b84' }}>{hv.kind}</div>
                          <div style={{ fontSize: 12, lineHeight: 1.2, fontWeight: 600, color: '#141414', textWrap: 'balance' }}>{hv.text}</div>
                          <div style={{ fontSize: 8.5, color: '#6c6963' }}>Vallix Labs · P² Lab</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                            {[100, 94, 98, 72, 90, 60].map((w, k) => <span key={k} style={{ height: 3, background: '#e6e4df', width: `${w}%` }} />)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 11px', fontFamily: mono, fontSize: 10, letterSpacing: '.06em', color: '#141414' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hv.host}</span>
                      <span>↗</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ position: 'absolute', top: 88, right: pad, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, pointerEvents: 'none' }}>
              <span ref={nowRef} style={{ display: 'none', ...label, fontSize: 'clamp(20px, 2.2vw, 30px)', letterSpacing: '.04em', color: green }}>Sept 2024</span>
              {/* A stack of cards, one per milestone, dealt in as the vine reaches it. */}
              <div ref={photoRef} style={{ position: 'relative', marginTop: 8, width: 'clamp(140px, calc((100vw - min(94vw, (100vh - 110px) * 1.2)) / 2 - 56px), 300px)', aspectRatio: '1 / 1.12' }}>
                {MILESTONES.map((m, i) => (
                  <div key={i} data-photo={i} style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8%', padding: '7%', background: '#fbfaf7', border: '1px solid #d9d6cf', boxShadow: '0 1px 0 rgba(20,20,20,.04), 0 12px 24px -16px rgba(20,20,20,.35)', opacity: 0, transform: 'translate(70px, -90px) rotate(18deg) scale(1.12)', transition: 'transform .8s cubic-bezier(.2,1.25,.35,1), opacity .35s ease, filter .6s ease', zIndex: i + 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', ...label, fontSize: 'clamp(8px, .7vw, 10px)', letterSpacing: '.12em', color: '#8f8b84' }}>
                      <span>Fig. {String(i + 1).padStart(2, '0')}</span><span style={{ color: green }}>{m.date}</span>
                    </div>
                    <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', gap: 2, padding: 2, border: '1px solid #141414', background: '#141414' }}>
                      {FIG_CELLS[i].map((c, k) => <div key={k} style={{ background: c }} />)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: 0 }}>
                      <span style={{ ...label, fontSize: 'clamp(7px, .62vw, 9px)', letterSpacing: '.14em', color: '#8f8b84' }}>{m.kind || 'Note'}</span>
                      <span style={{ fontSize: 'clamp(10px, .95vw, 13px)', lineHeight: 1.25, fontWeight: 600, color: '#141414', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div ref={hintRef} style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...label, fontSize: 11, letterSpacing: '.16em', color: '#6c6963', pointerEvents: 'none', transition: 'opacity .5s' }}>
              <span>Scroll to grow</span>
              <span style={{ width: 1, height: 32, background: '#141414' }} />
            </div>
          </div>
        </section>
      ) : (
        <section style={{ padding: '24px 20px 96px' }}>
          <ol style={{ listStyle: 'none', margin: '0 auto', padding: '0 0 0 28px', maxWidth: 560, position: 'relative', borderLeft: '3px solid #141414' }}>
            {MILESTONES.map((m, i) => (
              <li key={i} style={{ position: 'relative', padding: '0 0 34px 18px' }}>
                <span style={{ position: 'absolute', left: -38, top: 4, width: 14, height: 14, borderRadius: '50%', background: '#f6f5f2', border: '2px solid #141414', boxSizing: 'border-box' }} />
                <div style={{ ...label, fontSize: 11, letterSpacing: '.12em', color: '#6c6963' }}>{m.date}</div>
                <div style={{ marginTop: 6, fontSize: 18, lineHeight: 1.35, fontWeight: 500 }}>{m.text}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section style={{ padding: 'clamp(80px, 9vw, 130px) clamp(24px, 5vw, 64px) clamp(96px, 10vw, 150px)', borderTop: '1px solid #e3e1dc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={sectionHead}><h2 style={h2}>The people <span style={{ color: green }}>growing</span> it</h2></div>
          <div style={cardGrid}>{FOUNDERS.map((p) => <PersonCard key={p.id} p={p} />)}</div>
          <div style={{ height: 'clamp(96px, 10vw, 140px)' }} />
          <div style={sectionHead}><h2 style={h2}>Advisors and Mentors</h2></div>
          <div style={cardGrid}>{ADVISORS.map((p) => <PersonCard key={p.id} p={p} />)}</div>
        </div>
      </section>

      <SiteFooter page="who" footerRef={footerRef} />
    </div>
  );
}
