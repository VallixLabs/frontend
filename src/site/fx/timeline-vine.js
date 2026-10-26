// Scroll-grown vine timeline for the "Who we are" page, ported from the design's WhoWeAre.dc.html
// (its setup / leaf / curl / tendril methods). The SVG paths, labels and links are rendered by React;
// this builds the vine artwork into the SVG and drives growth, nodes and labels from the scroll position.
const INK = '#141414', PAPER = '#f6f5f2', VINE = '#2e5c36', STEM = '#eef1e8', LEAF = '#e3ead9';
// Where each photo card settles in the stack (px offset, degrees), one per milestone, cycling.
const PH = [[-4, 2, -2.5], [5, -3, 2], [-2, 4, -1.2], [4, 1, 2.8], [-5, -2, -1.8], [3, 3, 1.4], [-3, -4, -3], [5, 2, 1.8], [-6, 1, -0.8], [2, -3, 2.4], [-2, 3, -2], [0, 0, 0.6]].map(([x, y, r]) => ({ x, y, r }));

export function mountTimeline({ svg, stage, track, now, hint, photos, milestones, onNodeOff }) {
  let raf = 0;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, at, p) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (p) p.appendChild(e); return e; };
  let sd = 11; const rnd = () => { sd |= 0; sd = sd + 0x6D2B79F5 | 0; let t = Math.imul(sd ^ sd >>> 15, 1 | sd); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rr = (x, y) => x + (y - x) * rnd();
  const f = n => n.toFixed(1);
  const paths = {}; svg.querySelectorAll('[data-vine]').forEach(p => { paths[p.dataset.vine] = { el: p, L: p.getTotalLength(), k: p.dataset.vine }; });
  const nearestLen = (P, x, y) => { let best = 0, bd = 1e9; for (let i = 0; i <= 800; i++) { const l = P.L * i / 800, q = P.el.getPointAtLength(l), d = (q.x - x) ** 2 + (q.y - y) ** 2; if (d < bd) { bd = d; best = l; } } return best; };
  const n = milestones.length, T0 = 0.04, T1 = 0.9;
  const nodes = milestones.map((m, i) => ({ ...m, i, t: T0 + i * (T1 - T0) / (n - 1), len: nearestLen(paths[m.p], m.x, m.y) }));
  const keys = { main: [], tvarit: [], left: [] };
  nodes.forEach(nd => keys[nd.p].push([nd.t, nd.len]));
  keys.main.unshift([0, 0]); keys.main.push([0.985, paths.main.L]);
  const lenAt = (k, t) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const A = k[i - 1], B = k[i]; return A[1] + (B[1] - A[1]) * (t - A[0]) / (B[0] - A[0]); } return k[k.length - 1][1]; };
  const tAtLen = (k, L) => { for (let i = 1; i < k.length; i++) if (L <= k[i][1]) { const A = k[i - 1], B = k[i]; return A[0] + (B[0] - A[0]) * (L - A[1]) / (B[1] - A[1]); } return 1; };
  const stepT = (T1 - T0) / (n - 1);
  const addFork = (name, fx, fy) => {
    const fl = nearestLen(paths.main, fx, fy); let tf = tAtLen(keys.main, fl); const tb = keys[name][0][0];
    if (tf > tb - 0.4 * stepT) { tf = tb - 0.5 * stepT; keys.main.push([tf, fl]); keys.main.sort((A, B) => A[0] - B[0]); }
    keys[name].unshift([tf, 0]); keys[name][keys[name].length - 1][1] = paths[name].L;
  };
  addFork('tvarit', 352, 301); addFork('left', 194, 356);

  const gfx = svg.querySelector('[data-vinegfx]'); gfx.innerHTML = '';
  const defs = mk('defs', {}, gfx);
  const gShadow = mk('g', { fill: '#dedbd4' }, gfx), gBackLeaves = mk('g', {}, gfx), gStem = mk('g', {}, gfx), gLeaves = mk('g', {}, gfx), gTendril = mk('g', { fill: 'none', stroke: VINE, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, gfx);
  const LIGHT = [-0.6, -0.8];
  const leaves = [], tendrils = [];
  const W = { main: [5.6, 2.7], tvarit: [3.7, 1.6], left: [3.8, 1.6] };
  for (const key in paths) {
    const P = paths[key], step = 1.6, N = Math.ceil(P.L / step);
    const S = [];
    for (let i = 0; i <= N; i++) {
      const l = Math.min(P.L, i * step), q = P.el.getPointAtLength(l), q2 = P.el.getPointAtLength(Math.min(P.L, l + 1)), q0 = P.el.getPointAtLength(Math.max(0, l - 1));
      let tx = q2.x - q0.x, ty = q2.y - q0.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const u = l / P.L;
      const w = (W[key][0] + (W[key][1] - W[key][0]) * Math.pow(u, 0.8)) * (1 + 0.1 * Math.sin(l * 0.11) + 0.06 * Math.sin(l * 0.37 + 1.3)) * (key !== 'main' ? Math.min(1, 0.55 + l / 40) : 1);
      S.push({ x: q.x, y: q.y, tx, ty, nx: -ty, ny: tx, w, l });
    }
    P.S = S;
    const Lf = S.map(s => [s.x + s.nx * s.w / 2, s.y + s.ny * s.w / 2]), Rt = S.map(s => [s.x - s.nx * s.w / 2, s.y - s.ny * s.w / 2]);
    const poly = 'M' + Lf.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'L' + Rt.reverse().map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
    Rt.reverse();
    // growth mask
    const mid = 'vgrow-' + key, m = mk('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -40, y: -20, width: 820, height: 700 }, defs);
    const mp = mk('path', { d: P.el.getAttribute('d'), fill: 'none', stroke: '#fff', 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, m);
    mp.style.strokeDasharray = P.L + ' ' + (P.L + 40); mp.style.strokeDashoffset = P.L; P.mask = mp;
    mk('path', { d: poly, transform: 'translate(2.2 3.2)', mask: 'url(#' + mid + ')' }, gShadow);
    const g = mk('g', { mask: 'url(#' + mid + ')' }, gStem);
    mk('path', { d: poly, fill: STEM }, g);
    // bark: fine longitudinal grooves
    [-0.22, 0.18].forEach((k, j) => {
      let d = '', on = false;
      S.forEach((s) => { const vis = Math.sin(s.l * 0.06 + j * 2.1 + k * 7) > -0.35; const p = [s.x + s.nx * s.w * k, s.y + s.ny * s.w * k]; if (vis) { d += (on ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); on = true; } else on = false; });
      mk('path', { d, fill: 'none', stroke: VINE, 'stroke-width': 0.45, opacity: 0.55 }, g);
    });
    // hatching on the shadow side
    let hd = '';
    S.forEach((s, i) => {
      if (i % 2) return;
      const sg = (s.nx * LIGHT[0] + s.ny * LIGHT[1]) < 0 ? 1 : -1;
      const E = sg > 0 ? Lf[i] : Rt[i], k = s.w * rr(0.28, 0.5);
      hd += 'M' + f(E[0]) + ' ' + f(E[1]) + 'L' + f(E[0] - s.nx * sg * k + s.tx * k * 0.5) + ' ' + f(E[1] - s.ny * sg * k + s.ty * k * 0.5);
    });
    mk('path', { d: hd, fill: 'none', stroke: VINE, 'stroke-width': 0.55, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    // outline edges
    mk('path', { d: 'M' + Lf.map(p => f(p[0]) + ' ' + f(p[1])).join('L'), fill: 'none', stroke: VINE, 'stroke-width': 1.25, 'stroke-linejoin': 'round' }, g);
    mk('path', { d: 'M' + Rt.map(p => f(p[0]) + ' ' + f(p[1])).join('L'), fill: 'none', stroke: VINE, 'stroke-width': 1.25, 'stroke-linejoin': 'round' }, g);
    // twining secondary stem: over/under
    const per = key === 'main' ? 26 : 20;
    let tf = '', on2 = false;
    S.forEach(s => {
      const ph = s.l / per * Math.PI * 2, front = Math.cos(ph) > 0;
      const off = Math.sin(ph) * s.w * 0.62;
      const p = [s.x + s.nx * off, s.y + s.ny * off];
      if (front) { tf += (on2 ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); on2 = true; } else on2 = false;
    });
    mk('path', { d: tf, fill: 'none', stroke: STEM, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
    mk('path', { d: tf, fill: 'none', stroke: VINE, 'stroke-width': 0.95, 'stroke-linecap': 'round' }, g);
    // leaves
    let l = rr(14, 22), side = 1;
    const nodeLs = nodes.filter(nd => nd.p === key).map(nd => nd.len);
    while (l < P.L - 4) {
      if (nodeLs.some(nl => Math.abs(nl - l) < 11)) { l += 6; continue; }
      const i = Math.round(l / step), s = S[Math.min(i, S.length - 1)];
      side = -side;
      const u = l / P.L;
      const size = rr(7, 15) * (key === 'main' ? 1.05 - 0.25 * u : 0.85);
      const back = rnd() < 0.28;
      leaves.push(leaf(mk, back ? gBackLeaves : gLeaves, s, side, size, rnd, key, l));
      if (rnd() < 0.15) { // paired smaller leaf
        leaves.push(leaf(mk, gLeaves, s, -side, size * 0.62, rnd, key, l + 3));
      }
      tendrils.push(tendril(mk, gTendril, s, -side, rnd, key, l + rr(4, 9)));
      { const lc = l + rr(7, 14), sc = S[Math.min(S.length - 1, Math.round(lc / step))]; if (rnd() < 0.75 && !nodeLs.some(nl => Math.abs(nl - lc) < 12)) tendrils.push(curl(mk, gTendril, sc, rnd() < 0.5 ? side : -side, rnd, key, lc)); }
      if (rnd() < 0.6) tendrils.push(tendril(mk, gTendril, s, side, rnd, key, l + rr(10, 16)));
      l += rr(26, 38);
    }
  }
  // milestone nodes
  const gN = svg.querySelector('[data-nodes]'); gN.innerHTML = '';
  nodes.forEach((nd, i) => {
    const P = paths[nd.p], q = P.el.getPointAtLength(nd.len);
    const g = mk('g', {}, gN);
    const ring = mk('circle', { cx: q.x, cy: q.y, r: 10, fill: 'none', stroke: INK, 'stroke-width': 1 }, g);
    const dot = mk('circle', { cx: q.x, cy: q.y, r: 4.4, fill: PAPER, stroke: INK, 'stroke-width': 1.8 }, g);
    g.style.transformOrigin = q.x + 'px ' + q.y + 'px'; g.style.transformBox = 'view-box'; g.style.transform = 'scale(0)'; g.style.transition = 'transform .55s cubic-bezier(.3,1.6,.5,1)';
    ring.style.opacity = 0;
    nd.g = g; nd.ring = ring; nd.dot = dot; nd.on = false;
    nd.label = stage.querySelector('[data-label="' + i + '"]');
    nd.link = stage.querySelector('[data-link="' + i + '"]');
    nd.photo = photos ? photos.querySelector('[data-photo="' + i + '"]') : null;
  });
  let pT = 0, pC = 0, last = -1, lastPh;
  const phOff = i => PH[i % PH.length];
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const r = track.getBoundingClientRect(), span = Math.max(1, r.height - innerHeight);
    pT = Math.max(0, Math.min(1, -r.top / span));
    pC += (pT - pC) * 0.09; if (Math.abs(pT - pC) < 1e-4) pC = pT;
    if (Math.abs(pC - last) < 1e-5) return; last = pC;
    const cur = {};
    // A zero-length dash still draws its round cap, which would show a dot of every branch before it grows,
    // so the mask stays hidden until its branch has started.
    for (const k in paths) { const P = paths[k], l = lenAt(keys[k], pC); cur[k] = l; P.mask.style.strokeDashoffset = (P.L - l).toFixed(2); P.mask.style.visibility = l > 0.5 ? 'visible' : 'hidden'; }
    for (const lf of leaves) { const on = cur[lf.key] > lf.l + 5; if (on !== lf.on) { lf.on = on; lf.g.style.transform = on ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(' + (lf.side * -40) + 'deg)'; } }
    for (const td of tendrils) { const on = cur[td.key] > td.l + 4; if (on !== td.on) { td.on = on; td.el.style.strokeDashoffset = on ? 0 : td.L; if (td.el2) td.el2.style.strokeDashoffset = on ? 0 : td.L2; if (td.hairs) td.hairs.style.opacity = on ? 0.75 : 0; } }
    let latest = null;
    nodes.forEach(nd => {
      const on = pC >= nd.t - 0.002;
      if (on) latest = nd;
      if (on !== nd.on) {
        nd.on = on;
        nd.g.style.transform = on ? 'scale(1)' : 'scale(0)';
        if (nd.photo) { const P = phOff(nd.i); nd.photo.style.opacity = on ? 1 : 0; nd.photo.style.transform = on ? 'translate(' + P.x + 'px,' + P.y + 'px) rotate(' + P.r + 'deg)' : 'translate(' + (P.x + 70) + 'px,' + (P.y - 90) + 'px) rotate(' + (P.r + 18) + 'deg) scale(1.12)'; }
        if (nd.label) { nd.label.style.opacity = on ? 1 : 0; nd.label.style.filter = on ? 'blur(0)' : 'blur(4px)'; nd.label.style.transform = on ? 'none' : 'translateY(6px)'; }
        if (nd.link) nd.link.style.pointerEvents = on ? 'auto' : 'none';
        if (!on && onNodeOff) onNodeOff(nd.i);
      }
    });
    // older cards in the stack dim slightly
    if (latest !== lastPh) { lastPh = latest; nodes.forEach(nd => { if (nd.photo) nd.photo.style.filter = nd.on && latest && nd.i < latest.i - 1 ? 'brightness(.94) saturate(.85)' : 'none'; }); }
    nodes.forEach(nd => { const c = nd === latest; nd.dot.setAttribute('fill', c ? VINE : PAPER); nd.ring.setAttribute('stroke', c ? VINE : INK); nd.ring.style.opacity = c ? 1 : 0; });
    if (now) now.textContent = latest ? latest.date : milestones[0].date;
    if (hint) hint.style.opacity = pC > 0.03 ? 0 : 1;
  };
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); gfx.innerHTML = ''; gN.innerHTML = ''; };
}

function leaf(mk, parent, s, side, size, rnd, key, l) {
  const f = n => n.toFixed(2);
  const ang = Math.atan2(s.ty, s.tx) + side * (0.75 + rnd() * 0.55);
  let ax = Math.cos(ang), ay = Math.sin(ang) + 0.45; const al = Math.hypot(ax, ay); ax /= al; ay /= al;
  const bx = -ay, by = ax;
  const base = [s.x + s.nx * side * s.w * 0.45, s.y + s.ny * side * s.w * 0.45];
  const pet = size * 0.42, fore = 0.7 + rnd() * 0.3;
  const P = (u, v) => [base[0] + ax * (pet + u * size) + bx * v * size * fore, base[1] + ay * (pet + u * size) + by * v * size * fore];
  const pt = p => f(p[0]) + ' ' + f(p[1]);
  // heart-shaped ivy-like leaf with a drip tip
  const d = 'M' + pt(P(0, 0)) + 'C' + pt(P(-0.18, 0.28)) + ' ' + pt(P(0.08, 0.62)) + ' ' + pt(P(0.38, 0.56)) + 'C' + pt(P(0.66, 0.5)) + ' ' + pt(P(0.86, 0.22)) + ' ' + pt(P(1.08, 0.02))
    + 'C' + pt(P(0.86, -0.2)) + ' ' + pt(P(0.66, -0.5)) + ' ' + pt(P(0.38, -0.56)) + 'C' + pt(P(0.08, -0.62)) + ' ' + pt(P(-0.18, -0.28)) + ' ' + pt(P(0, 0)) + 'Z';
  const g = mk('g', {}, parent);
  mk('path', { d: 'M' + pt(base) + 'Q' + pt([base[0] + ax * pet * 0.5 + bx * size * 0.06, base[1] + ay * pet * 0.5 + by * size * 0.06]) + ' ' + pt(P(0, 0)), fill: 'none', stroke: VINE, 'stroke-width': 0.9, 'stroke-linecap': 'round' }, g);
  mk('path', { d, fill: LEAF, stroke: VINE, 'stroke-width': 0.95, 'stroke-linejoin': 'round' }, g);
  // midrib + veins
  let vd = 'M' + pt(P(0.02, 0)) + 'Q' + pt(P(0.5, 0.03 * side)) + ' ' + pt(P(0.98, 0.02));
  [[0.12, 0.42], [0.32, 0.46], [0.54, 0.34], [0.74, 0.2]].forEach(([u, v]) => { vd += 'M' + pt(P(u, 0)) + 'Q' + pt(P(u + 0.1, v * 0.5)) + ' ' + pt(P(u + 0.2, v)); vd += 'M' + pt(P(u, 0)) + 'Q' + pt(P(u + 0.1, -v * 0.5)) + ' ' + pt(P(u + 0.2, -v)); });
  mk('path', { d: vd, fill: 'none', stroke: VINE, 'stroke-width': 0.5, 'stroke-linecap': 'round', opacity: 0.8 }, g);
  // stipple shade on one half
  let sdots = ''; const cnt = Math.round(size * 2.6);
  for (let i = 0; i < cnt; i++) { const u = 0.08 + rnd() * 0.8, lim = Math.sin(Math.PI * Math.min(1, u / 1.0)) * 0.5; const v = -(0.05 + Math.pow(rnd(), 0.6) * lim); sdots += 'M' + pt(P(u, v)) + 'h0'; }
  mk('path', { d: sdots, fill: 'none', stroke: VINE, 'stroke-width': 0.75, 'stroke-linecap': 'round', opacity: 0.7 }, g);
  g.style.transformOrigin = base[0] + 'px ' + base[1] + 'px'; g.style.transformBox = 'view-box';
  g.style.transform = 'scale(0) rotate(' + (side * -40) + 'deg)';
  g.style.transition = 'transform .9s cubic-bezier(.25,1.35,.45,1)';
  return { g, l, key, side, on: false };
}

function curl(mk, parent, s, side, rnd, key, l) {
  const f = n => n.toFixed(2);
  // rise from the stem edge, gentle S-bend, then a tightening coil (fiddlehead)
  const nx = s.nx * side, ny = s.ny * side;
  let a = Math.atan2(ny * 0.8 + s.ty * 0.6, nx * 0.8 + s.tx * 0.6) + (rnd() - 0.5) * 0.5;
  let x = s.x + nx * s.w * 0.45, y = s.y + ny * s.w * 0.45;
  const stemLen = 14 + rnd() * 12, N = 26, turn = rnd() < 0.5 ? 1 : -1;
  const sp = [[x, y]];
  for (let k = 1; k <= N; k++) { const u = k / N; a += turn * Math.sin(u * Math.PI * 2) * 0.07 - turn * 0.012; const st = stemLen / N; x += Math.cos(a) * st; y += Math.sin(a) * st; sp.push([x, y]); }
  // spiral: centre perpendicular to current heading on the curl side
  const R0 = 4.6 + rnd() * 3.6, turns = 2.3 + rnd() * 0.6, cs = -turn;
  const cx = x + Math.cos(a + cs * Math.PI / 2) * R0, cy = y + Math.sin(a + cs * Math.PI / 2) * R0;
  const th0 = Math.atan2(y - cy, x - cx), M = 90, cp = [];
  for (let k = 0; k <= M; k++) { const u = k / M, th = th0 + cs * u * turns * Math.PI * 2, r = R0 * Math.pow(1 - u * 0.9, 1.15); cp.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r]); }
  const d1 = 'M' + sp.map(p => f(p[0]) + ' ' + f(p[1])).join('L');
  const d2 = 'M' + cp.map(p => f(p[0]) + ' ' + f(p[1])).join('L');
  const el = mk('path', { d: d1, 'stroke-width': 1.35 }, parent);
  const el2 = mk('path', { d: d2, 'stroke-width': 1.0 }, parent);
  const L = el.getTotalLength(), L2 = el2.getTotalLength();
  el.style.strokeDasharray = L + ' ' + (L + 4); el.style.strokeDashoffset = L; el.style.transition = 'stroke-dashoffset .55s cubic-bezier(.4,0,.6,1)';
  el2.style.strokeDasharray = L2 + ' ' + (L2 + 4); el2.style.strokeDashoffset = L2; el2.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.2,.6,.3,1) .45s';
  // fine hairs on the rising stem
  let hd = '';
  for (let k = 2; k < sp.length - 3; k += 2) {
    const p = sp[k], q = sp[k + 1]; let tx = q[0] - p[0], ty = q[1] - p[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const sg = k % 4 ? 1 : -1, hl = 0.9 + rnd() * 0.8;
    hd += 'M' + f(p[0] - ty * sg * 0.5) + ' ' + f(p[1] + tx * sg * 0.5) + 'l' + f((-ty * sg + tx * 0.7) * hl) + ' ' + f((tx * sg + ty * 0.7) * hl);
  }
  const hairs = mk('path', { d: hd, 'stroke-width': 0.4 }, parent);
  hairs.style.opacity = 0; hairs.style.transition = 'opacity .6s ease .3s';
  return { el, L, el2, L2, hairs, l, key, on: false };
}

function tendril(mk, parent, s, side, rnd, key, l) {
  const f = n => n.toFixed(1);
  const nx = s.nx * -side, ny = s.ny * -side;
  const x0 = s.x + nx * s.w * 0.5, y0 = s.y + ny * s.w * 0.5;
  let d = 'M' + f(x0) + ' ' + f(y0); const turns = 2.2 + rnd() * 1.4, len = 9 + rnd() * 9, N = 40;
  let cx = x0, cy = y0, a = Math.atan2(ny, nx) + side * 0.5;
  for (let k = 1; k <= N; k++) { const u = k / N; a += side * (turns * Math.PI * 2 / N) * Math.pow(u, 1.6); const st = len / N * (1.2 - u * 0.7); cx += Math.cos(a) * st; cy += Math.sin(a) * st; d += 'L' + f(cx) + ' ' + f(cy); }
  const el = mk('path', { d }, parent);
  const L = el.getTotalLength(); el.style.strokeDasharray = L + ' ' + (L + 4); el.style.strokeDashoffset = L; el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.3,.6,.2,1)';
  return { el, L, l, key, on: false };
}
