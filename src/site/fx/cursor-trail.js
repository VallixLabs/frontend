// Black ink trail that follows the cursor and fades.
export function cursorTrail(opt = {}) {
  if (matchMedia('(pointer: coarse)').matches) return () => {};
  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  document.body.appendChild(c);
  const g = c.getContext('2d');
  const LIFE = opt.life || 520, DASH = opt.dash || [7, 6], COLOR = opt.color || '20,20,20';
  let pts = [], raf = 0, W = 0, H = 0, dpr = 1;
  const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; };
  const move = e => { pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (!raf) raf = requestAnimationFrame(draw); };
  function draw(now) {
    pts = pts.filter(p => now - p.t < LIFE);
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    if (pts.length > 1) {
      g.lineCap = 'round'; g.lineJoin = 'round';
      // dash offset tied to path length so dashes stay fixed in place
      let off = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const k = 1 - (now - b.t) / LIFE;
        g.strokeStyle = `rgba(${COLOR},${(k * 0.9).toFixed(3)})`;
        g.lineWidth = 1 + 2.2 * k;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        off += Math.hypot(b.x - a.x, b.y - a.y);
      }
    }
    raf = pts.length ? requestAnimationFrame(draw) : 0;
    if (!raf) g.clearRect(0, 0, W, H);
  }
  resize(); addEventListener('resize', resize); addEventListener('pointermove', move, { passive: true });
  return () => { removeEventListener('resize', resize); removeEventListener('pointermove', move); cancelAnimationFrame(raf); c.remove(); };
}
