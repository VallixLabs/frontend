// Interactive table background: hovering fills cells with values; the target column fills with predictions.
export function accessGrid(host, opt = {}) {
  const INK = '20,20,20', MUTE = '111,107,100', LINE = 'rgba(20,20,20,0.10)', HEAD = 'rgba(20,20,20,0.16)';
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  host.appendChild(cv);
  const g = cv.getContext('2d');
  let s = 7; const rand = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const COLS = [
    { h: 'customer_id', f: () => 'C-' + (10000 + Math.floor(rand() * 89999)) },
    { h: 'region', f: () => ['EU', 'APAC', 'NA', 'LATAM', 'MEA'][Math.floor(rand() * 5)] },
    { h: 'tenure_mo', f: () => String(1 + Math.floor(rand() * 96)) },
    { h: 'spend_usd', f: () => (rand() * 9000 + 40).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') },
    { h: 'visits_30d', f: () => String(Math.floor(rand() * 42)) },
    { h: 'plan', f: () => ['basic', 'pro', 'team', 'ent'][Math.floor(rand() * 4)] },
    { h: 'support_tix', f: () => String(Math.floor(rand() * 9)) },
    { h: 'nps', f: () => String(Math.floor(rand() * 11)) },
    { h: 'churn_p', pred: true, f: () => rand() },
    { h: 'ltv_usd', pred: true, f: () => rand() },
  ];
  const CW = opt.cellW || 118, CH = opt.cellH || 36;
  let W = 0, H = 0, dpr = 1, nc = 0, nr = 0, off = 0, cells = [], mouse = null, raf = 0, last = 0, visible = true;
  function layout() {
    const r = host.getBoundingClientRect(); W = r.width; H = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    nc = Math.ceil(W / CW) + 1; nr = Math.ceil(H / CH) + 1;
    off = (W - nc * CW) / 2;
    s = 7; cells = [];
    const feats = COLS.filter(c => !c.pred), preds = COLS.filter(c => c.pred);
    const visC = Math.floor(W / CW), pA = Math.max(1, Math.round(visC * 0.22)), pB = Math.max(pA + 2, visC - 2);
    const colAt = c => c === pA ? preds[0] : c === pB ? preds[1] : feats[(c - (c > pA) - (c > pB) + feats.length) % feats.length];
    for (let r2 = 0; r2 < nr; r2++) for (let c = 0; c < nc; c++) {
      const col = colAt(c);
      let v = col.f(), txt;
      if (col.pred) { const p = v; txt = col.h === 'churn_p' ? p.toFixed(2) : '$' + Math.round(p * 18000 + 400).toLocaleString('en-US'); v = p; }
      else txt = v;
      cells.push({ r: r2, c, col, txt, p: col.pred ? v : 0, a: 0, t: 0 });
    }
    kick();
  }
  const ink = (a, rgb = INK) => `rgba(${rgb},${a.toFixed(3)})`;
  function draw(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    // grid
    g.lineWidth = 1; g.strokeStyle = LINE; g.beginPath();
    for (let c = 0; c <= nc; c++) { const x = Math.round(off + c * CW) + 0.5; g.moveTo(x, 0); g.lineTo(x, H); }
    for (let r = 0; r <= nr; r++) { const y = Math.round(r * CH) + 0.5; g.moveTo(0, y); g.lineTo(W, y); }
    g.stroke();
    g.fillStyle = 'rgba(20,20,20,0.035)'; g.fillRect(0, 0, W, CH);
    g.strokeStyle = HEAD; g.beginPath(); g.moveTo(0, CH + 0.5); g.lineTo(W, CH + 0.5); g.stroke();
    g.textBaseline = 'middle';
    let active = false;
    for (const k of cells) {
      const x = off + k.c * CW, y = k.r * CH;
      if (k.r === 0) {
        g.font = "500 10px 'Geist Mono', ui-monospace, monospace";
        g.fillStyle = ink(k.col.pred ? 0.75 : 0.42, k.col.pred ? INK : MUTE);
        const label = (k.col.pred ? '◆ ' : '') + k.col.h.toUpperCase();
        g.fillText(label, x + 12, y + CH / 2);
        continue;
      }
      let target = 0;
      if (mouse) { const dx = (x + CW / 2 - mouse.x) / 1.6, dy = y + CH / 2 - mouse.y; const d = Math.hypot(dx, dy); target = d < 150 ? 1 : 0; }
      if (target > k.a) { k.a = Math.min(1, k.a + dt * 5); if (k.a >= 1 && !k.t) k.t = now; }
      else if (k.a > 0) { k.a = Math.max(0, k.a - dt * 0.7); if (k.a === 0) k.t = 0; }
      if (k.a > 0.001) active = true; else continue;
      const a = k.a;
      if (k.col.pred) {
        // predicted cell: reveal with a quick "computing" scramble, then a confidence bar
        const age = k.t ? (now - k.t) / 1000 : 0;
        g.fillStyle = ink(0.06 * a); g.fillRect(x + 1, y + 1, CW - 1, CH - 1);
        g.font = "500 12px 'Geist Mono', ui-monospace, monospace";
        const settled = age > 0.35;
        const txt = settled ? k.txt : (k.col.h === 'churn_p' ? Math.random().toFixed(2) : '$' + Math.round(Math.random() * 18000).toLocaleString('en-US'));
        g.fillStyle = ink(a * (settled ? 1 : 0.55)); g.fillText(txt, x + 12, y + CH / 2);
        const bw = (CW - 24) * (k.col.h === 'churn_p' ? k.p : 0.25 + k.p * 0.75) * Math.min(1, age / 0.6);
        g.fillStyle = ink(0.75 * a); g.fillRect(x + 12, y + CH - 8, bw, 2);
        if (!settled) active = true;
        if (age < 0.6) active = true;
      } else {
        g.font = "400 12px 'Geist Mono', ui-monospace, monospace";
        g.fillStyle = ink(0.62 * a, MUTE); g.fillText(k.txt, x + 12, y + CH / 2);
      }
    }
    if (mouse) { // crosshair highlight of hovered row
      const r = Math.floor(mouse.y / CH); if (r > 0) { g.fillStyle = 'rgba(20,20,20,0.03)'; g.fillRect(0, r * CH, W, CH); }
    }
    if ((active || mouse) && visible) kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(draw); }
  const move = e => { const r = cv.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; kick(); };
  const leave = () => { mouse = null; kick(); };
  const tgt = opt.eventTarget || host;
  tgt.addEventListener('pointermove', move); tgt.addEventListener('pointerleave', leave);
  const ro = new ResizeObserver(layout); ro.observe(host);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }); io.observe(host);
  // gentle idle sweep so the idea reads even without hover (touch devices)
  let idle = setInterval(() => { if (mouse || !visible) return; const x = W * (0.12 + Math.random() * 0.76), y = CH * 2 + Math.random() * (H - CH * 3); const k = cells.filter(c => c.r > 0 && Math.abs(off + c.c * CW + CW / 2 - x) < CW * 1.2 && Math.abs(c.r * CH + CH / 2 - y) < CH * 1.5); k.forEach(c => { c.a = Math.max(c.a, 0.9); c.t = c.t || performance.now(); }); kick(); }, 1400);
  layout();
  return () => { cancelAnimationFrame(raf); clearInterval(idle); ro.disconnect(); io.disconnect(); tgt.removeEventListener('pointermove', move); tgt.removeEventListener('pointerleave', leave); cv.remove(); };
}
