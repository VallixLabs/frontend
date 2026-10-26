import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import { Logo } from '../site/Logo';
import { usePageMeta } from '../site/seo';
import { api, signInUrl, UnauthorizedError, type Me } from './api';

/** Why the last sign-in did not work, as reported by the backend's redirect (`?auth=...`). */
type AuthProblem = 'denied' | 'failed' | 'error' | 'expired';

const PROBLEM_TEXT: Record<AuthProblem, string> = {
  denied: 'That Google account is not on the invite list. Ask us for access, or sign in with the account we invited.',
  failed: 'Sign-in did not complete (it may have taken too long or been cancelled). Please try again.',
  error: 'Sign-in failed on our side. Please try again in a minute.',
  expired: 'Your session ended. Sign in again to continue.',
};

const isProblem = (v: string | null): v is AuthProblem => v === 'denied' || v === 'failed' || v === 'error' || v === 'expired';

type Auth = { kind: 'checking' } | { kind: 'signedIn'; me: Me } | { kind: 'signedOut' } | { kind: 'unreachable' };

const mono = "'Geist Mono', ui-monospace, monospace";
const eyebrow: CSSProperties = { fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7d7a73' };

/**
 * The front door. Access is invite-only: the backend checks the Google account against its allowlist, so
 * this screen only starts the sign-in, reports what came back, and shows who is signed in.
 */
export default function SignInPage() {
  usePageMeta('/workbench');
  // The backend reports a failed sign-in as ?auth=<reason>; read it once, then drop it from the URL.
  const [problem] = useState<AuthProblem | null>(() => {
    const v = new URLSearchParams(window.location.search).get('auth');
    return isProblem(v) ? v : null;
  });
  const [auth, setAuth] = useState<Auth>({ kind: 'checking' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('auth')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    api.me()
      .then((me) => { if (alive) setAuth({ kind: 'signedIn', me }); })
      .catch((e) => { if (alive) setAuth(e instanceof UnauthorizedError ? { kind: 'signedOut' } : { kind: 'unreachable' }); });
    return () => { alive = false; };
  }, [attempt]);

  const signOut = async () => {
    try {
      await api.logout();
    } catch {
      /* the session is gone either way once the cookie is cleared or has expired */
    }
    setAuth({ kind: 'signedOut' });
  };

  return (
    <div style={{ minHeight: '100vh', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: "'Source Sans 3', system-ui, sans-serif", color: '#141414', background: 'radial-gradient(130% 62% at 50% 0%, #d9d8d3 0%, #e8e7e2 40%, #f6f5f2 78%)' }}>
      <div style={{ width: '100%', maxWidth: 430, boxSizing: 'border-box', background: 'rgba(246,245,242,.9)', border: '1.5px solid #141414', padding: '30px 28px 26px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Link to="/" aria-label="Vallix Labs home" style={{ alignSelf: 'flex-start', display: 'flex' }}>
          <Logo width={130} height={50} />
        </Link>

        {auth.kind === 'signedIn' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={eyebrow}>Signed in</span>
              <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.03em' }}>{auth.me.name || auth.me.email}</h1>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#5d5a54' }}>{auth.me.email}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/" className="vx-btn-dark" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderRadius: 999, fontSize: 14.5, fontWeight: 500 }}>Back to site</Link>
              <button type="button" onClick={signOut} className="vx-btn-outline" style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: 999, fontFamily: 'inherit', fontSize: 14.5, fontWeight: 500 }}>Sign out</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={eyebrow}>Playground</span>
              <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.03em' }}>Sign in to run the models</h1>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: '#5d5a54' }}>
                Access is by invitation. Sign in with the Google account we invited.
              </p>
            </div>

            {problem && auth.kind !== 'unreachable' && (
              <div role="alert" style={{ padding: '12px 14px', borderLeft: '2px solid #a2553f', background: 'rgba(162,85,63,0.08)', fontSize: 14, lineHeight: 1.55 }}>
                {PROBLEM_TEXT[problem]}
              </div>
            )}

            {auth.kind === 'unreachable' ? (
              <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 14px', borderLeft: '2px solid #a2553f', background: 'rgba(162,85,63,0.08)', fontSize: 14, lineHeight: 1.55 }}>
                <span>The API is not answering. It may be restarting; try again in a minute.</span>
                <button type="button" onClick={() => { setAuth({ kind: 'checking' }); setAttempt((n) => n + 1); }} className="vx-btn-outline"
                  style={{ alignSelf: 'flex-start', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500 }}>
                  Try again
                </button>
              </div>
            ) : (
              <a href={signInUrl()} aria-disabled={auth.kind === 'checking'} className="vx-btn-outline"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '11px 18px', borderRadius: 999, fontSize: 14.5, fontWeight: 500, opacity: auth.kind === 'checking' ? 0.6 : 1 }}>
                <GoogleMark />
                Sign in with Google
              </a>
            )}

            <p style={{ margin: 0, fontFamily: mono, fontSize: 11, lineHeight: 1.6, color: '#8f8b84' }}>
              We receive your name, email address and profile picture from Google and use them only to identify you.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/** Google's "G", drawn inline so the page loads nothing from Google before you choose to sign in. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
