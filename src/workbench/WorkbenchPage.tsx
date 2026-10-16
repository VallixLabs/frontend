import { useEffect, useRef, useState } from 'react';

import { API_BASE, api, onUnauthorized, UnauthorizedError, type Me } from './api';
import { glass, mono, sans, wb } from './theme';
import { useRun } from './useRun';
import { useCanvasGrid } from './useCanvasGrid';
import { Backdrop } from './Backdrop';
import { HistorySidebar, TopBar } from './Shell';
import { TableInput } from './panels/TableInput';
import { DataTable } from './panels/DataTable';
import { CompatibilityDialog } from './panels/CompatibilityDialog';
import { ResultsPanel } from './panels/ResultsPanel';
import { SignIn, type AuthProblem } from './SignIn';

type Auth =
  | { kind: 'checking' }
  | { kind: 'signedOut'; problem: AuthProblem | null }
  | { kind: 'signedIn'; me: Me }
  | { kind: 'unreachable' };

const AUTH_PROBLEMS: readonly AuthProblem[] = ['denied', 'failed', 'error'];

/** The `?auth=...` the backend appends when a sign-in did not work (read only; stripped in an effect). */
function authProblemFromUrl(): AuthProblem | null {
  const v = new URLSearchParams(window.location.search).get('auth');
  return AUTH_PROBLEMS.find((p) => p === v) ?? null;
}

/**
 * The route. The workbench runs models on our GPUs, so it is behind Google sign-in: ask the API
 * who we are, show the sign-in screen when the answer is "nobody", and drop back to it whenever
 * any call later reports the session has ended.
 */
