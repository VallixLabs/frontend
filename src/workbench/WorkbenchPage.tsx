import { useRef, useState } from 'react';

import { glass, mono, sans, wb } from './theme';
import { useRun } from './useRun';
import { useCanvasGrid } from './useCanvasGrid';
import { Backdrop } from './Backdrop';
import { HistorySidebar, TopBar } from './Shell';
import { TableInput } from './panels/TableInput';
import { DataTable } from './panels/DataTable';
import { CompatibilityDialog } from './panels/CompatibilityDialog';
import { ResultsPanel } from './panels/ResultsPanel';

/**
 * The workbench, inference-only.
 *
 * One served model, fitted before any table arrives. A run is a table in, one
 * inference pass, and the scores and exports that come out — all on this page,
 * because there is no longer a sequence of stages to walk. The left rail is the
 * run history, so any earlier table is one click away.
 */
export default function WorkbenchPage() {
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
                The API is not answering on <code style={{ fontFamily: mono }}>:8000</code>. Start it with{' '}
                <code style={{ fontFamily: mono, color: wb.fg }}>./backend/run.sh</code>.
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
