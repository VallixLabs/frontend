import { useCallback, useEffect, useRef, useState } from 'react';

import { api, type Demo, type HistoryRow, type ModelKey, type ModelStatus, type Run } from './api';

// The model choice is a per-browser convenience; storage can be blocked or throw (private windows),
// in which case the choice simply starts at TabICL every visit.
const CHOICE_KEY = 'vallix.workbench.model';

function readChoice(): ModelKey {
  try {
    const v = window.localStorage.getItem(CHOICE_KEY);
    return v === 'priorfm' || v === 'tabicl' ? v : 'tabicl';
  } catch {
    return 'tabicl';
  }
}

function saveChoice(m: ModelKey) {
  try {
    window.localStorage.setItem(CHOICE_KEY, m);
  } catch {
    /* not remembered; nothing else depends on it */
  }
}

/**
 * All workbench state.
 *
 * The shape is flat because the product is now flat: one table, one inference pass,
 * one set of results. Loading a run from history simply swaps `run` — a scored run
 * carries its own result, so revisiting it costs nothing.
 */
export function useRun() {
  const [run, setRun] = useState<Run | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [model, setModel] = useState<ModelStatus | null>(null);
  const [offline, setOffline] = useState(false);

  const [choice, setChoiceState] = useState<ModelKey>(readChoice);
  const setChoice = useCallback((m: ModelKey) => {
    setChoiceState(m);
    saveChoice(m);
  }, []);

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const guard = useCallback(async <T,>(label: string, fn: () => Promise<T>): Promise<T | null> => {
    setBusy(label);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setBusy(null);
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      setHistory((await api.history()).history);
    } catch {
      /* the history sidebar is a convenience; its absence must not block a run */
    }
  }, []);

  // Which model servers are answering. Checked quickly until one is, then every 15 s, so a
  // server that goes down or comes back shows in the picker without a reload.
  const pollRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let alive = true;

    const tick = async () => {
      let delay = 1500;
      try {
        const m = await api.model();
        if (!alive) return;
        setModel(m);
        setOffline(false);
        if (m.status === 'ready' || m.status === 'error') delay = 15000;
      } catch {
        if (alive) setOffline(true);
      }
      if (alive) pollRef.current = window.setTimeout(tick, delay);
    };

    // One async kick-off so the model state, the demo list and the history are on
    // screen immediately rather than an interval later. Everything it sets happens
    // after an await, so no state is set synchronously during the effect.
    const init = async () => {
      await tick();                        // schedules the next check itself
      try {
        const d = await api.demos();
        if (alive) setDemos(d.demos);
      } catch {
        /* the demo list is optional */
      }
      if (alive) await refreshHistory();
    };

    void init();

    return () => {
      alive = false;
      window.clearTimeout(pollRef.current);
    };
  }, [refreshHistory]);

  const adopt = useCallback((r: Run) => {
    setRun(r);
    void refreshHistory();
  }, [refreshHistory]);

  const loadFile = useCallback((f: File) =>
    guard(`reading ${f.name}`, async () => adopt(await api.fromFile(f))), [adopt, guard]);

  const loadPaste = useCallback((text: string) =>
    guard('parsing the pasted table', async () => adopt(await api.fromPaste(text))), [adopt, guard]);

  const loadDemo = useCallback((id: string) =>
    guard(`loading ${id}`, async () => adopt(await api.fromDemo(id))), [adopt, guard]);

  const openRun = useCallback((id: string) =>
    guard('opening run', async () => setRun(await api.run(id))), [guard]);

  const setTarget = useCallback((t: string) =>
    run && guard('re-screening', async () => adopt(await api.setTarget(run.id, t))), [adopt, guard, run]);

  // The model the next run uses: the remembered choice, unless its server is down and the other
  // one is up (then the other, without forgetting the choice for when it comes back).
  const available = model?.available ?? null;
  const chosen: ModelKey =
    available && !available.includes(choice) && available.length > 0 ? available[0] : choice;
  const chosenUp = available === null || available.includes(chosen);

  const infer = useCallback(() =>
    run && guard(chosen === 'priorfm' ? 'running nanoTabPFN · PriorFM' : 'running TabICLv2', async () => {
      await api.infer(run.id, chosen);
      setRun(await api.run(run.id));
      void refreshHistory();
    }), [chosen, guard, refreshHistory, run]);

  // PriorFM builds a model for an uploaded table in the background (minutes). While its row
  // says queued/building, re-fetch the run so the scores and row predictions appear without a reload.
  const pending = run?.result?.arms.some((a) => a.key === 'priorfm' && /^(queued|building)/.test(a.note)) ?? false;
  useEffect(() => {
    if (!pending || !run) return;
    const id = run.id;
    const t = window.setInterval(async () => {
      try {
        const r = await api.run(id);
        setRun((cur) => (cur?.id === id ? r : cur));
        void refreshHistory();             // the history line names the build state, then the score
      } catch {
        /* a missed poll is retried on the next tick */
      }
    }, 3000);
    return () => window.clearInterval(t);
  }, [pending, run?.id, refreshHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  const clear = useCallback(() => {
    setRun(null);
    setError(null);
  }, []);

  return {
    run, history, demos, model, offline, busy, error,
    choice: chosen, chosenUp, available, setChoice,
    clearError: () => setError(null),
    loadFile, loadPaste, loadDemo, openRun, setTarget, infer, clear, refreshHistory,
  };
}
