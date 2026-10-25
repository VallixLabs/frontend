import { createRef, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Arrow, SiteFooter, SiteHeader } from './Chrome';
import { LogoGridPaths } from './Logo';

/**
 * The landing page, ported from the Claude Design file `Website.dc.html`. Layout and copy follow the design
 * one to one; the canvas/SVG effects live in ./fx as the design's own modules and are mounted imperatively
 * after the first render, the way the design does it.
 */

const mono = "'Geist Mono', ui-monospace, monospace";
const pad = 'clamp(16px, 4vw, 56px)';
const stopPad = '64px clamp(16px, 5vw, 80px) calc(clamp(20px, 4vh, 40px) + 46px)';

const INDUSTRIES = [
  { name: 'Finance', ex: ['Credit risk scoring from transaction histories.', 'Fraud detection across card and wire payments.', 'Cash-flow forecasting for treasury teams.', 'Churn prediction for retail banking customers.'] },
  { name: 'Healthcare', ex: ['Readmission risk from electronic health records.', 'Missing-value imputation in clinical trial data.', 'Patient no-show prediction for scheduling.', 'Claims anomaly detection for payers.'] },
  { name: 'Industry', ex: ['Predictive maintenance from machine inspection data.', 'Steel-grade classification for pipeline compliance.', 'Automated defect detection in quality control.', 'Yield optimisation from process sensor logs.'] },
  { name: 'Energy', ex: ['Load forecasting for grid operators.', 'Fault prediction on turbines and transformers.', 'Solar and wind output forecasting from weather tables.', 'Meter anomaly detection to catch energy theft.'] },
  { name: 'Tech', ex: ['Product usage forecasting for capacity planning.', 'Lead scoring straight from CRM tables.', 'Incident prediction from infrastructure metrics.', 'Pricing and conversion modelling for experiments.'] },
];
const DUR = 6500; // ms each industry stays selected

const CALENDAR_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vallix%20Labs%20%C3%97%20Founders&details=Intro%20call%20with%20the%20Vallix%20Labs%20founders&add=contact%40vallixlabs.com';
const MAIL_URL = 'mailto:contact@vallixlabs.com?subject=Vallix%20Labs%20%E2%80%94%20getting%20started';

const eyebrow: CSSProperties = { display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7d7a73' };
const boxStyle: CSSProperties = {
  width: 'min(430px, 100%)', maxHeight: '100%', overflow: 'auto', boxSizing: 'border-box', background: 'rgba(246,245,242,.9)',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1.5px solid #141414', padding: '28px 28px 26px', pointerEvents: 'auto',
};
const stopStyle: CSSProperties = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: stopPad, pointerEvents: 'none', opacity: 0 };
const h3Style: CSSProperties = { margin: '20px 0 0', fontSize: 46, lineHeight: 1, fontWeight: 500, letterSpacing: '-0.035em' };
const bodyP: CSSProperties = { fontSize: 14.5, lineHeight: 1.55, textWrap: 'pretty', margin: '14px 0 0', color: '#3e3c38' };

