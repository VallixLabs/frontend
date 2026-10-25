import type { CSSProperties } from 'react';

/** The grid the "V" is drawn on, in the logo's own 1830×705 coordinates. */
export function LogoGridPaths() {
  return (
    <>
      <path d="M169 66H1327V695H169Z" />
      <path d="M169 379L1327 390" />
      <path d="M460 66V695" />
      <path d="M1015 66V695" />
      <path d="M679 385V695" />
      <path d="M842 386V695" />
      <path d="M1115 388V695" />
    </>
  );
}

/** Grid, V and wordmark stacked: the full Vallix Labs lockup at the given box size. */
export function Logo({ width, height, style }: { width: number; height: number; style?: CSSProperties }) {
  const fill: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
  return (
    <div style={{ position: 'relative', height, width, flex: 'none', ...style }}>
      <svg viewBox="0 0 1830 705" style={fill}>
        <g fill="none" stroke="#bdb9b2" strokeWidth={11}><LogoGridPaths /></g>
      </svg>
      <img src="/logo-v.png" alt="" style={fill} />
      <img src="/logo-text.png" alt="Vallix Labs" style={fill} />
    </div>
  );
}
