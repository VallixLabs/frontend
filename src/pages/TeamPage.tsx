import { color, font } from '../theme';
import { PageShell } from './PageShell';
import { panel } from './pageStyles';
import { GROUPS, TEAM, type Member } from './team';

/** Initials monogram: an honest placeholder, rather than a stock portrait. */
function Avatar({ member }: { member: Member }) {
  const initials = member.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        width={96}
        height={96}
        style={{ width: 96, height: 96, objectFit: 'cover', flex: '0 0 96px', background: color.inkWell }}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{
        width: 96, height: 96, flex: '0 0 96px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: color.inkWell,
        border: `1px solid ${color.rule}`, color: color.accent,
        fontFamily: font.mono, fontSize: 26, letterSpacing: '.04em',
      }}
    >
      {initials}
    </div>
  );
}

export default function TeamPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="The people behind Vallix"
      lede="A small group working on one question: what a tabular model should believe before it sees your data, and how to fit that belief without ever holding your rows."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {GROUPS.map((group) => {
          const members = TEAM.filter((m) => m.group === group);
          if (!members.length) return null;
          return (
            <section key={group} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2
                style={{
                  margin: 0, fontFamily: font.mono, fontSize: 12, letterSpacing: '.16em',
                  textTransform: 'uppercase', color: color.accent, fontWeight: 400,
                }}
              >
                {group}
              </h2>
              <div className="v-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 20 }}>
                {members.map((m) => (
                  <article key={m.name} style={{ ...panel, flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>
                    <Avatar member={m} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 600, color: color.textBright }}>{m.name}</div>
                        <div style={{ fontFamily: font.mono, fontSize: 12.5, color: color.accent, marginTop: 3 }}>{m.role}</div>
                      </div>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: color.textMuted }}>{m.bio}</p>
                      {m.links && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 2 }}>
                          {m.links.map((l) =>
                            l.href ? (
                              <a key={l.label} href={l.href} style={{ fontFamily: font.mono, fontSize: 12, color: color.accent }}>{l.label}</a>
                            ) : (
                              <span key={l.label} style={{ fontFamily: font.mono, fontSize: 12, color: color.textFaint }} title="Not available yet">{l.label}</span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <div style={{ ...panel, borderLeft: `2px solid ${color.accent}` }}>
          <div style={{ fontFamily: font.mono, fontSize: 12, color: color.accent }}>Research</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: color.textMuted, maxWidth: '72ch' }}>
            The grammar, the coverage results and the downstream evaluation are written up as a
            technical report. It is not linked here yet — when it is, this is where it will sit.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
