/** Typed client for the workbench API. One origin in dev via the Vite proxy. */

export type Check = { label: string; value: string; ok: boolean };
export type ColumnInfo = {
  name: string; type: 'num' | 'cat'; cardinality: number; card_label: string; n_missing: number;
};

export type RunState = 'empty' | 'rejected' | 'ready' | 'scored';

export type ArmScores = Record<string, { loss: number; acc: number; cal: number; n_episodes: number }>;
export type Arm = {
  key: string; name: string; note: string; served: boolean; bias: string; scores: ArmScores;
};
export type Prediction = { row: number; actual: string | number; predicted: string | number; confidence: number | '' };

export type Result = {
  contexts: number[];
  arms: Arm[];
  seconds: number;
  summary: string;
  task: 'classification' | 'regression';
  metric_name: string;
  point_name: string;
  cal_name: string;
  n_predictions: number;
  preview: Prediction[];
};

/** One row of the fused view: the uploaded cells, plus the model's answer if it has one. */
export type JoinedRow = {
  i: number;
  cells: string[];
  pred: { actual: string | number; predicted: string | number; confidence: number | '' } | null;
};

export type RowPage = {
  offset: number; limit: number; total: number;
  columns: string[]; target: string; scored: boolean;
  rows: JoinedRow[];
};

export type Page<T> = {
  offset: number; limit: number; total: number; rows: T[];
};

export type Run = {
  id: string;
  name: string;
  filename: string;
  source: 'upload' | 'paste' | 'demo';
  target: string;
  task: 'classification' | 'regression';
  columns: ColumnInfo[];
  checks: Check[];
  compatible: boolean;
  state: RunState;
  n_rows: number;
  n_features: number;
  n_classes: number;
  class_names: string[];
  shape: string;
  rows: string[][];
  elapsed: string;
  result: Result | null;
};

export type HistoryRow = {
  id: string; name: string; when: string; table: string; shape: string;
  task: string; dur: string; result: string; colour: 'good' | 'bad' | 'dim'; state: RunState;
};

export type ModelStatus = {
  status: 'cold' | 'training' | 'ready' | 'error';
  error: string | null;
  name: string;
  kind: string;
  meta: {
    trained_at: string;
    seed: number;
    client_rows_seen: number;
    loaded_from_cache: boolean;
    classification: { generators_in_mixture: number; synthetic_tables: number; bias_space: number; top_biases: string; fit_seconds: number };
    regression: { generators_in_mixture: number; synthetic_tables: number; bias_space: number; top_biases: string; fit_seconds: number };
  } | null;
};

export type Demo = { id: string; label: string; note: string };

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      detail = (await res.json()).detail ?? detail;
    } catch {
      /* the body was not JSON; the status text will do */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  model: () => req<ModelStatus>('/api/model'),
  demos: () => req<{ demos: Demo[] }>('/api/demos'),
  history: () => req<{ history: HistoryRow[] }>('/api/runs'),
  run: (id: string) => req<Run>(`/api/runs/${id}`),

  fromFile: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return req<Run>('/api/runs', { method: 'POST', body: fd });
  },
  fromPaste: (text: string) => {
    const fd = new FormData();
    fd.append('pasted', text);
    return req<Run>('/api/runs', { method: 'POST', body: fd });
  },
  fromDemo: (id: string) => {
    const fd = new FormData();
    fd.append('demo_id', id);
    return req<Run>('/api/runs', { method: 'POST', body: fd });
  },

  setTarget: (id: string, target: string) =>
    req<Run>(`/api/runs/${id}/target`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target }),
    }),

  rows: (id: string, offset: number, limit: number) =>
    req<RowPage>(`/api/runs/${id}/rows?offset=${offset}&limit=${limit}`),

  predictions: (id: string, offset: number, limit: number) =>
    req<Page<Prediction>>(`/api/runs/${id}/predictions?offset=${offset}&limit=${limit}`),

  infer: (id: string) => req<{ result: Result; state: RunState }>(`/api/runs/${id}/infer`, { method: 'POST' }),

  exportFile: (id: string, kind: 'predictions' | 'metrics' | 'card') =>
    req<{ filename: string; content: string }>(`/api/runs/${id}/export/${kind}`),
};

export { ApiError };
