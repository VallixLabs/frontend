import type { CSSProperties } from 'react';

/**
 * The parallax scenery behind the hero: ghosted grids, the annotated data table,
 * and a scatter of margin doodles.
 *
 * Every child carries the `data-par` family of attributes read by `useSceneMotion`
 * — scroll speed and its cap, a float amplitude and rate, pointer response, and a
 * rotation amount. `data-deco="small"` marks the doodles that are dropped at narrow
 * widths; the table and the labels are handled separately because they carry
 * meaning rather than texture.
 */

type ParProps = {
  par: number;
  parMax: number;
  float?: number;
  floatSpeed?: number;
  mouse?: number;
  rot?: number;
  rot0?: number;
  deco?: 'small' | 'label' | 'table';
  style: CSSProperties;
  children: React.ReactNode;
  id?: string;
};

export function Par({
  par,
  parMax,
  float,
  floatSpeed,
  mouse,
  rot,
  rot0,
  deco,
  style,
  children,
  id,
}: ParProps) {
  return (
    <div
      id={id}
      data-par={par}
      data-par-max={parMax}
      data-float={float}
      data-float-speed={floatSpeed}
      data-mouse={mouse}
      data-rot={rot}
      data-rot0={rot0}
      data-deco={deco}
      style={style}
    >
      {children}
    </div>
  );
}

const sketch = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.6,
  strokeLinecap: 'round',
  filter: 'url(#rough)',
} as const;

