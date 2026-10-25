// Scroll-driven engraved tree for the website. Builds the same tree as Tree.html.
import * as THREE from 'three';
import * as ENG from './engrave.js';

function buildTree() {
  const TOUR = { roots: [], nodes: [], vines: [] };
  // ---------- seeded random ----------
  let seed = 20261023;
  const rand = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rr = (a, b) => a + (b - a) * rand();
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const UP = V(0, 1, 0);

  // ---------- geometry buckets (merged per material) ----------
  const mk = () => ({ pos: [], idx: [], n: 0 });
  const buckets = { trunk: mk(), branches: mk(), twigs: mk(), roots: mk(), vines: mk() };

  // Tapered, fluted tube along a smooth curve. Shared ring vertices (no seam).
  function tube(bucket, pts, r0, r1, o = {}) {
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const L = curve.getLength();
    const segs = Math.max(3, Math.min(160, Math.ceil(L * (o.density || 10))));
    const radial = o.radial || (r0 > 0.15 ? 40 : r0 > 0.05 ? 16 : r0 > 0.02 ? 8 : 5);
    // parallel-transport frames (no flips / twisting)
    const frames = { normals: [], binormals: [] };
    { let Tp = curve.getTangentAt(0);
      let Nn = V().crossVectors(Tp, Math.abs(Tp.y) < 0.95 ? UP : V(1, 0, 0)).normalize();
      const q = new THREE.Quaternion();
      for (let i = 0; i <= segs; i++) {
        const T = curve.getTangentAt(i / segs);
        q.setFromUnitVectors(Tp, T); Nn.applyQuaternion(q);
        Nn.addScaledVector(T, -Nn.dot(T)).normalize();
        frames.normals.push(Nn.clone()); frames.binormals.push(V().crossVectors(T, Nn).normalize());
        Tp = T;
      } }
    const flute = o.flute || 0, fluteN = o.fluteN || 9, twist = o.twist || 0;
    const prof = o.profile || (t => r0 + (r1 - r0) * Math.pow(t, 0.85));
    const phase = rand() * 6.283;
    const base = bucket.n;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const P = curve.getPointAt(t);
      const N = frames.normals[i], B = frames.binormals[i];
      const r = prof(t);
      for (let j = 0; j < radial; j++) {
        const a = j / radial * Math.PI * 2;
        let m = 1;
        if (flute) {
          const s = a + twist * t + phase;
          // smooth buttress lobes, strongest near the base
          m += flute * (0.35 + 0.65 * Math.exp(-t * 5)) * Math.sin(s * fluteN);
        }
        const c = Math.cos(a) * r * m, sn = Math.sin(a) * r * m;
        bucket.pos.push(P.x + N.x * c + B.x * sn, P.y + N.y * c + B.y * sn, P.z + N.z * c + B.z * sn);
      }
    }
    for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
      const a = base + i * radial + j, b = base + i * radial + (j + 1) % radial;
      const c = a + radial, d = b + radial;
      bucket.idx.push(a, b, c, b, d, c);
    }
    // tip cap
    const tipC = curve.getPointAt(1);
    bucket.pos.push(tipC.x, tipC.y, tipC.z);
    const tip = base + (segs + 1) * radial, last = base + segs * radial;
    for (let j = 0; j < radial; j++) bucket.idx.push(last + j, last + (j + 1) % radial, tip);
    bucket.n = tip + 1;
    return curve;
  }

  // random unit vector perpendicular to d
  function perp(d) {
    const a = Math.abs(d.y) < 0.9 ? UP : V(1, 0, 0);
    const p = V().crossVectors(d, a).normalize();
    return p.applyAxisAngle(d, rand() * Math.PI * 2);
  }

  // ---------- crown ----------
  const anchors = []; // points along branches where vines can hang
  function grow(start, dir, len, r, depth, pd) {
    const steps = 5;
    const pts = [start.clone()];
    const d = dir.clone();
    const cur = start.clone();
    if (pd) {
      cur.addScaledVector(pd, depth === 0 ? 0.75 : Math.max(r * 2.2, len * 0.06)); pts.push(cur.clone());
      for (const f of [0.33, 0.66]) { cur.addScaledVector(pd.clone().lerp(d, f).normalize(), Math.max(r * 1.6, len * 0.05)); pts.push(cur.clone()); }
    }
    for (let k = 1; k <= steps; k++) {
      d.add(perp(d).multiplyScalar(0.13 + depth * 0.02));
      // tips sweep upward like the reference
      d.y += depth >= 2 ? 0.05 : 0.0;
      d.normalize();
      if (d.y < -0.2) { d.y = -0.2; d.normalize(); }
      cur.addScaledVector(d, len / steps);
      pts.push(cur.clone());
    }
    const rEnd = Math.max(r * 0.64, 0.009);
    const bucket = r > 0.07 ? buckets.branches : buckets.twigs;
    const curve = tube(bucket, pts, r, rEnd, {
      density: r > 0.05 ? 24 : 8,
      // round the end inward so it tucks inside the continuing child branch (no visible lip)
      profile: t => { const e = Math.max(0, (t - 0.9) / 0.1); return (r + (rEnd - r) * Math.pow(t, 0.85)) * (1 - 0.4 * e * e); }
    });
    if (depth >= 1 && depth <= 3) for (let k = 2; k < pts.length; k++) anchors.push({ p: pts[k], r: r, depth });
    if (depth <= 1) TOUR.nodes.push({ p: pts[pts.length - 1].clone(), depth, r });

    if (depth >= 5 || rEnd < 0.014) return;
    const kids = depth < 1 ? 3 : (depth < 3 && rand() < 0.4 ? 3 : 2);
    const az0 = rand() * Math.PI * 2;
    for (let c = 0; c < kids; c++) {
      const main = c === 0;
      const ang = main ? rr(0.12, 0.35) : rr(0.45, 0.85);
      const axis = V().crossVectors(d, UP);
      if (axis.lengthSq() < 1e-4) axis.set(1, 0, 0);
      axis.normalize().applyAxisAngle(d, az0 + c * (Math.PI * 2 / kids) + rr(-0.4, 0.4));
      const nd = d.clone().applyAxisAngle(axis, ang).normalize();
      const nr = rEnd * (main ? rr(0.98, 1.0) : rr(0.55, 0.75));
      grow(pts[pts.length - 1].clone().addScaledVector(d, -Math.max(rEnd * 3, len * 0.06)), nd, len * (main ? rr(0.72, 0.85) : rr(0.6, 0.75)), nr, depth + 1, d.clone());
    }
    // little side spurs along the length
    if (false) {
      const spurs = Math.floor(rr(1, 3));
      for (let s = 0; s < spurs; s++) {
        const t = rr(0.3, 0.8);
        const p = curve.getPointAt(t), tg = curve.getTangentAt(t);
        const nd = tg.clone().applyAxisAngle(perp(tg), rr(0.6, 1.0));
        nd.y = Math.abs(nd.y) + 0.2; nd.normalize();
        const sr = rEnd * rr(0.5, 0.8);
        if (sr > 0.011) grow(p, nd, len * rr(0.3, 0.5), sr, Math.max(depth + 2, 5));
      }
    }
  }

  // ---------- trunk ----------
  const TRUNK_H = 3.9;
  const trunkPts = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    trunkPts.push(V(0, -0.35 + t * (TRUNK_H + 0.35), -0.05));
  }
  tube(buckets.trunk, trunkPts, 0.36, 0.3, {
    radial: 72, density: 24, flute: 0.07, fluteN: 5, twist: 0.6,
    profile: t => {
      const yy = -0.35 + t * (TRUNK_H + 0.35);
      const base = 0.5 + 0.42 * Math.exp(-Math.max(yy, 0) / TRUNK_H * 5.5) - 0.08 * t + 0.1 * Math.exp(-Math.max(yy, 0) / 0.5);
      const k = (t * TRUNK_H - (TRUNK_H - 1.0)) / 1.0; // rounded crown dome
      return k > 0 ? base * Math.max(0.02, 1 - 0.75 * k * k) : base;
    }
  });
  // main limbs: a wide, open crown
  const limbs0 = [
    { az: 0.2, el: 0.55, len: 2.6, r: 0.24, h: 2.35 },
    { az: 1.35, el: 0.85, len: 2.2, r: 0.22, h: 2.6 },
    { az: 2.5, el: 0.5, len: 2.7, r: 0.24, h: 2.2 },
    { az: 3.4, el: 0.95, len: 2.3, r: 0.21, h: 2.65 },
    { az: 4.3, el: 0.45, len: 2.6, r: 0.23, h: 2.1 },
    { az: 5.4, el: 0.75, len: 2.4, r: 0.22, h: 2.5 },
    { az: 0.9, el: 1.25, len: 2.3, r: 0.18, h: 2.7 },
    { az: 3.9, el: 1.3, len: 2.2, r: 0.17, h: 2.7 },
  ];
  const limbs = limbs0.map(L => ({ ...L, el: 0.32 + L.el * 0.7, len: L.len * 1.12, h: Math.min(L.h + 0.6, TRUNK_H - 0.05), r: L.r * 1.45 }));
  for (const L of limbs) {
    const dir = V(Math.cos(L.az) * Math.cos(L.el), Math.sin(L.el), Math.sin(L.az) * Math.cos(L.el)).normalize();
    grow(V(0, TRUNK_H - 1.7, -0.05), dir.clone().lerp(UP, 0.05).normalize(), L.len, L.r, 0, UP.clone());
  }

  // ---------- roots ----------
  // Roots grow out of the trunk flare as buttresses, sink into the soil, then spread.
  const trunkR = y => { const t = y / TRUNK_H; return 0.5 + 0.42 * Math.exp(-t * 5.5) - 0.08 * t + 0.3 * Math.exp(-Math.max(y, 0) / 0.3); };
  const CZ = -0.05;
  function rootProfile(r0, t) { return r0 * (1 - 0.9 * Math.pow(t, 0.75)); }
  function lateral(start, az, len, r, depth) {
    const pts = [start.clone()];
    const steps = 9;
    let x = start.x, z = start.z, a = az;
    for (let k = 1; k <= steps; k++) {
      const t = k / steps;
      a += rr(-0.22, 0.22);
      x += Math.cos(a) * len / steps; z += Math.sin(a) * len / steps;
      const rl = rootProfile(r, t);
      // ride just above the soil, half-buried, gently undulating, diving at the tip
      const y = Math.max(start.y * (1 - t) * 0.5, rl * 0.2) + 0.025 * Math.sin(t * 8 + az) * (1 - t) - 0.09 * Math.pow(t, 3);
      pts.push(V(x, y, z));
    }
    const curve = tube(buckets.roots, pts, r, r * 0.1, { density: 18, profile: t => rootProfile(r, t) });
    if (depth < 2) {
      const n = depth === 0 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const t = rr(0.3, 0.65);
        const p = curve.getPointAt(t);
        const side = i === 0 ? (rand() < 0.5 ? -1 : 1) : -1;
        const cr = rootProfile(r, t) * 0.6;
        lateral(V(p.x, cr * 0.25, p.z), az + side * rr(0.45, 0.8), len * rr(0.4, 0.55), cr, depth + 1);
      }
    }
  }
  function buttressRoot(az, len, r) {
    const dx = Math.cos(az), dz = Math.sin(az);
    const pts = [];
    // start deep inside the trunk, then follow its flaring surface down to the ground
    for (const [y, f] of [[1.6, 0.3], [1.1, 0.6], [0.72, 0.8], [0.38, 0.95], [0.14, 1.05]]) {
      const R = trunkR(y) * f;
      pts.push(V(dx * R, y, CZ + dz * R));
    }
    const R0 = trunkR(0.14) * 1.05;
    const steps = 8;
    let x = dx * R0, z = CZ + dz * R0, a = az;
    for (let k = 1; k <= steps; k++) {
      const t = k / steps;
      a += rr(-0.2, 0.2);
      x += Math.cos(a) * len / steps; z += Math.sin(a) * len / steps;
      const rl = rootProfile(r * 0.75, t);
      pts.push(V(x, Math.max(0.18 * (1 - t) * (1 - t), rl * 0.2) + 0.02 * Math.sin(t * 7 + az) - 0.12 * Math.pow(t, 3), z));
    }
    const n = pts.length - 1, flareEnd = 4 / n;
    const prof = t => t < flareEnd
      ? r * (1.4 - 0.65 * Math.pow(t / flareEnd, 0.8))                 // thick where it leaves the trunk
      : rootProfile(r * 0.75, (t - flareEnd) / (1 - flareEnd));
    const curve = tube(buckets.roots, pts, r, r * 0.08, { density: 20, radial: 28, profile: prof });
    TOUR.roots.push({ az, r, p: curve.getPointAt(flareEnd + (1 - flareEnd) * 0.3) });
    for (let i = 0; i < 2; i++) {
      const t = flareEnd + (1 - flareEnd) * rr(0.25, 0.6);
      const p = curve.getPointAt(t);
      const cr = prof(t) * 0.6;
      lateral(V(p.x, cr * 0.25, p.z), az + (i ? -1 : 1) * rr(0.45, 0.8), len * rr(0.35, 0.5), cr, 1);
    }
  }
  const ROOTS = 10;
  for (let i = 0; i < ROOTS; i++) {
    const az = i / ROOTS * Math.PI * 2 + rr(-0.12, 0.12);
    const big = i % 2 === 0;
    buttressRoot(az, big ? rr(2.4, 3.2) : rr(1.4, 2.0), big ? rr(0.22, 0.27) : rr(0.15, 0.19));
  }


  // ---------- hanging vines ----------
  const cand = anchors.filter(a => Math.hypot(a.p.x, a.p.z) > 1.4 && a.p.y > 3.2 && a.p.y < 6.5);
  function vineLoop(A, B) {
    const sag = rr(0.9, 1.7);
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const p = A.clone().lerp(B, t);
      p.y -= sag * 4 * t * (1 - t);
      p.x += Math.sin(t * Math.PI) * rr(-0.03, 0.03);
      pts.push(p);
    }
    TOUR.vines.push({ a: A.clone(), b: B.clone(), mid: pts[7].clone() });
    tube(buckets.vines, pts, 0.02, 0.016, { density: 22, radial: 8, profile: t => 0.016 + 0.006 * Math.sin(t * Math.PI) });
  }
  function vineDrop(A) {
    const L = A.y + 0.05; // reach the ground
    const pts = [A.clone()];
    const p = A.clone();
    const sway = rr(0, 6.28);
    for (let i = 1; i <= 16; i++) {
      p.y -= L / 16;
      p.x += Math.sin(i * 0.7 + sway) * 0.05;
      p.z += Math.cos(i * 0.6 + sway) * 0.04;
      pts.push(p.clone());
    }
    tube(buckets.vines, pts, 0.018, 0.012, { density: 22, radial: 8 });
  }
  const used = new Set();
  let loops = 0; const dropPtsL = [];
  for (let i = 0; i < cand.length && loops < 16; i++) {
    if (used.has(i) || rand() > 0.5) continue;
    const A = cand[i];
    let best = -1, bd = 1e9;
    for (let j = 0; j < cand.length; j++) {
      if (j === i || used.has(j)) continue;
      const d = A.p.distanceTo(cand[j].p);
      if (d > 1.1 && d < 2.0 && d < bd && Math.abs(A.p.y - cand[j].p.y) < 0.8) { bd = d; best = j; }
    }
    if (best >= 0 && dropPtsL.some(q => q.distanceTo(A.p) < 1.0)) continue;
    if (best >= 0) { dropPtsL.push(A.p); vineLoop(A.p, cand[best].p); used.add(i); used.add(best); loops++; }
  }
  let drops = 0; const dropPts = [];
  for (let i = 0; i < cand.length && drops < 16; i++) {
    if (used.has(i) || rand() > 0.3) continue;
    if (dropPts.some(q => q.distanceTo(cand[i].p) < 0.9)) continue;
    dropPts.push(cand[i].p);
    vineDrop(cand[i].p); used.add(i); drops++;
  }


  return { buckets, TOUR, CZ, V };
}

