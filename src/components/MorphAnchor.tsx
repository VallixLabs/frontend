import { color, font } from '../theme';

/**
 * The hinge of the page.
 *
 * Scrolling through this section swaps the ground from paper to ink, wipes the
 * handwritten headline out from under a typeset copy of itself, and resolves the
 * sketched table-and-blob illustration into a structured diagram. All three are
 * driven from `useSceneMotion`; everything here is the markup it reaches for.
 *
 * The two headline copies are stacked and masked with complementary gradients —
 * a wipe, not a crossfade, so the handwriting is *overwritten* rather than faded
 * through an illegible mid-state. Same treatment for the lede.
 *
 * Paths carrying `data-d0` / `data-d1` are interpolated between a hand-drawn form
 * and a geometric one. The two must share a command skeleton; `lerpPath` checks.
 */

const HEADLINE = ['So we stopped drawing pipelines', 'and trained one model instead.'];

const LEDE =
  'Vallix-1 is pre-trained on 200M synthetic tables spanning realistic causal structures. It learns in-context: your rows are the prompt, your target column is the question.';

const headlineStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: font.hand,
  fontSize: 'clamp(34px,4.2vw,56px)',
  lineHeight: 1.22,
  fontWeight: 700,
};

const ledeStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: font.hand,
  fontSize: 26,
  lineHeight: 1.3,
  textWrap: 'pretty',
};

