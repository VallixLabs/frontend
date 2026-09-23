import { useState } from 'react';

import { color, font } from '../theme';
import { PageShell } from './PageShell';
import { panel } from './pageStyles';

const CHANNELS = [
  { k: 'General', v: 'hello@vallixlabs.com', href: 'mailto:hello@vallixlabs.com' },
  { k: 'Research', v: 'research@vallixlabs.com', href: 'mailto:research@vallixlabs.com' },
  { k: 'Careers', v: 'careers@vallixlabs.com', href: 'mailto:careers@vallixlabs.com' },
];

const REASONS = ['Evaluating Vallix-1', 'Research collaboration', 'Press', 'Something else'];

const field: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: color.inkWell,
  border: `1px solid ${color.rule}`, color: color.textBright,
  padding: '11px 13px', fontFamily: font.sans, fontSize: 14, outline: 'none',
};

export default function ContactPage() {
  const [reason, setReason] = useState(REASONS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // There is no form endpoint yet, so the form composes a mail instead of
  // pretending to submit. A form that silently drops what you typed is worse
  // than one that hands it back to you.
  const mailto = `mailto:hello@vallixlabs.com?subject=${encodeURIComponent(`[${reason}] ${name || 'Enquiry'}`)}&body=${encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ''}`)}`;

  return (
    <PageShell
      eyebrow="Contact"
      title="Talk to us"
      lede="Bring the messiest table you have. We will score it and send you the comparison against whatever you are running now — no integration, and your rows never have to leave your machine."
    >
      <div className="v-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, alignItems: 'start' }}>
        <form
          style={{ ...panel, gap: 16 }}
          onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}
        >
          <div style={{ fontSize: 17, fontWeight: 600, color: color.textBright }}>Send a message</div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 13, color: color.textMuted }}>What is this about?</span>
            <select value={reason} onChange={(e) => setReason(e.target.value)} style={{ ...field, cursor: 'pointer' }}>
              {REASONS.map((r) => <option key={r} value={r} style={{ background: color.inkRaised }}>{r}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 13, color: color.textMuted }}>Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} style={field} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 13, color: color.textMuted }}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 13, color: color.textMuted }}>Message</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6}
              style={{ ...field, resize: 'vertical', lineHeight: 1.6 }} />
          </label>

          <button
            type="submit"
            style={{
              all: 'unset', cursor: 'pointer', textAlign: 'center', padding: '12px 20px',
              background: color.accent, color: color.accentInk, fontWeight: 600, fontSize: 14,
            }}
          >
            Open in your mail client
          </button>
          <p style={{ margin: 0, fontFamily: font.mono, fontSize: 11.5, lineHeight: 1.6, color: color.textFaint }}>
            This composes a message in your own mail client — nothing is sent from the page, and
            nothing you type here is stored.
          </p>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={panel}>
            <div style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: color.textFaint }}>
              Direct
            </div>
            {CHANNELS.map((c) => (
              <div key={c.k} style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingTop: 4 }}>
                <span style={{ flex: '0 0 84px', fontSize: 13.5, color: color.textMuted }}>{c.k}</span>
                <a href={c.href} style={{ fontFamily: font.mono, fontSize: 13.5, color: color.accent }}>{c.v}</a>
              </div>
            ))}
          </div>

          <div style={panel}>
            <div style={{ fontFamily: font.mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: color.textFaint }}>
              Where we are
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: color.textMuted }}>
              P² Labs, Department of Electrical Engineering<br />
              Indian Institute of Technology Roorkee<br />
              Roorkee, Uttarakhand 247667, India
            </p>
          </div>

          <div style={{ ...panel, borderLeft: `2px solid ${color.accent}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: color.textBright }}>Trying it first</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: color.textMuted }}>
              The workbench runs in the browser against a model that was fitted before your table
              existed. Load a CSV, paste rows, or use one of the bundled datasets.
            </p>
            <a href="/workbench" style={{ fontFamily: font.mono, fontSize: 13, color: color.accent }}>open the workbench →</a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
