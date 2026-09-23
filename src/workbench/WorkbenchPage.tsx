import { useEffect, useRef, useState } from 'react';

import { sans, wb } from './theme';
import { useRun } from './useRun';
import { useCanvasGrid } from './useCanvasGrid';
import { Backdrop } from './Backdrop';
import { Rail, RunHistoryDrawer, TopBar } from './Shell';
import { Banner, BusyOverlay, EmptyState, Offline } from './stages/Empty';
import { StageTable } from './stages/StageTable';
import { StageDisclosure } from './stages/StageDisclosure';
import { StageFingerprint } from './stages/StageFingerprint';
import { StageRecipe } from './stages/StageRecipe';
import { StageTrain } from './stages/StageTrain';
import { StageResults } from './stages/StageResults';
import { StageExport } from './stages/StageExport';

const RUNG_SYMBOLS = ['Σ₁', 'Σ₂', 'Σ₃', 'Σ∞'];

/**
 * The PriorFM workbench: one table carried through seven stages.
 *
 * Every number on screen is computed by the API from the table actually loaded.
 * Stage state lives here because almost every stage reads something another stage
 * produced — the rail shows the rung and the arm count, the export card quotes the
 * rung and the selected recipe's fingerprint distance.
 */
export default function WorkbenchPage() {
  const R = useRun();
  const [stage, setStage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [arms, setArms] = useState<Record<string, boolean>>({ generic: true, mismatched: true, gbt: true, knn: true });
  const [fairOpen, setFairOpen] = useState(true);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  useCanvasGrid(canvasRef, `${stage}-${R.run?.id ?? 'none'}-${drawerOpen}`);

  // Each stage pulls what it needs the first time it is opened, and not before:
  // the fingerprint battery and the candidate search both cost real seconds.
  useEffect(() => {
    if (!R.run?.compatible) return;
    if (stage === 2 && !R.disclosure) void R.pickRung(R.run.rung);
    if (stage === 3 && !R.fp) void R.computeFingerprint();
    if (stage === 4 && R.fp && !R.search) void R.fitRecipes(16);
  }, [stage, R.run, R.disclosure, R.fp, R.search]); // eslint-disable-line

  const empty = !R.run;
  const failing = !!R.run && !R.run.compatible;

  const runState = empty
    ? { label: 'idle', color: wb.dim }
    : failing
      ? { label: 'aborted', color: wb.bad }
      : R.phase === 'busy'
        ? { label: 'running', color: wb.acc }
        : R.results
          ? { label: 'complete', color: wb.good }
          : { label: 'ready', color: wb.good };

  const armCount = 1 + Object.entries(arms).filter(([k, v]) => v && k !== 'knn').length;

  return (
    <div
      className="wb-root"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: wb.bg,
        color: wb.fg,
        fontFamily: sans,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Backdrop />

      <TopBar
        runName={R.run?.name ?? 'no run'}
        state={runState}
        elapsed={R.run?.elapsed ?? '—'}
        historyCount={R.history.length}
        onToggleDrawer={() => { setDrawerOpen((d) => !d); void R.refreshHistory(); }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'stretch', flex: 1, minHeight: 0 }}>
        <Rail
          stage={stage}
          statuses={R.run?.stages ?? Array(7).fill('idle')}
          onGo={setStage}
          summary={{
            rung: RUNG_SYMBOLS[(R.disclosure?.rung ?? R.run?.rung ?? 3) - 1],
            arms: String(armCount),
            table: R.run?.filename.replace('.csv', '') ?? '—',
          }}
        />

        <div ref={canvasRef} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {R.offline && <Offline />}
          {R.error && <Banner text={R.error} onClose={R.clearError} />}
          {R.phase === 'busy' && <BusyOverlay label={R.busyLabel} />}

          {empty ? (
            <EmptyState demos={R.demos} caps={R.caps} onDemo={R.loadDemo} onFile={R.loadFile} />
          ) : (
            <>
              {stage === 1 && (
                <StageTable
                  run={R.run!}
                  onNext={() => setStage(2)}
                  onClear={() => window.location.reload()}
                  onDemo={() => R.loadDemo(R.demos[0]?.id ?? 'wine')}
                  onTarget={R.setTarget}
                />
              )}
              {stage === 2 && (
                <StageDisclosure disclosure={R.disclosure} onPick={R.pickRung} onNext={() => setStage(3)} />
              )}
              {stage === 3 && (
                <StageFingerprint fp={R.fp} neighbours={R.search?.neighbours ?? []} onNext={() => setStage(4)} />
              )}
              {stage === 4 && (
                <StageRecipe
                  search={R.search}
                  recipe={R.recipe}
                  onPickCandidate={R.pickCandidate}
                  onRefit={() => R.fitRecipes(16)}
                  onNext={() => setStage(5)}
                />
              )}
              {stage === 5 && (
                <StageTrain
                  arms={arms}
                  onToggleArm={(k) => setArms((s) => ({ ...s, [k]: !s[k] }))}
                  fairOpen={fairOpen}
                  onToggleFair={() => setFairOpen((f) => !f)}
                  train={R.train}
                  caps={R.caps}
                  busy={R.phase === 'busy'}
                  onRun={() => R.runTraining(arms)}
                  onNext={() => setStage(6)}
                />
              )}
              {stage === 6 && (
                <StageResults results={R.results} onPickContext={R.pickContext} onNext={() => setStage(7)} />
              )}
              {stage === 7 && <StageExport run={R.run!} recipe={R.recipe} disclosure={R.disclosure} />}
            </>
          )}
        </div>

        {drawerOpen && <RunHistoryDrawer history={R.history} onClose={() => setDrawerOpen(false)} />}
      </div>
    </div>
  );
}

