/**
 * The two SVG filters that give the light half of the page its hand-drawn edge.
 *
 * `rough` is the shared one: fractal noise displacing whatever it is applied to,
 * with an animated seed so lines shimmer very slightly — the "boil" of hand-drawn
 * animation. `om-morph` is the same idea without the boil, because the morph
 * illustration animates its own displacement scale down to zero as it resolves
 * into a typeset diagram.
 */
export function RoughFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="rough" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves="2"
            seed="7"
            result="n"
          >
            <animate
              attributeName="seed"
              values="7;3;11;5;9"
              dur="0.75s"
              calcMode="discrete"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            id="om-rough-disp"
            in="SourceGraphic"
            in2="n"
            scale="3.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter id="om-morph" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.026"
            numOctaves="2"
            seed="5"
            result="mn"
          />
          <feDisplacementMap
            id="om-morph-disp"
            in="SourceGraphic"
            in2="mn"
            scale="3.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
