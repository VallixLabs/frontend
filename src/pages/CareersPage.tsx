import { color, font } from '../theme';
import { PageShell } from './PageShell';
import { panel } from './pageStyles';

/** Replace with real openings; an empty list renders the "nothing open" state. */
const ROLES = [
  {
    title: 'Research engineer · priors',
    type: 'Full-time',
    place: 'Roorkee / remote',
    blurb: 'Own the generator grammar: new branches, the compiler that turns a filled-in form into runnable code, and the fidelity work that keeps our copy of a published prior honest.',
    wants: ['Python that others can read', 'Comfort with probabilistic modelling', 'Enough statistics to know when a result is noise'],
  },
  {
    title: 'Research engineer · evaluation',
    type: 'Full-time',
    place: 'Roorkee / remote',
    blurb: 'Own the measurement layer: proper scoring rules, calibration that is not ECE, and the discipline that stops a comparison being reported when it is not like-for-like.',
    wants: ['Experiment design', 'Scepticism about your own numbers', 'scikit-learn and PyTorch'],
  },
  {
    title: 'Research intern',
    type: '3–6 months',
    place: 'Roorkee',
    blurb: 'A scoped piece of the above, with a report at the end. Open to final-year and postgraduate students.',
    wants: ['One project you can explain end to end', 'Willingness to read code you did not write'],
  },
];

const HOW = [
  ['Write, do not pitch', 'Send a short note about what you have built and what you would want to work on here. No cover letter template survives contact with us.'],
  ['One conversation, then work', 'A call to see whether the problem interests you, then a small paid piece of real work. We would rather see how you think than test whether you can whiteboard.'],
  ['We answer either way', 'If it is a no, you hear it, and you hear why.'],
];

export default function CareersPage() {
  return (
    <PageShell
      eyebrow="Careers"
      title="Work on what a model believes"
      lede="Tabular foundation models learn everything they know from a hand-written generator. We are building the space those generators live in, and the machinery to search it. The team is small, so the work is unusually unbounded."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ margin: 0, fontFamily: font.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: color.accent, fontWeight: 400 }}>
            Open roles
          </h2>

          {ROLES.length === 0 && (
            <div style={panel}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: color.textMuted }}>
                Nothing open right now. Write to us anyway if the problem interests you — we keep good notes.
              </p>
            </div>
          )}

          {ROLES.map((r) => (
            <article key={r.title} style={panel}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 14 }}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: color.textBright }}>{r.title}</h3>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: font.mono, fontSize: 12, color: color.accent }}>{r.type}</span>
                <span style={{ fontFamily: font.mono, fontSize: 12, color: color.textFaint }}>{r.place}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: color.textMuted, maxWidth: '76ch' }}>{r.blurb}</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {r.wants.map((w) => (
                  <li key={w} style={{ fontSize: 14, lineHeight: 1.6, color: color.textFaint }}>{w}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ margin: 0, fontFamily: font.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: color.accent, fontWeight: 400 }}>
            How hiring works
          </h2>
          <div className="v-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {HOW.map(([t, d], i) => (
              <div key={t} style={panel}>
                <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textFaint }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: color.textBright }}>{t}</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: color.textMuted }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ ...panel, borderLeft: `2px solid ${color.accent}` }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: color.textBright }}>Applying</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: color.textMuted, maxWidth: '72ch' }}>
            Send a note and anything you have written or built to{' '}
            <a href="mailto:careers@vallixlabs.com" style={{ color: color.accent }}>careers@vallixlabs.com</a>,
            with the role in the subject line.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
