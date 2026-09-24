import { color, font } from './theme';
import { useSceneMotion } from './hooks/useSceneMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useSurfaceFx } from './hooks/useSurfaceFx';

import { RoughFilters } from './components/RoughFilters';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { MorphAnchor } from './components/MorphAnchor';
import { ModelSteps } from './components/ModelSteps';
import { Benchmarks } from './components/Benchmarks';
import { ApiSection } from './components/ApiSection';
import { Pricing } from './components/Pricing';
import { Cta } from './components/Cta';
import { Footer } from './components/Footer';

export type LandingPageProps = {
  /** Displacement scale of the hand-drawn filter. 0 is a clean line, 8 is very loose. */
  roughness?: number;
  /** Animate the rough filter's seed, so strokes shimmer as hand-drawn animation does. */
  lineBoil?: boolean;
  /** Global multiplier on parallax. 0 pins the scenery. */
  parallax?: number;
  /** Whether the pricing section renders. */
  showPricing?: boolean;
};

/**
 * The Vallix Labs landing page.
 *
 * The page is one continuous argument told through its own surface: it opens as a
 * hand-drawn notebook — the state of tabular ML as sketched pipelines and margin
 * doodles — and at "So we stopped drawing pipelines and trained one model instead"
 * the ground, the type and the illustration all resolve into a typeset technical
 * document. The transition is not decoration; it *is* the thesis.
 *
 * The four props above are the design file's own controls, kept so the scene stays
 * tunable rather than baked in.
 */
export default function LandingPage({
  roughness = 3.4,
  lineBoil = true,
  parallax = 1,
  showPricing = true,
}: LandingPageProps) {
  useSmoothScroll();
  useSceneMotion({ roughness, lineBoil, parallax });
  useSurfaceFx();

  return (
    <div
      style={{
        position: 'relative',
        // The brand navy, not a darker near-black: the paper ground fades straight
        // into the dark half, so anything darker sitting behind it reads as a black
        // flash partway through the transition.
        background: color.ink,
        fontFamily: font.sans,
        overflowX: 'hidden',
      }}
    >
      <RoughFilters />

      {/* The paper ground. Fixed and full-bleed, its opacity ramped from 1 to 0 by
          useSceneMotion as the morph section crosses the viewport — which is what
          turns the whole page from light to dark in one continuous move. */}
      <div
        id="om-paper"
        style={{
          position: 'fixed',
          inset: 0,
          background: color.paper,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />


      {/* The grain, immediately above the ground and below everything else.
          It is part of the paper, not a film over the page: the illustrations, the
          cards and the type sit *on* the textured ground rather than being textured
          themselves, which is how ink on paper actually behaves. `useSceneMotion`
          drives its opacity from the same ramp as the ground, so the texture leaves
          exactly when the paper does. */}
      <div
        id="om-grain"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          // Same stacking level as the ground and later in the DOM, so it paints
          // over the paper while staying under the content at zIndex 1.
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'url(/grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          mixBlendMode: 'multiply',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <Hero />
        <Problem />
        <MorphAnchor />
        <ModelSteps />
        <Benchmarks />
        <ApiSection />
        {showPricing && <Pricing />}
        <Cta />
        <Footer />
      </div>
    </div>
  );
}