function RailStep({ k, label }: { k: number; label: string }) {
  return (
    <div data-rail={k} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 78, color: '#8f8b84', transition: 'color .35s' }}>
      <span data-dot="" style={{ position: 'relative', zIndex: 1, width: 11, height: 11, borderRadius: '50%', border: '1.5px solid currentColor', background: '#f6f5f2', boxSizing: 'border-box', transition: 'background .35s, border-color .35s, transform .35s' }} />
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const navLogoRef = useRef<HTMLAnchorElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);
  const accessGridRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderLogoRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGGElement>(null);
  const vPathRef = useRef<SVGPathElement>(null);
  const vCanvasRef = useRef<HTMLCanvasElement>(null);
  const textImgRef = useRef<HTMLImageElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  // ---- "For business": industries cycle on a timer, paused on hover and off screen ----
  const [ind, setInd] = useState(0);
  const [prog, setProg] = useState(0);
  const cycle = useRef({ ind: 0, prog: 0, paused: false, visible: false });
  const [exRefs] = useState(() => [0, 1, 2, 3].map(() => createRef<HTMLDivElement>()));

  const select = (i: number) => {
    cycle.current.ind = i; cycle.current.prog = 0;
    setInd(i); setProg(0);
  };

  useEffect(() => {
    let raf = 0, lastT = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(100, now - (lastT || now)); lastT = now;
      const c = cycle.current;
      if (c.paused || !c.visible) return;
      const p = c.prog + dt / DUR;
      if (p >= 1) select((c.ind + 1) % INDUSTRIES.length);
      else { c.prog = p; setProg(p); }
    };
    raf = requestAnimationFrame(tick);
    let io: IntersectionObserver | undefined;
    if (businessRef.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => { cycle.current.visible = e.isIntersecting; }, { threshold: 0.25 });
      io.observe(businessRef.current);
    } else cycle.current.visible = true;
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, []);

  useEffect(() => {
    exRefs.forEach((r, k) => r.current?.animate(
      [{ opacity: 0, transform: 'translateY(10px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
      { duration: 650, delay: k * 90, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }));
  }, [ind, exRefs]);

  // ---- loader, hero figure, tree, access grid, cursor trail, footer vines ----
  useEffect(() => {
    let alive = true;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };
    const kills: (() => void)[] = [];
    let loaderRaf = 0, vRaf = 0, exited = false, playHeroWhenReady = false;
    let hero: { play(): void; destroy(): void } | null = null;
    let tree: { destroy(): void } | null = null;
    const tasks: Record<string, boolean> = { fonts: false, load: false, hero: false, tree: false };
    const done = (k: string) => { tasks[k] = true; };

    const heroText = heroTextRef.current;
    const heroKids = heroText ? [...heroText.children] as HTMLElement[] : [];
    heroKids.forEach((el) => { el.style.opacity = '0'; });

    const startPage = () => {
      heroKids.forEach((el, i) => el.animate(
        [{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 900, delay: 120 + i * 110, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }));
      if (hero) hero.play(); else playHeroWhenReady = true;
    };

    const exitLoader = () => {
      if (exited || !alive) return; exited = true;
      const box = loaderLogoRef.current!, nav = navLogoRef.current!, ov = loaderRef.current!;
      const A = box.getBoundingClientRect(), B = (nav.firstElementChild as HTMLElement).getBoundingClientRect();
      const sc = B.width / A.width, dx = B.left - A.left, dy = B.top - A.top;
      const EZ = 'cubic-bezier(.75,0,.2,1)', D = 1100;
      progRef.current?.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px)' }], { duration: 400, easing: 'ease-in', fill: 'forwards' });
      box.animate([{ transform: 'none' }, { transform: `translate(${dx}px,${dy}px) scale(${sc})` }], { duration: D, delay: 150, easing: EZ, fill: 'forwards' });
      ov.animate([{ backgroundColor: 'rgba(246,245,242,1)' }, { backgroundColor: 'rgba(246,245,242,0)' }], { duration: 800, delay: 550, easing: 'ease-in-out', fill: 'forwards' });
      later(startPage, 700);
      later(() => {
        nav.style.opacity = '1'; ov.style.display = 'none'; document.documentElement.style.overflow = '';
        // Arrived via a link to a section (e.g. /#access from another page): go there now that scrolling is back.
        const target = location.hash && document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView({ behavior: 'instant' });
      }, D + 170);
    };

    // runLoader
    {
      const EZ = 'cubic-bezier(.6,0,.25,1)';
      if (navLogoRef.current) navLogoRef.current.style.opacity = '0';
      document.documentElement.style.overflow = 'hidden';
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      scrollTo(0, 0);
      const grid = gridRef.current ? [...gridRef.current.children] as SVGPathElement[] : [];
      grid.forEach((p, i) => {
        const L = p.getTotalLength(); p.style.strokeDasharray = String(L); p.style.strokeDashoffset = String(L);
        p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 800, delay: i * 80, easing: EZ, fill: 'forwards' });
      });
      const vp = vPathRef.current, cv = vCanvasRef.current;
      if (vp && cv) {
        const L = vp.getTotalLength(), P = new Path2D(vp.getAttribute('d')!), img = new Image();
        const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
        cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
        const g = cv.getContext('2d')!, k = cv.width / 1830;
        const ez = (x: number) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        const paint = (p: number) => {
          g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, cv.width, cv.height);
          if (p <= 0) return;
          g.setTransform(k, 0, 0, k, 0, 0);
          g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 128; g.strokeStyle = '#fff';
          g.setLineDash([L * p + 0.01, L + 200]); g.stroke(P);
          g.setLineDash([]); g.globalCompositeOperation = 'source-in'; g.drawImage(img, 0, 0, 1830, 705);
        };
        img.onload = () => {
          const s0 = performance.now() + 420;
          const f = (now: number) => { const p = Math.max(0, Math.min(1, (now - s0) / 1250)); paint(ez(p)); if (p < 1 && alive) vRaf = requestAnimationFrame(f); };
          vRaf = requestAnimationFrame(f);
        };
        img.src = '/logo-v.png';
      }
      textImgRef.current?.animate(
        [{ clipPath: 'inset(0 75% 0 0)', opacity: 0, transform: 'translateY(8px)' }, { clipPath: 'inset(0 0% 0 0)', opacity: 1, transform: 'none' }],
        { duration: 850, delay: 1350, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
      const t0 = performance.now(), MIN = 2300;
      let shown = 0;
      const step = (now: number) => {
        const real = Object.values(tasks).filter(Boolean).length / Object.keys(tasks).length;
        const target = Math.min(real, Math.min(1, (now - t0) / MIN));
        shown += (target - shown) * 0.12; if (target - shown < 0.002) shown = target;
        if (barRef.current) barRef.current.style.transform = 'scaleX(' + shown.toFixed(4) + ')';
        if (pctRef.current) pctRef.current.textContent = String(Math.round(shown * 100)).padStart(2, '0') + '%';
        if (shown >= 0.999 && real >= 1) later(exitLoader, 250); else loaderRaf = requestAnimationFrame(step);
      };
      loaderRaf = requestAnimationFrame(step);
      later(() => { Object.keys(tasks).forEach(done); }, 9000); // safety
    }

    if (document.fonts) document.fonts.ready.then(() => done('fonts')); else done('fonts');
    const onLoad = () => done('load');
    if (document.readyState === 'complete') done('load'); else addEventListener('load', onLoad, { once: true });

    import('./fx/access-grid.js').then((m) => {
      if (alive && accessGridRef.current) kills.push(m.accessGrid(accessGridRef.current, { eventTarget: accessRef.current ?? undefined }));
    }).catch((e) => console.error(e));
    import('./fx/cursor-trail.js').then((m) => { if (alive) kills.push(m.cursorTrail()); }).catch((e) => console.error(e));
    import('./fx/vine-art.js').then((V) => { if (alive && footerRef.current) kills.push(V.footerVines(footerRef.current)); }).catch((e) => console.error(e));
    import('./fx/bench-fig1.js').then((m) => {
      if (alive && heroRef.current) { hero = m.drawFig1(heroRef.current, { autoplay: false }); if (playHeroWhenReady) hero.play(); }
      done('hero');
    }).catch((e) => { console.error(e); done('hero'); });
    import('./fx/tree-scene.js').then((m) => {
      if (alive && treeRef.current && canvasRef.current && overlayRef.current && !tree) {
        tree = m.mountTree({ section: treeRef.current, canvas: canvasRef.current, overlay: overlayRef.current });
      }
      requestAnimationFrame(() => done('tree'));
    }).catch((e) => { console.error(e); done('tree'); });

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(loaderRaf); cancelAnimationFrame(vRaf);
      removeEventListener('load', onLoad);
      kills.forEach((k) => k());
      hero?.destroy(); tree?.destroy();
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: '#f6f5f2', minHeight: '100vh' }}>

      <SiteHeader page="home" logoRef={navLogoRef} />

      <section id="top" style={{ position: 'relative', height: '100svh', minHeight: 560, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: `84px ${pad} 20px`, background: 'radial-gradient(130% 62% at 50% 0%, #d9d8d3 0%, #e8e7e2 40%, #f6f5f2 78%)', textAlign: 'center' }}>
        <div ref={heroTextRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(30px, 4.4vw, 60px)', lineHeight: 1.08, fontWeight: 500, letterSpacing: '-0.035em' }}>Models. For your problem.<br />From your data. At our speed.</h1>
          <p style={{ margin: '14px 0 0', fontSize: 18, lineHeight: 1.5, color: '#3e3c38' }}>A lab for task-specific, scale-adaptive, fast-inference<br />Tabular foundation models that build themselves.</p>
          <p style={{ margin: '8px 0 0', fontSize: 16, lineHeight: 1.55, color: '#6c6963' }}>Get your own tabular foundation model in a few clicks, and<br />predict without limits.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <a href="#access" className="vx-btn-dark" style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 12px 10px 18px', borderRadius: 999, fontSize: 14.5, fontWeight: 500 }}>
              <span>Get access</span>
              <Arrow />
            </a>
          </div>
        </div>
        <div ref={heroRef} style={{ position: 'relative', flex: '1 1 0', minHeight: 200, width: '100%', maxWidth: 1300, margin: '18px auto 0' }} />
      </section>

      <section id="ecosystem" ref={treeRef} style={{ position: 'relative', height: '640vh', background: '#f6f5f2', marginTop: 120 }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', borderTop: '1px solid #e3e1dc' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
          <div ref={overlayRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

          <div data-stop="0" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 clamp(16px, 5vw, 80px)', pointerEvents: 'none' }}>
            <h2 style={{ margin: 0, maxWidth: '11ch', fontSize: 'clamp(34px, 4vw, 58px)', lineHeight: 1.04, fontWeight: 500, letterSpacing: '-0.035em', textWrap: 'balance' }}>Our roots grow down to meet your data.</h2>
          </div>
          <div data-stop="0" style={{ position: 'absolute', bottom: 34, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, fontFamily: mono, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#6c6963', pointerEvents: 'none' }}>
            <span>Scroll</span>
            <span style={{ width: 1, height: 36, background: '#141414' }} />
          </div>

          <div data-stop="1" style={stopStyle}>
            <div data-box="1" style={boxStyle}>
              <div style={eyebrow}><span>The vines</span></div>
              <h3 style={h3Style}>Valli</h3>
              <p style={bodyP}>Valli reads your table, works out what kind of process could have produced it, generates a matching prior, and builds a model for that problem.</p>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14, borderTop: '1.5px solid #141414' }}>
                {[
                  ['Small', 'A compact model trained from scratch that beats general models 260× its size on tiny contexts.'],
                  ['Larger', 'A foundation model adapted to your data, leading the public benchmarks at that scale.'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '74px minmax(0,1fr)', gap: 12, padding: '10px 0', borderBottom: '1px solid #dfddd7' }}>
                    <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', paddingTop: 3 }}>{k}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: '#5d5a54' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600 }}>Ten to twenty minutes either way. Automatically.</div>
            </div>
          </div>

          <div data-stop="2" style={stopStyle}>
            <div data-box="2" style={boxStyle}>
              <div style={eyebrow}><span>The branches</span></div>
              <h3 style={h3Style}>Tana</h3>
              <p style={bodyP}>Every tabular foundation model conditions on your rows at prediction time. Tana also conditions on the prior, on what kind of data this is, so it starts from the right place instead of a general one.</p>
              <p style={{ ...bodyP, color: '#5d5a54', paddingTop: 14, borderTop: '1px solid #dfddd7' }}>
                <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#141414', marginRight: 8 }}>Tana 0.1</span>
                In development. It becomes the base model inside Valli, which is adapted to give you the final model.
              </p>
            </div>
          </div>

          <div data-stop="3" style={stopStyle}>
            <div data-box="3" style={{ ...boxStyle, padding: '28px 28px 10px' }}>
              <div style={eyebrow}><span>The roots</span></div>
              <h3 style={h3Style}>The roots</h3>
              <div style={{ marginTop: 10, fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>Where every task specific model begins.</div>
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18 }}>
                {[
                  ['PriorFM', 'Maps your tables to a task specific synthetic data generator.'],
                  ['Grammar', 'The language PriorFM writes those generators in.'],
                  ['PriorSignal', 'Chooses the best data generator for you, accounting for the problem you need Valli for.'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0,1fr)', gap: 14, padding: '10px 0', borderTop: '1px solid #dfddd7' }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{k}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.5, color: '#5d5a54' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-stop="4" style={stopStyle}>
            <div data-box="4" style={boxStyle}>
              <div style={eyebrow}><span>The ecosystem</span></div>
              <h3 style={h3Style}>Tvarit</h3>
              <p style={bodyP}>Tvarit serves any tabular foundation model, TabPFN, TabICL, Kumo and Valli, at up to 20× the throughput of their reference implementations.</p>
              <a href="#access" className="vx-btn-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: 18, marginTop: 22, padding: '9px 11px 9px 16px', borderRadius: 999, fontSize: 14, fontWeight: 500 }}>
                <span>Get access</span>
                <Arrow />
              </a>
            </div>
          </div>

          <div style={{ position: 'absolute', left: 'clamp(16px, 5vw, 80px)', bottom: 'clamp(20px, 4vh, 40px)', zIndex: 3, padding: '12px 14px 10px', background: 'rgba(246,245,242,.9)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', fontFamily: mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', left: 53, right: 53, top: 17, height: 1.5, background: '#d6d4ce' }} />
            <div data-rail-fill="" style={{ position: 'absolute', left: 53, top: 17, height: 1.5, width: 0, background: '#141414' }} />
            <div style={{ position: 'relative', display: 'flex' }}>
              <RailStep k={1} label="Valli" />
              <RailStep k={2} label="Tana" />
              <RailStep k={3} label="Roots" />
              <RailStep k={4} label="Tvarit" />
            </div>
          </div>
        </div>
      </section>

      <section id="business" ref={businessRef} style={{ padding: `clamp(96px, 12vw, 160px) ${pad}`, borderTop: '1px solid #e3e1dc' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(32px, 3.6vw, 50px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.03em' }}>For business</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(28px, 5vw, 88px)', marginTop: 'clamp(56px, 7vw, 88px)', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}
              onMouseEnter={() => { cycle.current.paused = true; }} onMouseLeave={() => { cycle.current.paused = false; }}>
              {INDUSTRIES.map((d, i) => {
                const on = i === ind;
                return (
                  <button key={d.name} type="button" onClick={() => select(i)} style={{ all: 'unset', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid #d6d4ce' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: 'clamp(22px, 2.2vw, 28px)', fontWeight: 500, letterSpacing: '-0.015em', color: on ? '#141414' : '#9a968f', transition: 'color .3s' }}>
                      <span>{d.name}</span>
                    </span>
                    <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 1, background: '#141414', transformOrigin: '0 50%', transform: `scaleX(${on ? prog.toFixed(4) : 0})` }} />
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div key={'ind' + ind} style={{ display: 'flex', flexDirection: 'column' }}>
                {INDUSTRIES[ind].ex.map((t, k) => (
                  <div key={k} ref={exRefs[k]} style={{ padding: '12px 0' }}>
                    <span style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: 19, lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.01em', color: '#141414', textWrap: 'pretty' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="access" style={{ padding: `0 ${pad} clamp(96px, 10vw, 140px)` }}>
        <div ref={accessRef} style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', overflow: 'hidden', border: '1px solid #dfddd7', backgroundColor: '#efeee9' }}>
          <div ref={accessGridRef} style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(42% 52% at 50% 52%, rgba(239,238,233,.97) 30%, rgba(239,238,233,.82) 62%, rgba(239,238,233,0) 100%)' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(96px, 12vw, 168px) 24px', pointerEvents: 'none' }}>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px, 4.6vw, 64px)', lineHeight: 1.02, fontWeight: 500, letterSpacing: '-0.035em', textWrap: 'balance' }}>Get your table predicted.</h2>
            <p style={{ margin: '16px 0 0', maxWidth: '60ch', fontSize: 17, lineHeight: 1.55, color: '#5d5a54', textWrap: 'balance' }}>Schedule a meet with the founders or send us an email.</p>
            <div style={{ pointerEvents: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginTop: 32, width: 'min(380px, 100%)' }}>
              <a href={CALENDAR_URL} target="_blank" rel="noopener" className="vx-btn-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 14px', whiteSpace: 'nowrap', borderRadius: 999, fontSize: 14.5, fontWeight: 500 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="3" width="12" height="11" rx="1.5" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" /></svg>
                <span>Schedule a meet</span>
              </a>
              <a href={MAIL_URL} className="vx-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 14px', whiteSpace: 'nowrap', borderRadius: 999, fontSize: 14.5, fontWeight: 500 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path d="M2 4l6 5 6-5" /></svg>
                <span>Send an email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter page="home" footerRef={footerRef} />

      <div ref={loaderRef} style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#f6f5f2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div ref={loaderLogoRef} style={{ position: 'relative', width: 'min(460px, 72vw)', aspectRatio: '1830 / 705', transformOrigin: '0 0', willChange: 'transform' }}>
          <svg viewBox="0 0 1830 705" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <g ref={gridRef} fill="none" stroke="#bdb9b2" strokeWidth={11}><LogoGridPaths /></g>
            <path ref={vPathRef} d="M14 282C170 222 352 112 480 100C402 218 318 438 288 650C470 384 760 96 1018 34" fill="none" stroke="none" />
          </svg>
          <canvas ref={vCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <img ref={textImgRef} src="/logo-text.png" alt="Vallix Labs" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', clipPath: 'inset(0 75% 0 0)', opacity: 0 }} />
        </div>
        <div ref={progRef} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 'min(460px, 72vw)', marginTop: 56 }}>
          <div style={{ position: 'relative', height: 1, background: '#dcdad4', overflow: 'hidden' }}><div ref={barRef} style={{ position: 'absolute', inset: 0, background: '#141414', transformOrigin: '0 50%', transform: 'scaleX(0)' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6c6963' }}><span>Loading</span><span ref={pctRef}>00%</span></div>
        </div>
      </div>
    </div>
  );
}
