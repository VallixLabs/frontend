import { useEffect, useRef, useState } from 'react';

import { color, font } from '../theme';
import { getLenis } from '../hooks/useSmoothScroll';

const RUNWAY_VH = 210;   // total scroll length: expansion, then the hold
const ASPECT = 16 / 9;   // the source is 1920x1080
const START_WIDTH = 0.9; // 90% of the viewport before it takes over
const SNAP_WINDOW = 0.34; // how near the top counts as "close enough to snap"
const IDLE_MS = 110;      // scrolling considered stopped after this
const FADE_VH = 0.3;      // the last 30% of a screen fades the sound out

/**
 * The video, and the scroll sequence that hands the page from paper to navy.
 *
 * It begins inline at 90% width, centred. As the section's top rises past 70% of
 * the viewport it grows to fill the screen and starts playing; when the top comes
 * near the top of the screen the scroll snaps it flush and it holds there for the
 * length of the runway, then releases onto the dark ground.
 *
 * This is also where the ground changes: `useSceneMotion` reads this section's
 * position to fade the paper and its grain out, so everything after the video is
 * navy and the morph section below keeps only its text and illustration
 * animations.
 *
 * Geometry is computed in pixels each frame rather than as percentages: the box
 * travels from a 16:9 letterbox to whatever aspect the viewport happens to be, and
 * those two cannot be interpolated in a single CSS unit.
 */
export function VideoScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let raf = 0;
    let playing = false;
    let idle: number | undefined;
    let lastTop = Number.NaN;

    /**
     * Autoplay with sound is refused by every browser until the page has been
     * interacted with, so this asks for it, and on refusal falls back to muted
     * playback and offers the viewer a control. Retrying on the first real click
     * costs nothing and usually succeeds.
     */
    const tryPlay = async (video: HTMLVideoElement) => {
      video.muted = false;
      try {
        await video.play();
        setBlocked(false);
      } catch {
        video.muted = true;
        setBlocked(true);
        try {
          await video.play();
        } catch {
          /* still refused: the poster frame stands in until the viewer acts */
        }
      }
    };

    const onFirstGesture = () => {
      const video = videoRef.current;
      if (video && playing && video.muted) void tryPlay(video);
    };
    document.addEventListener('pointerdown', onFirstGesture, { once: true });

    const frame = () => {
      const section = sectionRef.current;
      const box = frameRef.current;
      const video = videoRef.current;
      if (section && box) {
        const vh = window.innerHeight || 900;
        const vw = window.innerWidth || 1280;
        const top = section.getBoundingClientRect().top;

        // 0 while the section's top is still below 70% of the viewport, 1 once it
        // has reached the top. Clamped, so it stays at 1 for the rest of the page.
        const e = Math.max(0, Math.min(1, (vh * 0.7 - top) / (vh * 0.7)));
        const eased = e * e * (3 - 2 * e);

        const startW = vw * START_WIDTH;
        const startH = startW / ASPECT;
        box.style.width = `${startW + (vw - startW) * eased}px`;
        box.style.height = `${startH + (vh - startH) * eased}px`;
        box.style.borderRadius = `${(1 - eased) * 4}px`;

        // Snap the section flush to the top of the screen once scrolling settles
        // near it. Done on idle rather than continuously, so it never fights a
        // scroll in progress; Lenis owns the scroll here, so it does the move.
        if (top !== lastTop) {
          lastTop = top;
          window.clearTimeout(idle);
          idle = window.setTimeout(() => {
            const t = section.getBoundingClientRect().top;
            if (Math.abs(t) < vh * SNAP_WINDOW && Math.abs(t) > 1) {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(section, { offset: 0, duration: 0.55 });
              else window.scrollBy({ top: t, behavior: 'smooth' });
            }
          }, IDLE_MS);
        }

        if (video) {
          // How far past the end of the hold we are, 0 until the last stretch of
          // it. The sound is ramped down across that stretch rather than cut, and
          // the video stops once it is fully out.
          const release = -(section.offsetHeight - vh);
          const tail = Math.max(0, Math.min(1, (top - release) / (vh * FADE_VH)));
          const shouldPlay = e > 0.5 && tail > 0;
          if (shouldPlay && !playing) {
            playing = true;
            void tryPlay(video);
          } else if (!shouldPlay && playing) {
            playing = false;
            video.pause();
          }
          if (playing) video.volume = tail;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      document.removeEventListener('pointerdown', onFirstGesture);
    };
  }, []);

  return (
    <section
      id="om-video"
      ref={sectionRef}
      style={{ position: 'relative', height: `${RUNWAY_VH}vh`, zIndex: 1 }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={frameRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: color.ink,
            boxShadow: '0 40px 90px -40px rgba(0,0,0,0.55)',
          }}
        >
          <video
            ref={videoRef}
            src="/vallix.mp4"
            loop
            playsInline
            preload="metadata"
            aria-label="Vallix Labs"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {blocked && (
            <button
              type="button"
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = false;
                void v.play().then(() => setBlocked(false)).catch(() => {});
              }}
              style={{
                all: 'unset',
                position: 'absolute',
                right: 18,
                bottom: 18,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 15px',
                background: 'rgba(33,41,48,0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: color.accent,
                fontFamily: font.sans,
                fontSize: 13,
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z" />
                <path d="M16 9.5 C17.6 11 17.6 13 16 14.5 M18.6 7 C21.2 9.6 21.2 14.4 18.6 17" />
              </svg>
              Sound
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
