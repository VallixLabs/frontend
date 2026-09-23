import { useCallback, useEffect, useRef, useState } from 'react';

import { api, type Demo, type HistoryRow, type ModelStatus, type Run } from './api';

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

  // The model fits itself on first start, so poll until it is ready rather than
  // asking the user to reload.
  const pollRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        const m = await api.model();
        if (!alive) return;
        setModel(m);
        setOffline(false);
        if (m.status === 'ready' || m.status === 'error') window.clearInterval(pollRef.current);
      } catch {
        if (alive) setOffline(true);
      }
    };

    // One async kick-off so the model state, the demo list and the history are on
    // screen immediately rather than an interval later. Everything it sets happens
    // after an await, so no state is set synchronously during the effect.
    const init = async () => {
      await tick();
      try {
        const d = await api.demos();
        if (alive) setDemos(d.demos);
      } catch {
        /* the demo list is optional */
      }
      if (alive) await refreshHistory();
    };

    void init();
    pollRef.current = window.setInterval(tick, 1500);

    return () => {
      alive = false;
      window.clearInterval(pollRef.current);
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

  const infer = useCallback(() =>
    run && guard('running inference', async () => {
      await api.infer(run.id);
      setRun(await api.run(run.id));
      void refreshHistory();
    }), [guard, refreshHistory, run]);

  const clear = useCallback(() => {
    setRun(null);
    setError(null);
  }, []);

  return {
    run, history, demos, model, offline, busy, error,
    clearError: () => setError(null),
    loadFile, loadPaste, loadDemo, openRun, setTarget, infer, clear, refreshHistory,
  };
}