export function MorphAnchor() {
  return (
    <section
      id="om-anchor"
      className="v-gutter"
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1180,
        margin: '0 auto',
        padding: '60px 48px 230px',
        textAlign: 'center',
      }}
    >
      {/* full-bleed ramp into the dark half */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '100vw',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: -1,
          background:
            'linear-gradient(to bottom, rgba(33,41,48,0) 0%, rgba(33,41,48,0.55) 55%, #212930 100%)',
        }}
      />

      <div id="om-morph-head" style={{ position: 'relative', marginBottom: 24 }}>
        <h2 id="om-morph-doodle" style={{ ...headlineStyle, color: color.ink }}>
          {HEADLINE.map((line, i) => (
            <span
              key={i}
              data-line={i}
              style={{
                display: 'block',
                WebkitMaskImage: 'linear-gradient(to right, transparent -7%, #000 7%)',
                maskImage: 'linear-gradient(to right, transparent -7%, #000 7%)',
              }}
            >
              {line}
            </span>
          ))}
        </h2>
        <h2
          id="om-morph-doodle-light"
          style={{ ...headlineStyle, position: 'absolute', inset: 0, color: color.textBright }}
        >
          {HEADLINE.map((line, i) => (
            <span
              key={i}
              data-line={i}
              style={{
                display: 'block',
                WebkitMaskImage: 'linear-gradient(to right, #000 -7%, transparent 7%)',
                maskImage: 'linear-gradient(to right, #000 -7%, transparent 7%)',
              }}
            >
              {line}
            </span>
          ))}
        </h2>
      </div>

      <div
        id="om-morph-lede"
        style={{ position: 'relative', maxWidth: '54ch', margin: '0 auto 56px' }}
      >
        <p
          data-line="0"
          style={{
            ...ledeStyle,
            color: color.ink,
            WebkitMaskImage: 'linear-gradient(to right, transparent -7%, #000 7%)',
            maskImage: 'linear-gradient(to right, transparent -7%, #000 7%)',
          }}
        >
          {LEDE}
        </p>
        <p
          data-line="0"
          data-lede-light="1"
          style={{
            ...ledeStyle,
            position: 'absolute',
            inset: 0,
            color: color.textBody,
            WebkitMaskImage: 'linear-gradient(to right, #000 -7%, transparent 7%)',
            maskImage: 'linear-gradient(to right, #000 -7%, transparent 7%)',
          }}
        >
          {LEDE}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0 10px',
        }}
      >
        <svg
          id="om-morph-svg"
          viewBox="0 0 1120 600"
          style={{ width: '100%', maxWidth: 1120, display: 'block' }}
          fill="none"
          stroke="#212930"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#om-morph)"
        >
          <path data-morph="fill-paper" fill="#ebece9" stroke="none" d="M28 74 H400 V462 H28 Z" />
          <path data-morph="accent-fill" fill="#777c7e" stroke="none" d="M28 74 H400 V126 H28 Z" />
          <path data-morph="stroke" d="M28 74 H400 V462 H28 Z" />
          <path data-morph="stroke" d="M28 126 H400 M28 182 H400 M28 238 H400 M28 294 H400 M28 350 H400 M28 406 H400 M152 74 V462 M276 74 V462" />
          <path data-morph="stroke-dim" d="M44 100 H120 M168 100 H252 M292 100 H384" strokeWidth="3.4" />
          <path data-morph="stroke-dim" d="M44 154 H112 M168 154 H240 M292 154 H370 M44 210 H98 M168 210 H252 M292 210 H352 M44 266 H124 M168 266 H222 M292 266 H378 M44 322 H90 M168 322 H244 M292 322 H344 M44 378 H118 M168 378 H210 M292 378 H372 M44 434 H104 M168 434 H236 M292 434 H360" strokeWidth="2.6" />

          <path data-morph="stroke-accent" d="M448 200 C 484 152, 520 250, 556 200" data-d0="M448 200 C 484 152, 520 250, 556 200" data-d1="M448 200 C 484 200, 520 200, 556 200" />
          <path data-morph="stroke-accent" d="M556 200 L540 188 M556 200 L544 214" data-d0="M556 200 L540 188 M556 200 L544 214" data-d1="M556 200 L544 194 M556 200 L544 206" />
          <path data-morph="stroke-accent" d="M448 330 C 488 378, 524 282, 556 330" data-d0="M448 330 C 488 378, 524 282, 556 330" data-d1="M448 330 C 484 330, 520 330, 556 330" />
          <path data-morph="stroke-accent" d="M556 330 L541 318 M556 330 L545 344" data-d0="M556 330 L541 318 M556 330 L545 344" data-d1="M556 330 L544 324 M556 330 L544 336" />

          <path data-morph="fill-soft" d="M590 118 C 562 112, 570 74, 596 76 C 602 38, 660 32, 670 66 C 712 38, 750 76, 728 116 C 690 126, 630 128, 590 118 Z" data-d0="M590 118 C 562 112, 570 74, 596 76 C 602 38, 660 32, 670 66 C 712 38, 750 76, 728 116 C 690 126, 630 128, 590 118 Z" data-d1="M590 118 C 636 118, 682 118, 728 118 C 728 90, 728 62, 728 34 C 682 34, 636 34, 590 34 C 590 62, 590 90, 590 118 Z" stroke="none" fill="#a7acaa" />
          <path data-morph="stroke" d="M590 118 C 562 112, 570 74, 596 76 C 602 38, 660 32, 670 66 C 712 38, 750 76, 728 116 C 690 126, 630 128, 590 118 Z" data-d0="M590 118 C 562 112, 570 74, 596 76 C 602 38, 660 32, 670 66 C 712 38, 750 76, 728 116 C 690 126, 630 128, 590 118 Z" data-d1="M590 118 C 636 118, 682 118, 728 118 C 728 90, 728 62, 728 34 C 682 34, 636 34, 590 34 C 590 62, 590 90, 590 118 Z" />

          <path data-morph="fill-soft" d="M776 128 C 872 96, 1026 150, 1052 128 C 1084 232, 1030 330, 1052 434 C 950 466, 856 402, 776 434 C 744 330, 800 232, 776 128 Z" data-d0="M776 128 C 872 96, 1026 150, 1052 128 C 1084 232, 1030 330, 1052 434 C 950 466, 856 402, 776 434 C 744 330, 800 232, 776 128 Z" data-d1="M776 128 C 868 128, 960 128, 1052 128 C 1052 230, 1052 332, 1052 434 C 960 434, 868 434, 776 434 C 776 332, 776 230, 776 128 Z" stroke="none" fill="#a7acaa" />
          <path data-morph="stroke" d="M776 128 C 872 96, 1026 150, 1052 128 C 1084 232, 1030 330, 1052 434 C 950 466, 856 402, 776 434 C 744 330, 800 232, 776 128 Z" data-d0="M776 128 C 872 96, 1026 150, 1052 128 C 1084 232, 1030 330, 1052 434 C 950 466, 856 402, 776 434 C 744 330, 800 232, 776 128 Z" data-d1="M776 128 C 868 128, 960 128, 1052 128 C 1052 230, 1052 332, 1052 434 C 960 434, 868 434, 776 434 C 776 332, 776 230, 776 128 Z" />

          <circle data-morph="node" cx="838" cy="196" r="11" />
          <circle data-morph="node" cx="990" cy="196" r="11" />
          <circle data-morph="node" cx="838" cy="368" r="11" />
          <circle data-morph="node-accent" cx="990" cy="368" r="11" />
          <circle data-morph="node" cx="914" cy="282" r="15" />
          <path data-morph="stroke-dim" d="M838 196 H990 M838 368 H990 M838 196 V368 M990 196 V368 M838 196 L990 368 M990 196 L838 368 M914 282 L838 196 M914 282 L990 196 M914 282 L838 368 M914 282 L990 368" strokeWidth="1.8" />
          <path data-morph="stroke-accent" d="M804 486 L900 478 M804 516 L864 524 M804 546 L924 538" data-d0="M804 486 L900 478 M804 516 L864 524 M804 546 L924 538" data-d1="M804 486 L900 486 M804 516 L864 516 M804 546 L924 546" strokeWidth="9" />
          <path data-morph="stroke" d="M600 494 L610 524 L640 534 L610 544 L600 574 L590 544 L560 534 L590 524 Z" data-d0="M600 494 L610 524 L640 534 L610 544 L600 574 L590 544 L560 534 L590 524 Z" data-d1="M600 500 L618 534 L618 534 L618 534 L600 568 L582 534 L582 534 L582 534 Z" />
        </svg>
      </div>
    </section>
  );
}
