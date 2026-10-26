// Engraved creeper that grows along an SVG path: tapered inked stem, twining strand,
// ivy leaves, fiddlehead curls and tendrils. Returns { L, setLen(len), grow(ms) }.
const NS = 'http://www.w3.org/2000/svg', INK = '#2e5c36', PAPER = '#f6f5f2', STEM = '#eef1e8', LEAF = '#e3ead9';
const mk = (tag, at, p) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; };
const f = n => n.toFixed(1), f2 = n => n.toFixed(2);
let UID = 0;

export function growVine(svg, d, o = {}) {
  let sd = o.seed || 7; const rnd = () => { sd |= 0; sd = sd + 0x6D2B79F5 | 0; let t = Math.imul(sd ^ sd >>> 15, 1 | sd); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rr = (a, b) => a + (b - a) * rnd();
  const root = mk('g', {}, svg);
  const guide = mk('path', { d, fill: 'none', stroke: 'none' }, root);
  const L = guide.getTotalLength(), step = 1.6, N = Math.ceil(L / step);
  const w0 = o.w0 || 4.6, w1 = o.w1 || 2;
  const S = [];
  for (let i = 0; i <= N; i++) {
    const l = Math.min(L, i * step), q = guide.getPointAtLength(l), a = guide.getPointAtLength(Math.max(0, l - 1)), b = guide.getPointAtLength(Math.min(L, l + 1));
    let tx = b.x - a.x, ty = b.y - a.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const u = l / L, w = (w0 + (w1 - w0) * Math.pow(u, 0.8)) * (1 + 0.1 * Math.sin(l * 0.11) + 0.06 * Math.sin(l * 0.37 + 1.3)) * Math.min(1, 0.6 + l / 30);
    S.push({ x: q.x, y: q.y, tx, ty, nx: -ty, ny: tx, w, l });
  }
  const id = 'vg' + (++UID);
  const defs = mk('defs', {}, root), mask = mk('mask', { id, maskUnits: 'userSpaceOnUse', x: -2000, y: -2000, width: 6000, height: 6000 }, defs);
  const mp = mk('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': w0 * 4 + 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mask);
  mp.style.strokeDasharray = L + ' ' + (L + 40); mp.style.strokeDashoffset = L;
  const gShadow = mk('g', { fill: '#dedbd4' }, root), gBack = mk('g', {}, root), gStem = mk('g', { mask: `url(#${id})` }, root), gLeaf = mk('g', {}, root), gTen = mk('g', { fill: 'none', stroke: INK, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, root);
  const Lf = S.map(s => [s.x + s.nx * s.w / 2, s.y + s.ny * s.w / 2]), Rt = S.map(s => [s.x - s.nx * s.w / 2, s.y - s.ny * s.w / 2]);
  const line = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L');
  const poly = line(Lf) + 'L' + Rt.slice().reverse().map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
  mk('path', { d: poly, transform: 'translate(2 3)', mask: `url(#${id})` }, gShadow);
  mk('path', { d: poly, fill: STEM }, gStem);
  [-0.22, 0.18].forEach((k, j) => { let dd = '', on = false; S.forEach(s => { const vis = Math.sin(s.l * 0.06 + j * 2.1 + k * 7) > -0.35; const p = [s.x + s.nx * s.w * k, s.y + s.ny * s.w * k]; if (vis) { dd += (on ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); on = true; } else on = false; }); mk('path', { d: dd, fill: 'none', stroke: INK, 'stroke-width': 0.45, opacity: 0.55 }, gStem); });
  const LIGHT = [-0.6, -0.8]; let hd = '';
  S.forEach((s, i) => { if (i % 2) return; const sg = (s.nx * LIGHT[0] + s.ny * LIGHT[1]) < 0 ? 1 : -1; const E = sg > 0 ? Lf[i] : Rt[i], k = s.w * rr(0.28, 0.5); hd += 'M' + f(E[0]) + ' ' + f(E[1]) + 'L' + f(E[0] - s.nx * sg * k + s.tx * k * 0.5) + ' ' + f(E[1] - s.ny * sg * k + s.ty * k * 0.5); });
  mk('path', { d: hd, fill: 'none', stroke: INK, 'stroke-width': 0.55, 'stroke-linecap': 'round', opacity: 0.85 }, gStem);
  mk('path', { d: line(Lf), fill: 'none', stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, gStem);
  mk('path', { d: line(Rt), fill: 'none', stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, gStem);
  let tw = '', on2 = false; const per = 22;
  S.forEach(s => { const ph = s.l / per * Math.PI * 2, front = Math.cos(ph) > 0, off = Math.sin(ph) * s.w * 0.62; const p = [s.x + s.nx * off, s.y + s.ny * off]; if (front) { tw += (on2 ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); on2 = true; } else on2 = false; });
  if (o.twine !== false) {
    mk('path', { d: tw, fill: 'none', stroke: STEM, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, gStem);
    mk('path', { d: tw, fill: 'none', stroke: INK, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, gStem);
  }

  const items = [];
  const sAt = l => S[Math.max(0, Math.min(S.length - 1, Math.round(l / step)))];
  const [le0, le1] = o.leafEvery || [24, 36], [ls0, ls1] = o.leafSize || [6, 11];
  let l = rr(8, 16), side = 1;
  while (l < L - 4) {
    side = -side; const s = sAt(l);
    items.push(leaf(rnd() < 0.28 ? gBack : gLeaf, s, side, rr(ls0, ls1) * (1.05 - 0.25 * l / L), rnd, l));
    if (rnd() < (o.tendrilProb ?? 1)) items.push(tendril(gTen, sAt(l + rr(4, 9)), -side, rnd, l + 6));
    if (rnd() < (o.curlProb ?? 0.75)) items.push(curl(gTen, sAt(l + rr(8, 15)), rnd() < 0.5 ? side : -side, rnd, l + 11));
    l += rr(le0, le1);
  }
  let cur = 0;
  const setLen = len => {
    cur = len; mp.style.strokeDashoffset = (L - len).toFixed(2);
    for (const it of items) { const on = len > it.l + 4; if (on !== it.on) { it.on = on; it.toggle(on); } }
  };
  let raf = 0;
  const grow = (ms = 2600, from = 0) => {
    cancelAnimationFrame(raf); const t0 = performance.now();
    const ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const fr = now => { const k = Math.min(1, (now - t0) / ms); setLen(from + (L - from) * ez(k)); if (k < 1) raf = requestAnimationFrame(fr); };
    raf = requestAnimationFrame(fr);
  };
  return { L, setLen, grow, root, get len() { return cur; }, destroy() { cancelAnimationFrame(raf); root.remove(); } };
}

function leaf(parent, s, side, size, rnd, l) {
  const ang = Math.atan2(s.ty, s.tx) + side * (0.75 + rnd() * 0.55);
  let ax = Math.cos(ang), ay = Math.sin(ang) + 0.45; const al = Math.hypot(ax, ay); ax /= al; ay /= al;
  const bx = -ay, by = ax, base = [s.x + s.nx * side * s.w * 0.45, s.y + s.ny * side * s.w * 0.45];
  const pet = size * 0.42, fore = 0.7 + rnd() * 0.3;
  const P = (u, v) => [base[0] + ax * (pet + u * size) + bx * v * size * fore, base[1] + ay * (pet + u * size) + by * v * size * fore];
  const pt = p => f2(p[0]) + ' ' + f2(p[1]);
  const d = 'M' + pt(P(0, 0)) + 'C' + pt(P(-0.18, 0.28)) + ' ' + pt(P(0.08, 0.62)) + ' ' + pt(P(0.38, 0.56)) + 'C' + pt(P(0.66, 0.5)) + ' ' + pt(P(0.86, 0.22)) + ' ' + pt(P(1.08, 0.02))
    + 'C' + pt(P(0.86, -0.2)) + ' ' + pt(P(0.66, -0.5)) + ' ' + pt(P(0.38, -0.56)) + 'C' + pt(P(0.08, -0.62)) + ' ' + pt(P(-0.18, -0.28)) + ' ' + pt(P(0, 0)) + 'Z';
  const g = mk('g', {}, parent);
  mk('path', { d: 'M' + pt(base) + 'L' + pt(P(0, 0)), fill: 'none', stroke: INK, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, g);
  mk('path', { d, fill: LEAF, stroke: INK, 'stroke-width': 0.95, 'stroke-linejoin': 'round' }, g);
  let vd = 'M' + pt(P(0.02, 0)) + 'Q' + pt(P(0.5, 0.03 * side)) + ' ' + pt(P(0.98, 0.02));
  [[0.12, 0.42], [0.32, 0.46], [0.54, 0.34], [0.74, 0.2]].forEach(([u, v]) => { vd += 'M' + pt(P(u, 0)) + 'Q' + pt(P(u + 0.1, v * 0.5)) + ' ' + pt(P(u + 0.2, v)) + 'M' + pt(P(u, 0)) + 'Q' + pt(P(u + 0.1, -v * 0.5)) + ' ' + pt(P(u + 0.2, -v)); });
  mk('path', { d: vd, fill: 'none', stroke: INK, 'stroke-width': 0.5, 'stroke-linecap': 'round', opacity: 0.8 }, g);
  let dots = ''; for (let i = 0, c = Math.round(size * 2.6); i < c; i++) { const u = 0.08 + rnd() * 0.8, lim = Math.sin(Math.PI * u) * 0.5; dots += 'M' + pt(P(u, -(0.05 + Math.pow(rnd(), 0.6) * lim))) + 'h0'; }
  mk('path', { d: dots, fill: 'none', stroke: INK, 'stroke-width': 0.75, 'stroke-linecap': 'round', opacity: 0.7 }, g);
  g.style.transformOrigin = base[0] + 'px ' + base[1] + 'px'; g.style.transformBox = 'view-box';
  g.style.transform = `scale(0) rotate(${side * -40}deg)`; g.style.transition = 'transform .9s cubic-bezier(.25,1.35,.45,1)';
  return { l, on: false, toggle: on => { g.style.transform = on ? 'scale(1) rotate(0deg)' : `scale(0) rotate(${side * -40}deg)`; } };
}
function dash(el, dur, delay = 0, ease = 'cubic-bezier(.3,.6,.2,1)') { const L = el.getTotalLength(); el.style.strokeDasharray = L + ' ' + (L + 4); el.style.strokeDashoffset = L; el.style.transition = `stroke-dashoffset ${dur}s ${ease} ${delay}s`; return on => { el.style.strokeDashoffset = on ? 0 : L; }; }
function tendril(parent, s, side, rnd, l) {
  const nx = s.nx * -side, ny = s.ny * -side; let cx = s.x + nx * s.w * 0.5, cy = s.y + ny * s.w * 0.5;
  let d = 'M' + f(cx) + ' ' + f(cy); const turns = 2.2 + rnd() * 1.4, len = 9 + rnd() * 9, N = 40; let a = Math.atan2(ny, nx) + side * 0.5;
  for (let k = 1; k <= N; k++) { const u = k / N; a += side * (turns * Math.PI * 2 / N) * Math.pow(u, 1.6); const st = len / N * (1.2 - u * 0.7); cx += Math.cos(a) * st; cy += Math.sin(a) * st; d += 'L' + f(cx) + ' ' + f(cy); }
  const t = dash(mk('path', { d }, parent), 1.2);
  return { l, on: false, toggle: t };
}
function curl(parent, s, side, rnd, l) {
  const nx = s.nx * side, ny = s.ny * side;
  let a = Math.atan2(ny * 0.8 + s.ty * 0.6, nx * 0.8 + s.tx * 0.6) + (rnd() - 0.5) * 0.5;
  let x = s.x + nx * s.w * 0.45, y = s.y + ny * s.w * 0.45;
  const stemLen = 14 + rnd() * 12, N = 26, turn = rnd() < 0.5 ? 1 : -1, sp = [[x, y]];
  for (let k = 1; k <= N; k++) { const u = k / N; a += turn * Math.sin(u * Math.PI * 2) * 0.07 - turn * 0.012; x += Math.cos(a) * stemLen / N; y += Math.sin(a) * stemLen / N; sp.push([x, y]); }
  const R0 = 4.6 + rnd() * 3.6, turns = 2.3 + rnd() * 0.6, cs = -turn;
  const cx = x + Math.cos(a + cs * Math.PI / 2) * R0, cy = y + Math.sin(a + cs * Math.PI / 2) * R0, th0 = Math.atan2(y - cy, x - cx), cp = [];
  for (let k = 0; k <= 90; k++) { const u = k / 90, th = th0 + cs * u * turns * Math.PI * 2, r = R0 * Math.pow(1 - u * 0.9, 1.15); cp.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r]); }
  const t1 = dash(mk('path', { d: 'M' + sp.map(p => f2(p[0]) + ' ' + f2(p[1])).join('L'), 'stroke-width': 1.35 }, parent), 0.55, 0, 'cubic-bezier(.4,0,.6,1)');
  const t2 = dash(mk('path', { d: 'M' + cp.map(p => f2(p[0]) + ' ' + f2(p[1])).join('L'), 'stroke-width': 1.0 }, parent), 1.1, 0.45, 'cubic-bezier(.2,.6,.3,1)');
  let hd = '';
  for (let k = 2; k < sp.length - 3; k += 2) { const p = sp[k], q = sp[k + 1]; let tx = q[0] - p[0], ty = q[1] - p[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl; const sg = k % 4 ? 1 : -1, hl = 0.9 + rnd() * 0.8; hd += 'M' + f2(p[0] - ty * sg * 0.5) + ' ' + f2(p[1] + tx * sg * 0.5) + 'l' + f2((-ty * sg + tx * 0.7) * hl) + ' ' + f2((tx * sg + ty * 0.7) * hl); }
  const hairs = mk('path', { d: hd, 'stroke-width': 0.4 }, parent); hairs.style.opacity = 0; hairs.style.transition = 'opacity .6s ease .3s';
  return { l, on: false, toggle: on => { t1(on); t2(on); hairs.style.opacity = on ? 0.75 : 0; } };
}

// Wrap a card: main creeper climbs one side and runs along the top; a second one climbs the opposite side.
export function entangle(card, svg, o = {}) {
  // a few short, rugged runners creeping in from random edges/corners
  let vines = [], grown = false, lastW = 0, lastH = 0;
  const PAD = 30;
  const build = (instant) => {
    vines.forEach(x => x.destroy()); vines = [];
    const W = card.offsetWidth, H = card.offsetHeight; lastW = W; lastH = H;
    svg.setAttribute('viewBox', '0 0 ' + (W + PAD * 2) + ' ' + (H + PAD * 2));
    let sd = (o.seed || 3) * 977; const rnd = () => { sd |= 0; sd = sd + 0x6D2B79F5 | 0; let t = Math.imul(sd ^ sd >>> 15, 1 | sd); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const rr = (x, y) => x + (y - x) * rnd();
    const x0 = PAD, y0 = PAD, x1 = PAD + W, y1 = PAD + H;
    // jagged run: mostly straight legs with abrupt kinks, hugging an edge
    const run = (sx, sy, dx, dy, len, jitter) => {
      const p = [[sx, sy]]; let x = sx, y = sy; const nx = -dy, ny = dx; const legs = 4 + Math.floor(rnd() * 3);
      for (let i = 1; i <= legs; i++) { const st = len / legs * rr(0.8, 1.2), off = rr(-jitter, jitter); x += dx * st + nx * off; y += dy * st + ny * off; p.push([x, y]); }
      return 'M' + p.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L');
    };
    const specs = [];
    const corner = Math.floor(rnd() * 4);
    // 1) from a bottom corner, creeping up the side
    if (corner % 2 === 0) specs.push(run(x0 + rr(-3, 3), y1 + 14, 0, -1, H * rr(0.3, 0.42), 7));
    else specs.push(run(x1 + rr(-3, 3), y1 + 14, 0, -1, H * rr(0.3, 0.42), 7));
    // 2) along the top edge from a corner
    if (corner < 2) specs.push(run(x1 + 12, y0 + rr(-2, 3), -1, 0, W * rr(0.3, 0.42), 6));
    else specs.push(run(x0 - 12, y0 + rr(-2, 3), 1, 0, W * rr(0.3, 0.42), 6));
    // 3) sometimes a tiny sprig across the image edge
    if (rnd() < 0.6) { const yy = y0 + H * rr(0.45, 0.6), left = rnd() < 0.5; specs.push(run(left ? x0 - 10 : x1 + 10, yy, left ? 1 : -1, rr(-0.25, 0.25), rr(34, 52), 5)); }
    const opt = { w0: 3.6, w1: 1.3, twine: false, leafEvery: [24, 36], leafSize: [5, 8], curlProb: 0.25, tendrilProb: 0.45 };
    specs.forEach((d, i) => vines.push(growVine(svg, d, { ...opt, seed: (o.seed || 3) + i * 31 })));
    if (instant) vines.forEach(x => x.setLen(x.L));
  };
  build(false);
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !grown) { grown = true; vines.forEach((x, i) => setTimeout(() => x.grow(1600 + i * 200), i * 350)); io.disconnect(); } }, { threshold: 0.35 });
  io.observe(card);
  const ro = new ResizeObserver(() => { if (Math.abs(card.offsetWidth - lastW) > 2 || Math.abs(card.offsetHeight - lastH) > 2) build(grown); });
  ro.observe(card);
  return () => { io.disconnect(); ro.disconnect(); vines.forEach(x => x.destroy()); };
}
function catmull(p) {
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c; d += `C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`; }
  return d;
}

// A few creepers draped over the footer's top rule: they run along the line, then hang down in curls.
export function footerVines(footer, o = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.style.cssText = 'position:absolute;left:0;top:-14px;width:100%;height:150px;overflow:visible;pointer-events:none;z-index:1';
  footer.insertBefore(svg, footer.firstChild);
  let vines = [], grown = false, lastW = 0;
  const build = (instant) => {
    vines.forEach(x => x.destroy()); vines = [];
    const W = footer.offsetWidth; lastW = W; svg.setAttribute('viewBox', '0 0 ' + W + ' 150');
    const Y = 14;
    let sd = 41; const rnd = () => { sd |= 0; sd = sd + 0x6D2B79F5 | 0; let t = Math.imul(sd ^ sd >>> 15, 1 | sd); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const rr = (a, b) => a + (b - a) * rnd();
    // drape: lie along the rule, sag between two rests, then drop over and coil
    const drape = (x0, len, dir) => {
      const p = [[x0, Y - 1]]; const n = 5;
      for (let i = 1; i <= n; i++) { const x = x0 + dir * len * i / n; p.push([x, Y + (i % 2 ? rr(5, 12) : rr(-1.5, 1))]); }
      const xe = p[p.length - 1][0], drop = rr(34, 58);
      p.push([xe + dir * 6, Y + 10], [xe + dir * 8, Y + drop * 0.55], [xe + dir * 3, Y + drop]);
      // closing hook curl
      const cx = xe + dir * 3 - dir * 7, cy = Y + drop;
      for (let k = 1; k <= 10; k++) { const a = Math.PI * k / 10 * 1.6, r = 7 * (1 - k / 16); p.push([cx + dir * Math.cos(a) * r, cy + Math.sin(a) * r]); }
      return catmull(p);
    };
    const specs = [
      { x: -40, len: Math.min(300, W * 0.26) + 40, dir: 1 },
      { x: W + 40, len: Math.min(220, W * 0.2) + 40, dir: -1 },
    ];
    specs.forEach((s, i) => vines.push(growVine(svg, drape(s.x, s.len, s.dir), { seed: 9 + i * 23, w0: 3.4, w1: 1.3, twine: false, leafEvery: [30, 44], leafSize: [5, 8.5], curlProb: 0.45, tendrilProb: 0.4 })));
    if (instant) vines.forEach(x => x.setLen(x.L));
  };
  build(false);
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !grown) { grown = true; vines.forEach((x, i) => setTimeout(() => x.grow(2200), i * 300)); io.disconnect(); } }, { threshold: 0.15 });
  io.observe(footer);
  const ro = new ResizeObserver(() => { if (Math.abs(footer.offsetWidth - lastW) > 4) build(grown); });
  ro.observe(footer);
  return () => { io.disconnect(); ro.disconnect(); vines.forEach(x => x.destroy()); svg.remove(); };
}
