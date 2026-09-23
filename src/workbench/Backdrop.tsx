import { wb } from './theme';

const doodles = [
  { w: 230, style: { left: '14%', top: '16%', transform: 'rotate(-7deg)' }, d: <><path d="M14 24 H106 V100 H14 Z" /><path d="M14 44 H106 M14 66 H106 M14 84 H106 M46 24 V100 M76 24 V100" /></> },
  { w: 170, style: { right: '9%', top: '9%', transform: 'rotate(9deg)' }, d: <path d="M30 84 C 16 84, 14 66, 28 63 C 26 44, 50 36, 59 50 C 70 38, 94 47, 91 63 C 104 65, 102 84, 88 84 Z" /> },
  { w: 150, style: { right: '22%', bottom: '8%', transform: 'rotate(-12deg)' }, d: <><circle cx="60" cy="60" r="24" /><circle cx="60" cy="60" r="9" /><path d="M60 20 V32 M60 88 V100 M20 60 H32 M88 60 H100 M32 32 L41 41 M79 79 L88 88 M88 32 L79 41 M41 79 L32 88" /></> },
  { w: 130, style: { left: '8%', bottom: '12%', transform: 'rotate(6deg)' }, d: <path d="M58 24 L64 50 L90 56 L64 62 L58 88 L52 62 L26 56 L52 50 Z" /> },
  { w: 140, style: { left: '46%', bottom: '26%', transform: 'rotate(-4deg)' }, d: <><ellipse cx="60" cy="30" rx="34" ry="12" /><path d="M26 30 V56 M94 30 V56" /><ellipse cx="60" cy="56" rx="34" ry="12" /><path d="M26 56 V82 M94 56 V82" /><ellipse cx="60" cy="82" rx="34" ry="12" /></> },
];

/**
 * Fixed background: warm amber bloom over a near-black gradient, with the landing
 * page's hand-drawn doodles carried through at very low opacity. They are the one
 * thread tying the workbench back to the marketing half of the brand.
 */
export function Backdrop() {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="wbRough" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="9" result="wn" />
            <feDisplacementMap in="SourceGraphic" in2="wn" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(58% 44% at 18% 8%, rgba(133, 152, 87,0.16) 0%, rgba(133, 152, 87,0) 70%), radial-gradient(50% 40% at 88% 22%, rgba(133, 152, 87,0.12) 0%, rgba(133, 152, 87,0) 72%), radial-gradient(64% 50% at 62% 96%, rgba(133, 152, 87,0.08) 0%, rgba(133, 152, 87,0) 74%), linear-gradient(180deg,#262f37 0%, #1b222a 100%)',
        }}
      />

      <div
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.1, color: wb.acc }}
        aria-hidden="true"
      >
        {doodles.map((doodle, i) => (
          <svg
            key={i}
            viewBox="0 0 120 120"
            width={doodle.w}
            height={doodle.w}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            filter="url(#wbRough)"
            style={{ position: 'absolute', ...doodle.style }}
          >
            {doodle.d}
          </svg>
        ))}
      </div>
    </>
  );
}