export default function WorkbenchPage() {
  const [problem] = useState(authProblemFromUrl);
  const [auth, setAuth] = useState<Auth>({ kind: 'checking' });
  const [attempt, setAttempt] = useState(0);

  // The backend's error marker has been read; keep it out of the address bar and history.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('auth')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    api.me()
      .then((me) => { if (alive) setAuth({ kind: 'signedIn', me }); })
      .catch((e) => {
        if (!alive) return;
        setAuth(e instanceof UnauthorizedError ? { kind: 'signedOut', problem } : { kind: 'unreachable' });
      });
    return () => { alive = false; };
  }, [problem, attempt]);

  useEffect(() => onUnauthorized(() => {
    setAuth((a) => (a.kind === 'signedIn' ? { kind: 'signedOut', problem: 'expired' } : a));
  }), []);

  if (auth.kind === 'signedIn') {
    const signOut = async () => {
      try {
        await api.logout();
      } catch {
        /* the session is gone either way once the cookie is cleared or has expired */
      }
      setAuth({ kind: 'signedOut', problem: null });
    };
    return <Workbench me={auth.me} onSignOut={signOut} />;
  }
  if (auth.kind === 'signedOut') return <SignIn problem={auth.problem} />;

  return (
    <div className="wb-root" style={{ position: 'relative', minHeight: '100vh', background: wb.bg, color: wb.fg, fontFamily: sans, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', boxSizing: 'border-box' }}>
      <Backdrop />
      {auth.kind === 'checking' ? (
        <span style={{ position: 'relative', zIndex: 1, fontFamily: mono, fontSize: 13, color: wb.dim }}>checking your session…</span>
      ) : (
        <div style={{ ...glass, position: 'relative', zIndex: 1, maxWidth: 420, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 14, borderLeft: `2px solid ${wb.bad}` }}>
          <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad }}>offline</span>
          <span style={{ fontSize: 14, lineHeight: 1.6, color: wb.body }}>
            The workbench API is not answering. It may be restarting; try again in a minute.
          </span>
          <button type="button" className="wb-ghost-btn" onClick={() => { setAuth({ kind: 'checking' }); setAttempt((n) => n + 1); }}
            style={{ all: 'unset', cursor: 'pointer', alignSelf: 'flex-start', fontFamily: sans, fontSize: 13, color: wb.body, background: 'rgba(255,255,255,0.04)', padding: '7px 14px' }}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

/** Name and sign-out, in the top bar. */
function Account({ me, onSignOut }: { me: Me; onSignOut: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span className="v-hide-sm" title={me.email} style={{ fontFamily: mono, fontSize: 12, color: wb.muted, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {me.name || me.email}
      </span>
      <button type="button" onClick={onSignOut} className="wb-ghost-btn"
        style={{ all: 'unset', cursor: 'pointer', fontFamily: sans, fontSize: 13, color: wb.muted, padding: '7px 10px' }}>
        Sign out
      </button>
    </div>
  );
}

/**
 * The workbench, inference-only.
 *
 * One served model, fitted before any table arrives. A run is a table in, one
 * inference pass, and the scores and exports that come out — all on this page,
 * because there is no longer a sequence of stages to walk. The left rail is the
 * run history, so any earlier table is one click away.
 */
function Workbench({ me, onSignOut }: { me: Me; onSignOut: () => void }) {
  const R = useRun();
  const [compatOpen, setCompatOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  useCanvasGrid(canvasRef, `${R.run?.id ?? 'none'}-${R.run?.state ?? ''}`);

  const modelReady = R.model?.status === 'ready';

  return (
    <div
      className="wb-root"
      style={{
        position: 'relative', minHeight: '100vh', background: wb.bg, color: wb.fg,
        fontFamily: sans, display: 'flex', flexDirection: 'column',
      }}
    >
      <Backdrop />

      <TopBar
        model={R.model}
        runName={R.run?.id ?? ''}
        elapsed={R.run?.result ? `${R.run.result.seconds}s` : ''}
        onNew={R.clear}
        onToggleSide={() => setSideOpen((o) => !o)}
        account={<Account me={me} onSignOut={onSignOut} />}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
        <HistorySidebar
          history={R.history}
          currentId={R.run?.id ?? null}
          open={sideOpen}
          onOpen={(id) => { setSideOpen(false); void R.openRun(id); }}
          onClose={() => setSideOpen(false)}
        />
        {sideOpen && <div className="wb-scrim" onClick={() => setSideOpen(false)} />}

        <div ref={canvasRef} style={{ flex: 1, minWidth: 0, position: 'relative', overflowY: 'auto' }}>
          {R.offline && (
            <div style={{ ...glass, margin: '20px 40px 0', padding: '14px 18px', display: 'flex', gap: 12, borderLeft: `2px solid ${wb.bad}` }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad }}>offline</span>
              <span style={{ fontSize: 13, color: wb.muted }}>
                {API_BASE ? (
                  'The workbench API is not answering. It may be restarting; this page reconnects by itself.'
                ) : (
                  <>
                    The API is not answering on <code style={{ fontFamily: mono }}>:8000</code>. Start it with{' '}
                    <code style={{ fontFamily: mono, color: wb.fg }}>./backend/run.sh</code>.
                  </>
                )}
              </span>
            </div>
          )}

          {R.error && (
            <div style={{ ...glass, margin: '20px 40px 0', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', borderLeft: `2px solid ${wb.bad}` }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: wb.bad }}>error</span>
              <span style={{ flex: 1, fontSize: 13, color: wb.fg }}>{R.error}</span>
              <button type="button" onClick={R.clearError} className="wb-close"
                style={{ all: 'unset', cursor: 'pointer', fontFamily: mono, fontSize: 13, color: wb.dim }}>✕</button>
            </div>
          )}

          {R.busy && (
            <div style={{ position: 'sticky', top: 0, zIndex: 8, display: 'flex', justifyContent: 'center', padding: '16px 0 0' }}>
              <div style={{ ...glass, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 8, height: 8, background: wb.acc, animation: 'wbPulse 1.2s ease-in-out infinite' }} />
                <span style={{ fontFamily: mono, fontSize: 13, color: wb.fg }}>{R.busy}…</span>
              </div>
            </div>
          )}

          <div className="wb-pad" style={{ padding: '30px 40px 80px', display: 'flex', flexDirection: 'column', gap: 26 }}>
            <TableInput
              run={R.run}
              demos={R.demos}
              busy={R.busy}
              onFile={R.loadFile}
              onPaste={R.loadPaste}
              onDemo={R.loadDemo}
            />

            {R.run && (
              <DataTable
                run={R.run}
                busy={R.busy}
                modelReady={modelReady}
                onTarget={R.setTarget}
                onShowCompatibility={() => setCompatOpen(true)}
                // A run on an unservable table is refused here rather than at the
                // API, so the reason is in front of the person who pressed it.
                onRun={() => (R.run?.compatible ? R.infer() : setCompatOpen(true))}
              />
            )}

            {R.run?.result && <ResultsPanel run={R.run} />}
          </div>
        </div>
      </div>

      {compatOpen && R.run && (
        <CompatibilityDialog checks={R.run.checks} onClose={() => setCompatOpen(false)} />
      )}
    </div>
  );
}