const clamp01 = x => Math.max(0, Math.min(1, x));
const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const dA = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

export function mountTree({ section, canvas, overlay }) {
  const { buckets, TOUR, CZ, V } = buildTree();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min((devicePixelRatio || 1) * 2, 2.5));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 200);
  scene.add(new THREE.HemisphereLight(0xd6d8e0, 0x1a1714, 0.7));
  const key = new THREE.DirectionalLight(0xf6ead8, 2.4); key.position.set(3, 8, 6).normalize().multiplyScalar(40); key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 90 });
  scene.add(key);
  const rimA = new THREE.DirectionalLight(0xf4f1ea, 2.4); rimA.position.set(-6, 5, -8); scene.add(rimA);
  const rimB = new THREE.DirectionalLight(0xdfe4ee, 1.8); rimB.position.set(7, 3, -6); scene.add(rimB);
  const under = new THREE.DirectionalLight(0xffffff, 0.5); under.position.set(0, -2, 6); scene.add(under);

  const M = (name, o = {}) => ENG.material(THREE, new THREE.MeshStandardMaterial({ name, color: 0xffffff, roughness: 0.88, metalness: 0 }), { invert: true, ...o });
  const bark = M('bark'), rootM = M('root'), vineM = M('vine', { lines: false });
  const build = (name, b, mat) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3)); g.setIndex(b.idx); g.computeVertexNormals();
    const m = new THREE.Mesh(g, mat); m.name = name; m.castShadow = true; m.receiveShadow = true; return m;
  };
  const tree = new THREE.Group();
  tree.add(build('trunk', buckets.trunk, bark)); tree.add(build('limbs', buckets.branches, bark));
  tree.add(build('twigs', buckets.twigs, bark)); tree.add(build('roots', buckets.roots, rootM));
  tree.add(build('vines', buckets.vines, vineM));
  const lift = -new THREE.Box3().setFromObject(tree).min.y;
  tree.position.y = lift; tree.updateMatrixWorld(true);
  scene.add(tree); scene.add(ENG.outlines(THREE, tree, 0.9, 0x1a1a1a));
  const soil = new THREE.Mesh(new THREE.CircleGeometry(7, 96), ENG.material(THREE, new THREE.MeshStandardMaterial({ name: 'soil', color: 0x8a8a8a, roughness: 1, transparent: true, depthWrite: false }), { ground: 6.5, lines: false, rim: false, gain: 0.9, gamma: 2.0, invert: true, invBase: 0.0 }));
  soil.rotation.x = -Math.PI / 2; soil.position.set(0, 0.001, CZ); soil.receiveShadow = true; soil.renderOrder = -1; scene.add(soil);
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.16, depthWrite: false }));
  catcher.rotation.x = -Math.PI / 2; catcher.receiveShadow = true; catcher.renderOrder = -2; scene.add(catcher);

  // ---- subjects for each stop ----
  const L = v => v.clone().add(V(0, lift, 0));
  const ang = p => Math.atan2(p.x, p.z - CZ);
  const near = (arr, fn, t) => arr.slice().sort((a, b) => Math.abs(dA(fn(a), t)) - Math.abs(dA(fn(b), t)));
  const AZ0 = -1.746;
  const vines = TOUR.vines.map(v => ({ m: L(v.mid) })).filter(v => Math.hypot(v.m.x, v.m.z - CZ) > 1.4);
  const vine = near(vines, v => ang(v.m), AZ0 - 0.7)[0] || { m: V(2, 4, 0) };
  const nodes = TOUR.nodes.filter(n => n.depth === 0).map(n => ({ q: L(n.p) }));
  const node = near(nodes, n => ang(n.q), AZ0 + 0.8)[0];
  const AZR = AZ0 + 0.1;
  const roots = near(TOUR.roots.filter(r => r.r > 0.2).map(r => ({ q: L(r.p) })), r => ang(r.q), AZR).slice(0, 3)
    .sort((a, b) => dA(ang(b.q), AZR) - dA(ang(a.q), AZR));
  const rc = roots.reduce((s, r) => s.add(r.q), V(0, 0, 0)).multiplyScalar(1 / roots.length).lerp(V(0, 0, CZ), 0.35); rc.y = lift + 0.2;
  const S = [
    { t: V(0, 4.5 + lift * 0.5, CZ), az: AZ0, el: 0.12, d: 37, fov: 30, sx: 0.2, sy: 0 },
    { t: vine.m.clone(), az: ang(vine.m) + 0.25, el: 0.1, d: 6.5, fov: 34, sx: 0.17, sy: 0 },
    { t: node.q.clone(), az: ang(node.q) + 0.25, el: 0.02, d: 7.5, fov: 34, sx: 0.17, sy: 0 },
    { t: rc, az: AZR, el: 0.5, d: 12.5, fov: 34, sx: 0.2, sy: 0.04 },
    { t: V(0, 3.9 + lift * 0.5, CZ), az: AZ0 + 1.15, el: 0.24, d: 35, fov: 30, sx: 0.17, sy: 0 },
  ];
  const MK = [
    { s: [4], p: vine.m, label: 'Valli', dx: 40, dy: -34 },
    { s: [4], p: node.q, label: 'Tana', dx: 40, dy: -34 },
    { s: [4], p: roots[0].q, label: 'PriorFM', dx: 0, dy: 46, rank: true },
    { s: [4], p: roots[1].q, label: 'Grammar', dx: 0, dy: 46, rank: true },
    { s: [4], p: roots[2].q, label: 'PriorSignal', dx: 0, dy: 46, rank: true },
  ];
  const tvP = V(0, lift + 3.0, CZ);
  // leader lines: tree point -> explanation box (roots -> their row in the box)
  const boxEl = k => section.querySelector('[data-box="' + k + '"]');
  const rowEl = i => { const b = boxEl(3); const rows = b ? b.querySelectorAll(':scope > div:last-child > div') : []; return rows[i] || b; };
  const LD = [
    { k: 1, p: vine.m, tg: () => boxEl(1) },
    { k: 2, p: node.q, tg: () => boxEl(2) },
    { k: 3, p: roots[0].q, row: true }, { k: 3, p: roots[1].q, row: true }, { k: 3, p: roots[2].q, row: true },
    { k: 4, p: tvP, tg: () => boxEl(4) },
  ];
  const lsvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lsvg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none';
  overlay.appendChild(lsvg);
  const sv = (tag, at) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in at) e.setAttribute(k, at[k]); lsvg.appendChild(e); return e; };
  LD.forEach(l => { if (l.row) l.tg = () => rowEl(l.ri || 0); });
  for (const l of LD) {
    l.path = sv('path', { fill: 'none', stroke: '#141414', 'stroke-width': 1.5, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 });
    l.cap = sv('circle', { r: 3.5, fill: '#141414', opacity: 0 });
    l.ring = sv('circle', { r: 11, fill: 'none', stroke: '#141414', 'stroke-width': 1, opacity: 0 });
    l.dot = sv('circle', { r: 4, fill: '#141414', opacity: 0 });
    l.ring.style.transformBox = 'fill-box'; l.ring.style.transformOrigin = 'center';
    l.ring.animate([{ transform: 'scale(.35)', opacity: 0.9 }, { transform: 'scale(1.5)', opacity: 0 }], { duration: 1800, iterations: Infinity, easing: 'ease-out' });
  }
  const place = (m, dx, dy) => {
    if (m.dx === dx && m.dy === dy && m.placed) return; m.dx = dx; m.dy = dy; m.placed = true;
    const len = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
    const tx = dx < -1 ? '-100%' : dx > 1 ? '0' : '-50%', ty = Math.abs(dx) <= 1 ? (dy > 0 ? '0' : '-100%') : '-50%';
    m.line.style.width = len + 'px'; m.line.style.transform = 'rotate(' + th + 'rad)';
    m.lab.style.left = dx + 'px'; m.lab.style.top = dy + 'px'; m.lab.style.transform = 'translate(' + tx + ',' + ty + ')';
  };
  for (const m of MK) {
    const w = document.createElement('div');
    w.style.cssText = 'position:absolute;left:0;top:0;opacity:0;will-change:transform,opacity;';
    w.innerHTML = '<div style="position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:50%;border:1px solid #141414;box-sizing:border-box"></div>'
      + '<div style="position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:#141414"></div>'
      + '<div style="position:absolute;left:0;top:0;height:1px;background:#141414;transform-origin:0 50%"></div>'
      + '<div style="position:absolute;font:500 11px/1 \'Geist Mono\',ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;padding:8px 11px;background:#141414;color:#f6f5f2;white-space:nowrap">' + m.label + '</div>';
    overlay.appendChild(w);
    w.firstChild.animate([{ transform: 'scale(.35)', opacity: 0.9 }, { transform: 'scale(1.5)', opacity: 0 }], { duration: 1800, iterations: Infinity, easing: 'ease-out' });
    m.el = w; m.line = w.children[2]; m.lab = w.children[3];
    m.dx0 = m.dx; m.dy0 = m.dy; m.dx = null; place(m, m.dx0, m.dy0);
  }

  const cards = [...section.querySelectorAll('[data-stop]')];
  const rails = [...section.querySelectorAll('[data-rail]')], railFill = section.querySelector('[data-rail-fill]');
  let this_perm = null, frozen = false, W = 1, H = 1, uT = 0, uC = -1, inView = true, dirty = true, last = performance.now(), raf = 0, lastActive = -1;
  const resize = () => { const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height); renderer.setSize(W, H, false); dirty = true; };
  const readScroll = () => { const r = section.getBoundingClientRect(); const span = Math.max(1, r.height - innerHeight); uT = clamp01(-r.top / span) * 4; inView = r.bottom > -50 && r.top < innerHeight + 50; };
  const pos = V(0, 0, 0), tgt = V(0, 0, 0), proj = V(0, 0, 0); let offX = 0, offY = 0;
  function pose(u) {
    let i = Math.min(3, Math.floor(u)), f = u - i;
    const e = u >= 4 ? 1 : ease(clamp01((f - 0.2) / 0.6));
    const A = S[i], B = S[i + 1], bump = Math.sin(Math.PI * e);
    tgt.copy(A.t).lerp(B.t, e);
    const az = A.az + dA(B.az, A.az) * e;
    const el = A.el + (B.el - A.el) * e + bump * 0.12;
    const wide = Math.pow(Math.max(1, 1.3 / (W / H)), 0.85);
    const dd = (k) => S[k].d * (k === 0 || k === 4 ? wide : Math.sqrt(wide));
    const d = Math.exp(Math.log(dd(i)) + (Math.log(dd(i + 1)) - Math.log(dd(i))) * e) * (1 + bump * 0.4);
    pos.set(Math.cos(el) * Math.sin(az) * d, Math.sin(el) * d, Math.cos(el) * Math.cos(az) * d).add(tgt);
    camera.fov = A.fov + (B.fov - A.fov) * e;
    offX = A.sx + (B.sx - A.sx) * e; offY = A.sy + (B.sy - A.sy) * e;
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!frozen) readScroll(); if (!inView) return;
    if (uC < 0) uC = uT;
    const prev = uC; uC += (uT - uC) * (1 - Math.exp(-dt * 5));
    if (Math.abs(uT - uC) < 1e-4) uC = uT;
    if (Math.abs(prev - uC) > 1e-6) dirty = true;
    if (!dirty) return; dirty = false;
    pose(uC);
    camera.aspect = W / H;
    const ox = W > 760 ? W * offX : 0, oy = H * offY;
    if (Math.abs(ox) + Math.abs(oy) > 0.5) camera.setViewOffset(W, H, -ox, oy, W, H); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    camera.position.copy(pos); camera.lookAt(tgt);
    renderer.render(scene, camera);
    const wk = k => 1 - sstep(0.14, 0.3, Math.abs(uC - k));
    for (const c of cards) { const w = wk(+c.dataset.stop); c.style.opacity = w.toFixed(3); c.style.transform = 'translateY(' + ((1 - w) * 16).toFixed(1) + 'px)'; c.style.visibility = w < 0.01 ? 'hidden' : 'visible'; }
    const active = Math.round(uC);
    if (railFill) railFill.style.width = (Math.max(0, Math.min(3, uC - 1)) * 78).toFixed(1) + 'px';
    if (active !== lastActive) { lastActive = active; rails.forEach(r => { const k = +r.dataset.rail, on = k === active, past = k < active; r.style.color = on || past ? '#141414' : '#8f8b84'; const d = r.querySelector('[data-dot]'); if (d) { d.style.background = on || past ? '#141414' : '#f6f5f2'; d.style.transform = on ? 'scale(1.35)' : 'scale(1)'; } }); }
    const orc = overlay.getBoundingClientRect(); if (Math.abs(uC - 3) > 0.5) this_perm = null;
    for (const l of LD) { proj.copy(l.p).project(camera); l.px = (proj.x * 0.5 + 0.5) * W; l.py = (-proj.y * 0.5 + 0.5) * H; l.pz = proj.z; }
    { const roots3 = LD.filter(l => l.row), rows = [0, 1, 2].map(i => { const e = rowEl(i); if (!e) return null; const r = e.getBoundingClientRect(); return [boxEl(3).getBoundingClientRect().right - orc.left + 26, (r.top + r.bottom) / 2 - orc.top]; });
      if (rows.every(Boolean)) {
        const cr = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
        const hit = (p1, p2, p3, p4) => (cr(p1, p2, p3) * cr(p1, p2, p4) < 0) && (cr(p3, p4, p1) * cr(p3, p4, p2) < 0);
        const PERMS = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
        const score = pm => { const seg = pm.map((ri, j) => [rows[ri], [roots3[j].px, roots3[j].py]]); let x = 0; for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (hit(seg[i][0], seg[i][1], seg[j][0], seg[j][1])) x++; let len = 0; seg.forEach(s => len += Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1])); return x * 1e6 + len; };
        let best = this_perm && score(this_perm) < 1e6 ? this_perm : null;
        if (!best) { best = PERMS[0]; let bs = Infinity; for (const pm of PERMS) { const s = score(pm); if (s < bs) { bs = s; best = pm; } } }
        this_perm = best; roots3.forEach((l, j) => { l.ri = best[j]; });
      } }
    for (const l of LD) {
      const w = wk(l.k);
      const px = l.px, py = l.py; proj.z = l.pz;
      const el = w > 0.01 ? l.tg() : null;
      let ok = !!el && proj.z < 1;
      if (ok) {
        const b = el.getBoundingClientRect(), bl = b.left - orc.left, br = b.right - orc.left, bt = b.top - orc.top, bb = b.bottom - orc.top;
        if (px > br + 30) {
          const ex = br, ey = l.row ? (bt + bb) / 2 : Math.max(bt + 34, Math.min(bb - 34, py));
          const kx = ex + 26;
          l.path.setAttribute('d', 'M' + ex.toFixed(1) + ' ' + ey.toFixed(1) + 'H' + kx.toFixed(1) + 'L' + px.toFixed(1) + ' ' + py.toFixed(1));
          l.cap.setAttribute('cx', ex.toFixed(1)); l.cap.setAttribute('cy', ey.toFixed(1));
          const pr = sstep(0.55, 1, w);
          l.path.setAttribute('stroke-dashoffset', (1 - pr).toFixed(3));
          l.cap.setAttribute('opacity', w.toFixed(3));
          const dv = sstep(0.85, 1, w).toFixed(3);
          for (const c of [l.dot, l.ring]) { c.setAttribute('cx', px.toFixed(1)); c.setAttribute('cy', py.toFixed(1)); }
          l.dot.setAttribute('opacity', dv); l.ring.style.visibility = +dv > 0.05 ? 'visible' : 'hidden';
        } else ok = false;
      }
      if (!ok) { l.path.setAttribute('stroke-dashoffset', 1); l.cap.setAttribute('opacity', 0); l.dot.setAttribute('opacity', 0); l.ring.style.visibility = 'hidden'; }
    }
    for (const m of MK) { proj.copy(m.p).project(camera); m.sx = (proj.x * 0.5 + 0.5) * W; m.sy = (-proj.y * 0.5 + 0.5) * H; m.front = proj.z < 1; }
    const ranked = MK.filter(m => m.rank).sort((a, b) => a.sy - b.sy);
    if (ranked.length) {
      const colX = Math.max(...ranked.map(m => m.sx)) + 90;
      const midY = ranked.reduce((s, m) => s + m.sy, 0) / ranked.length;
      ranked.forEach((m, i) => place(m, Math.round(colX - m.sx), Math.round(midY + (i - (ranked.length - 1) / 2) * 38 - m.sy)));
    }
    const maxX = W - 150;
    for (const m of MK) {
      if (m.rank) continue;
      const ext = m.sx + m.dx0 + (m.dx0 > 1 ? 110 : m.dx0 < -1 ? 0 : 55);
      if (ext <= maxX) place(m, m.dx0, m.dy0);
      else if (m.dx0 > 1) place(m, -m.dx0, m.dy0);
      else place(m, Math.round(maxX - ext), m.dy0);
    }
    for (const m of MK) {
      const w = Math.max(...m.s.map(wk));
      const vis = w > 0.01 && m.front;
      m.el.style.opacity = vis ? w.toFixed(3) : '0';
      if (vis) m.el.style.transform = 'translate(' + m.sx.toFixed(1) + 'px,' + m.sy.toFixed(1) + 'px)';
    }
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  raf = requestAnimationFrame(frame);
  return {
    seek(u) { frozen = true; inView = true; uT = uC = u; dirty = true; cancelAnimationFrame(raf); frame(performance.now()); },
    unfreeze() { frozen = false; },
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); overlay.innerHTML = ''; },
  };
}
