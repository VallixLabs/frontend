import { useCallback, useEffect, useState } from 'react';

import {
  api,
  type Capabilities,
  type Disclosure,
  type Fingerprint,
  type HistoryRow,
  type RecipeDetail,
  type Results,
  type RunState,
  type SearchResult,
  type TrainResult,
} from './api';

export type Phase = 'idle' | 'busy' | 'error';

/**
 * All workbench state, and the calls that fill it.
 *
 * Each stage's data is fetched once and cached until something upstream
 * invalidates it — a new table clears everything, a new recipe clears the
 * results — so moving back and forth through the rail is free, and only work that
 * genuinely has to be redone is redone.
 */
export function useRun() {
  const [run, setRun] = useState<RunState | null>(null);
  const [demos, setDemos] = useState<{ id: string; label: string; note: string }[]>([]);
  const [caps, setCaps] = useState<Capabilities | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [offline, setOffline] = useState(false);

  const [disclosure, setDisclosure] = useState<Disclosure | null>(null);
  const [fp, setFp] = useState<Fingerprint | null>(null);
  const [search, setSearch] = useState<SearchResult | null>(null);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [train, setTrain] = useState<TrainResult | null>(null);
  const [results, setResults] = useState<Results | null>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [busyLabel, setBusyLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const guard = useCallback(async <T,>(label: string, fn: () => Promise<T>): Promise<T | null> => {
    setPhase('busy');
    setBusyLabel(label);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase('error');
      return null;
    } finally {
      setPhase((p) => (p === 'error' ? p : 'idle'));
      setBusyLabel('');
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [h, d] = await Promise.all([api.health(), api.demos()]);
        setCaps(h.capabilities);
        setDemos(d.demos);
      } catch {
        setOffline(true);
      }
    })();
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      setHistory((await api.history()).history);
    } catch {
      /* history is a convenience; its absence must not block a run */
    }
  }, []);

  /** A new table invalidates every derived stage. */
  const adopt = useCallback((r: RunState) => {
    setRun(r);
    setDisclosure(null);
    setFp(null);
    setSearch(null);
    setRecipe(null);
    setTrain(null);
    setResults(null);
    void refreshHistory();
  }, [refreshHistory]);

  const loadDemo = useCallback(
    (id: string) => guard(`loading ${id}`, async () => adopt(await api.createFromDemo(id))),
    [adopt, guard],
  );

  const loadFile = useCallback(
    (file: File) => guard(`reading ${file.name}`, async () => adopt(await api.createFromFile(file))),
    [adopt, guard],
  );

  const setTarget = useCallback(
    (target: string) => run && guard('re-screening', async () => adopt(await api.setTarget(run.id, target))),
    [adopt, guard, run],
  );

  const pickRung = useCallback(
    (rung: number) =>
      run && guard('building the payload', async () => setDisclosure(await api.disclosure(run.id, rung))),
    [guard, run],
  );

  const computeFingerprint = useCallback(
    () => run && guard('running the learner battery', async () => setFp(await api.fingerprint(run.id))),
    [guard, run],
  );

  const fitRecipes = useCallback(
    (n = 16) =>
      run &&
      guard('compiling and ranking candidates', async () => {
        const s = await api.recipes(run.id, n);
        setSearch(s);
        if (s.candidates.length) setRecipe(await api.recipe(run.id, 0));
        setTrain(null);
        setResults(null);
      }),
    [guard, run],
  );

  const pickCandidate = useCallback(
    (i: number) =>
      run &&
      guard('sampling from the recipe', async () => {
        setRecipe(await api.recipe(run.id, i));
        // a different recipe means the trained arms no longer describe this run
        setTrain(null);
        setResults(null);
      }),
    [guard, run],
  );

  const runTraining = useCallback(
    (arms: Record<string, boolean>) =>
      run &&
      guard('selecting a bias under each prior', async () => {
        setTrain(await api.train(run.id, arms));
        setResults(await api.results(run.id, 8));
        setRun(await api.run(run.id));
        void refreshHistory();
      }),
    [guard, refreshHistory, run],
  );

  const pickContext = useCallback(
    (ctx: number) => run && guard('rescoring', async () => setResults(await api.results(run.id, ctx))),
    [guard, run],
  );

  return {
    run, demos, caps, history, offline,
    disclosure, fp, search, recipe, train, results,
    phase, busyLabel, error, clearError: () => { setError(null); setPhase('idle'); },
    loadDemo, loadFile, setTarget, pickRung, computeFingerprint,
    fitRecipes, pickCandidate, runTraining, pickContext, refreshHistory,
  };
}
