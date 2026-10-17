/**
 * Typed client for the workbench API.
 *
 * In production the API lives on its own host (`VITE_API_BASE`, e.g. https://api.vallixlabs.com)
 * and the browser proves who is calling with the session cookie that host set at sign-in, so every
 * request is sent with `credentials: 'include'`. In dev the base is empty and the Vite proxy keeps
 * the browser on one origin.
 */

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

/**
 * The model a run is served by. The backend routes the run to that model's inference server:
 * `tabicl` -> infer_tabicl, `priorfm` (nanoTabPFN) -> infer_priorfm.
 */
export type ModelKey = 'tabicl' | 'priorfm';

/** The models a run can be served by, in the order the picker shows them. */
export const MODELS: { key: ModelKey; name: string; sub: string; server: string }[] = [
  { key: 'tabicl', name: 'TabICLv2', sub: 'pre-trained · answers in seconds', server: 'infer_tabicl' },
  { key: 'priorfm', name: 'nanoTabPFN · PriorFM', sub: 'per-table model · demos instant, uploads build ~10 min', server: 'infer_priorfm' },
];

export const modelName = (key: ModelKey) => MODELS.find((m) => m.key === key)?.name ?? key;

export type Result = {
  /** The model that served this run; its arm comes first and has `served: true`. */
  model: ModelKey;
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
  /** The model servers answering right now. */
  available: ModelKey[];
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

/** The session is missing or expired: the workbench shows the sign-in screen. */
class UnauthorizedError extends ApiError {
  constructor(message = 'sign in required') {
    super(401, message);
  }
}

/** Where the API is. Empty means "this origin" (dev, behind the Vite proxy). */
export const API_BASE: string = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '');

// Every request carries this header. The backend refuses POSTs without it, which stops another
// site from driving the API through the browser (a custom header needs CORS approval, and the
// backend approves only the Vallix frontend's origin).
const CLIENT_HEADER = { 'X-Vallix-Client': 'workbench' };

// A 401 from any call means the session ended while the page was open. Whoever shows the sign-in
// screen subscribes here, so no individual caller has to handle it.
type Listener = () => void;
const unauthorizedListeners = new Set<Listener>();
export function onUnauthorized(fn: Listener): () => void {
  unauthorizedListeners.add(fn);
  return () => unauthorizedListeners.delete(fn);
}

async function send(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...CLIENT_HEADER, ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      detail = (await res.json()).detail ?? detail;
    } catch {
      /* the body was not JSON; the status text will do */
    }
    if (res.status === 401) {
      unauthorizedListeners.forEach((fn) => fn());
      throw new UnauthorizedError(detail);
    }
    throw new ApiError(res.status, detail);
  }
  return res;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  return (await send(path, init)).json() as Promise<T>;
}

export type Me = { email: string; name: string; picture: string | null };

/** Sign-in is a full-page navigation: the backend redirects to Google and back. */
export function signInUrl(next = '/workbench'): string {
  return `${API_BASE}/auth/google/login?next=${encodeURIComponent(next)}`;
}

export const api = {
  /** The signed-in account; throws UnauthorizedError when signed out. */
  me: () => req<Me>('/api/me'),
  logout: async () => { await send('/auth/logout', { method: 'POST' }); },

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

  infer: (id: string, model: ModelKey) =>
    req<{ result: Result; state: RunState }>(`/api/runs/${id}/infer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model }),
    }),

  exportFile: (id: string, kind: 'predictions' | 'metrics' | 'card') =>
    req<{ filename: string; content: string }>(`/api/runs/${id}/export/${kind}`),
};

export { ApiError, UnauthorizedError };
