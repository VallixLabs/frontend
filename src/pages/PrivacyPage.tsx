/*
 * DRAFT privacy notice: to be reviewed by Vallix Labs before it is relied on.
 *
 * Every statement below describes what the workbench demo actually does (backend Phase 7.5:
 * Google sign-in, per-account runs held in memory, security logs). Facts not decided yet are
 * left as [bracketed placeholders]; fill them in rather than guessing. Update this page whenever
 * the backend changes what it stores or for how long.
 */
import { color, font } from '../theme';
import { PageShell } from './PageShell';
import { panel } from './pageStyles';

/** A paragraph without the browser's margins: the section's gap spaces them. */
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: 0 }}>{children}</p>;
}

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'What this covers',
    body: (
      <P>
        This notice covers the Vallix Labs website and the workbench at www.vallixlabs.com/workbench,
        where invited users run our models on their own tables. It is operated by Vallix Labs
        ([legal entity name and address]).
      </P>
    ),
  },
  {
    title: 'Signing in with Google',
    body: (
      <>
        <P>
          The workbench is invite-only. When you sign in with Google we ask only for the basic identity
          scopes (<code>openid</code>, <code>email</code>, <code>profile</code>), which give us your
          Google account identifier, name, email address and profile picture.
        </P>
        <P>
          We use them only to recognise you and to check your account against our invite list. We never
          see your Google password and do not receive access to your Gmail, Drive or any other Google
          data.
        </P>
      </>
    ),
  },
  {
    title: 'Tables you upload and the results',
    body: (
      <>
        <P>
          Tables you upload or paste, and the predictions and scores computed from them, are processed on
          Vallix Labs' own servers. They are visible only to the account that created them.
        </P>
        <P>
          They are held in the server's memory, not in a database. A run is deleted when you exceed the
          per-account number of stored runs (the oldest goes first) and whenever the server restarts.
          [Describe here anything that is written to disk, and for how long.]
        </P>
        <P>
          For Valli, the server builds a model for your table: it writes the table's training rows to
          its disk, PriorFM proposes synthetic-data generators from them, and Kumo-Tabular is fine-tuned
          on synthetic tables from the chosen generator. The training rows, the build's working files
          and the model stay on the server's disk. [State how long these are kept.]
        </P>
      </>
    ),
  },
  {
    title: 'Security logs',
    body: (
      <P>
        To protect the service against abuse, the server records security events, such as sign-ins,
        refused requests and the actions that start a model run, together with the account and the IP
        address involved. These logs are kept for [retention period] and then deleted.
      </P>
    ),
  },
  {
    title: 'Cookies',
    body: (
      <P>
        The workbench sets one strictly necessary cookie on api.vallixlabs.com, which keeps you signed in
        (and a short-lived one while a sign-in is in progress). There are no advertising or analytics
        cookies, and no third-party trackers.
      </P>
    ),
  },
  {
    title: 'Sharing',
    body: (
      <P>
        We do not sell or rent your data and do not share it with third parties, except the services the
        workbench runs on: Google (sign-in), Cloudflare (which carries traffic to our servers) and Vercel
        (which hosts this website).
      </P>
    ),
  },
  {
    title: 'Your choices',
    body: (
      <P>
        You can sign out at any time, which ends your session. To have your account details or runs
        removed sooner, or for any question about this notice, write to [contact email].
      </P>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Privacy notice"
      lede="What the Vallix Labs workbench collects when you sign in and run a table, why, and for how long."
    >
      <div
        role="note"
        style={{
          ...panel, marginBottom: 32, borderLeft: `2px solid ${color.accent}`,
          fontFamily: font.mono, fontSize: 13, color: color.textMuted,
        }}
      >
        Draft — to be reviewed. Bracketed items are not decided yet.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 34, maxWidth: '68ch' }}>
        {SECTIONS.map((s) => (
          <section key={s.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: color.textBright }}>{s.title}</h2>
            <div style={{ fontSize: 15, lineHeight: 1.75, color: color.textMuted, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