export function HeroDecor() {
  return (
    <div
      id="om-deco-layer"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: -260,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <Par
        par={0.16}
        parMax={180}
        float={14}
        floatSpeed={0.35}
        mouse={26}
        rot={2.4}
        style={{ position: 'absolute', right: '-14%', top: '4%', width: '74%', opacity: 0.16, color: '#252525' }}
      >
        <svg viewBox="0 0 620 460" style={{ width: '100%', display: 'block' }} {...sketch} strokeWidth="2.4" transform="rotate(-4)">
          <path d="M20 30 H600 V430 H20 Z" />
          <path d="M20 86 H600 M20 142 H600 M20 198 H600 M20 254 H600 M20 310 H600 M20 370 H600 M165 30 V430 M310 30 V430 M455 30 V430" />
        </svg>
      </Par>

      <Par
        par={-0.1}
        parMax={150}
        float={10}
        floatSpeed={0.5}
        mouse={-40}
        rot={-3}
        style={{ position: 'absolute', left: '-8%', bottom: '-6%', width: '46%', opacity: 0.12, color: '#252525' }}
      >
        <svg viewBox="0 0 460 340" style={{ width: '100%', display: 'block' }} {...sketch}>
          <path d="M16 24 H444 V316 H16 Z" />
          <path d="M16 82 H444 M16 140 H444 M16 198 H444 M16 258 H444 M160 24 V316 M300 24 V316" />
        </svg>
      </Par>

      {/* The hero's centrepiece: a table with a null, a query mark, and a side panel
          of predictions with error bars — the whole product in one drawing. */}
      <Par
        id="om-hero-table"
        par={-0.26}
        parMax={260}
        float={22}
        floatSpeed={0.42}
        mouse={60}
        rot={3.5}
        deco="table"
        style={{ position: 'absolute', right: 0, top: '15%', width: 'min(760px,56vw)' }}
      >
        <svg
          viewBox="0 0 640 470"
          style={{ width: '100%', display: 'block' }}
          fill="none"
          stroke="#252525"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#rough)"
        >
          <path d="M24 54 H452 V444 H24 Z" fill="#E3E3E3" />
          <path d="M24 54 H452 V104 H24 Z" fill="#8A8A8A" opacity="0.55" stroke="none" />
          <path d="M24 104 H452 M24 152 H452 M24 200 H452 M24 248 H452 M24 296 H452 M24 344 H452 M24 396 H452" />
          <path d="M131 54 V444 M238 54 V444 M345 54 V444" />
          <path d="M42 82 H104 M148 82 H214 M256 82 H318 M364 82 H432" strokeWidth="2.4" />
          <path d="M24 248 H452 V296 H24 Z" fill="#8A8A8A" opacity="0.16" stroke="none" />
          <path d="M42 130 H112 M148 130 H210 M256 130 H310 M364 130 H420" strokeWidth="1.8" opacity="0.7" />
          <path d="M42 178 H100 M148 178 H186 M364 178 H414" strokeWidth="1.8" opacity="0.7" />
          <path d="M262 168 L288 190 M288 168 L262 190" stroke="#3F3F3F" strokeWidth="3.2" />
          <path d="M42 226 H118 M148 226 H196 M256 226 H322 M364 226 H400" strokeWidth="1.8" opacity="0.7" />
          <path d="M42 274 H96 M256 274 H300 M364 274 H424" strokeWidth="1.8" opacity="0.7" />
          <path d="M156 262 C 156 250, 186 250, 186 264 C 186 276, 171 274, 171 286" stroke="#3F3F3F" strokeWidth="2.8" />
          <path d="M171 296 L171 298" stroke="#3F3F3F" strokeWidth="3.4" />
          <path d="M42 322 H124 M148 322 H204 M256 322 H296 M364 322 H408" strokeWidth="1.8" opacity="0.7" />
          <path d="M42 372 H104 M148 372 H190 M256 372 H326 M364 372 H396" strokeWidth="1.8" opacity="0.7" />
          <path d="M42 420 H112 M148 420 H180 M256 420 H308 M364 420 H430" strokeWidth="1.8" opacity="0.7" />
          <path d="M468 66 H612 V438 H468 Z" fill="#8F8F8F" opacity="0.2" stroke="none" />
          <path d="M468 66 H612 V438 H468 Z" stroke="#8F8F8F" />
          <path d="M468 116 H612" stroke="#8F8F8F" strokeWidth="2.2" />
          <path d="M482 94 H556" stroke="#8F8F8F" strokeWidth="2.4" />
          <path d="M482 142 H586 M482 190 H528 M482 238 H600 M482 286 H548 M482 334 H570 M482 382 H514 M482 424 H562" stroke="#8F8F8F" strokeWidth="8" opacity="0.85" />
          <path d="M586 134 V150 M528 182 V198 M600 230 V246 M548 278 V294 M570 326 V342 M514 374 V390 M562 416 V432" stroke="#252525" strokeWidth="1.6" opacity="0.5" />
          <path d="M578 134 H594 M578 150 H594 M520 182 H536 M520 198 H536 M592 230 H608 M592 246 H608 M540 278 H556 M540 294 H556" stroke="#252525" strokeWidth="1.4" opacity="0.45" />
          <path d="M520 34 C 536 12, 590 14, 596 40" stroke="#C2712B" strokeWidth="2.4" />
          <path d="M596 40 L586 30 M596 40 L602 28" stroke="#C2712B" strokeWidth="2.4" />
        </svg>
      </Par>

      <Par par={0.5} parMax={300} float={18} floatSpeed={0.7} mouse={-70} rot={9} deco="small"
        style={{ position: 'absolute', right: '34%', top: '3%', color: '#9B9B9B' }}>
        <svg viewBox="0 0 120 120" width="104" height="104" {...sketch}>
          <ellipse cx="60" cy="30" rx="34" ry="12" />
          <path d="M26 30 V56 M94 30 V56" />
          <ellipse cx="60" cy="56" rx="34" ry="12" />
          <path d="M26 56 V82 M94 56 V82" />
          <ellipse cx="60" cy="82" rx="34" ry="12" />
        </svg>
      </Par>

      <Par par={-0.62} parMax={320} float={26} floatSpeed={0.9} mouse={90} rot={-14} deco="small"
        style={{ position: 'absolute', right: '12%', top: '1%', color: '#8A8A8A' }}>
        <svg viewBox="0 0 120 120" width="86" height="86" {...sketch} strokeWidth="2.4">
          <path d="M58 24 L64 50 L90 56 L64 62 L58 88 L52 62 L26 56 L52 50 Z" />
          <path d="M92 26 L95 34 L103 37 L95 40 L92 48 L89 40 L81 37 L89 34 Z" />
        </svg>
      </Par>

      <Par par={0.42} parMax={300} float={20} floatSpeed={0.55} mouse={-48} rot={7} deco="small"
        style={{ position: 'absolute', right: '8%', bottom: '2%', color: '#8F8F8F' }}>
        <svg viewBox="0 0 120 120" width="92" height="92" {...sketch}>
          <path d="M30 84 C 16 84, 14 66, 28 63 C 26 44, 50 36, 59 50 C 70 38, 94 47, 91 63 C 104 65, 102 84, 88 84 Z" />
        </svg>
      </Par>

      <Par par={-0.44} parMax={300} float={16} floatSpeed={0.8} mouse={54} rot={-10} deco="small"
        style={{ position: 'absolute', left: '8%', bottom: '22%', color: '#9B9B9B' }}>
        <svg viewBox="0 0 120 120" width="70" height="70" {...sketch}>
          <circle cx="60" cy="60" r="24" />
          <circle cx="60" cy="60" r="9" />
          <path d="M60 20 V32 M60 88 V100 M20 60 H32 M88 60 H100 M32 32 L41 41 M79 79 L88 88 M88 32 L79 41 M41 79 L32 88" />
        </svg>
      </Par>

      <Par par={0.7} parMax={340} float={24} floatSpeed={1.05} mouse={-96} rot={16} deco="small"
        style={{ position: 'absolute', left: '56%', top: '10%', color: '#C2712B' }}>
        <svg viewBox="0 0 120 120" width="64" height="64" {...sketch}>
          <path d="M18 82 C 34 34, 74 24, 98 46" />
          <path d="M98 46 L84 42 M98 46 L94 58" />
        </svg>
      </Par>

      <Par par={-0.34} parMax={280} float={12} floatSpeed={0.62} mouse={44} rot={-6} deco="small"
        style={{ position: 'absolute', right: '3%', bottom: '12%', color: '#9B9B9B' }}>
        <svg viewBox="0 0 120 120" width="78" height="78" {...sketch}>
          <circle cx="52" cy="50" r="30" />
          <path d="M73 71 L100 100" strokeWidth="3.4" />
          <path d="M38 50 H66 M52 36 V64" strokeWidth="2" />
        </svg>
      </Par>

      <Par par={0.3} parMax={260} float={15} floatSpeed={0.48} mouse={-34} rot={5} deco="small"
        style={{ position: 'absolute', left: '41%', top: '24%', color: '#9B9B9B' }}>
        <svg viewBox="0 0 120 120" width="60" height="60" {...sketch}>
          <path d="M18 22 V100 H104" />
          <path d="M32 100 V74 M52 100 V56 M72 100 V82 M92 100 V40" strokeWidth="10" />
        </svg>
      </Par>
    </div>
  );
}
