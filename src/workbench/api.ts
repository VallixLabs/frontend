/** Typed client for the workbench API. One origin in dev via the Vite proxy. */

export type Check = { label: string; value: string; ok: boolean };
export type ColumnInfo = { name: string; type: 'num' | 'cat'; cardinality: number; card_label: string; n_missing: number };

export type RunState = {
  id: string;
  name: string;
  filename: string;
  target: string;
  task: 'classification' | 'regression';
  columns: ColumnInfo[];
  checks: Check[];
  compatible: boolean;
  n_rows: number;
  n_features: number;
  n_classes: number;
  class_names: string[];
  shape: string;
  rows: string[][];
  rung: number;
  stages: string[];
  has_fingerprint: boolean;
  has_recipes: boolean;
  has_results: boolean;
  elapsed: string;
  arms: Record<string, boolean>;
  candidate: number;
};

export type RungInfo = { symbol: string; name: string; what: string; tag: string };
export type Disclosure = { rung: number; rungs: RungInfo[]; payload: string; size: string };

export type FpBlock = { name: string; n: number; desc: string; detail: string; values: number[]; bars: number[] };
export type Fingerprint = { n_coords: number; seconds: number; blocks: FpBlock[] };

export type FunnelStep = { n: number; delta: string; label: string; w: string; accent: boolean };
export type Candidate = { name: string; dist: string; compile: string; cls: string };
export type SearchResult = {
  funnel: FunnelStep[];
  candidates: Candidate[];
  neighbours: { rank: string; name: string; d: string; w: string }[];
  class_screen_failed: boolean;
  seconds: number;
};

export type RecipeBlank = { key: string; value: string; primitive: string; scope: string };
export type RecipeStage = { stage: string; branch: string; blanks: RecipeBlank[] };
export type RecipeDetail = {
  name: string;
  dist: string;
  stages: RecipeStage[];
  reject: { predicate: string; retries: number };
  sampler: { real: string; fitted: string; real_distinct: number; fitted_distinct: number };
};

export type TrainResult = {
  seconds: number;
  fair: { k: string; v: string }[];
  arms: { key: string; name: string; bias: string; trained: boolean }[];
};

export type MetricFamily = {
  title: string; metrics: string; note: string; accent: boolean; cols: string[];
  rows: { arm: string; lead: boolean; vals: { t: string; best: boolean }[] }[];
};
export type Results = {
  context: number; contexts: number[]; families: MetricFamily[];
  headline: { vs: string; delta: string; win: boolean }[];
  seconds: number; curves: Record<string, number[]>;
};

export type HistoryRow = {
  name: string; when: string; table: string; rung: string;
  dur: string; result: string; colour: 'good' | 'bad' | 'dim'; current: boolean;
};

export type Capabilities = { inverse_model: boolean; torch: boolean; notes: string[] };

class ApiError extends Error {
  // Declared explicitly rather than as a parameter property: this project builds
  // with `erasableSyntaxOnly`, which disallows the shorthand.
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

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const api = {
  health: () => req<{ ok: boolean; capabilities: Capabilities }>('/api/health'),
  demos: () => req<{ demos: { id: string; label: string; note: string }[] }>('/api/demos'),
  history: () => req<{ history: HistoryRow[] }>('/api/runs'),

  createFromDemo: (demo_id: string) => {
    const fd = new FormData();
    fd.append('demo_id', demo_id);
    return req<RunState>('/api/runs', { method: 'POST', body: fd });
  },
  createFromFile: (file: File, target?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (target) fd.append('target', target);
    return req<RunState>('/api/runs', { method: 'POST', body: fd });
  },

  run: (id: string) => req<RunState>(`/api/runs/${id}`),
  setTarget: (id: string, target: string) => req<RunState>(`/api/runs/${id}/target`, json({ target })),
  disclosure: (id: string, rung: number) => req<Disclosure>(`/api/runs/${id}/disclosure?rung=${rung}`),
  fingerprint: (id: string) => req<Fingerprint>(`/api/runs/${id}/fingerprint`, { method: 'POST' }),
  recipes: (id: string, n = 16) => req<SearchResult>(`/api/runs/${id}/recipes`, json({ n_candidates: n })),
  recipe: (id: string, index: number) => req<RecipeDetail>(`/api/runs/${id}/recipe?index=${index}`),
  train: (id: string, arms: Record<string, boolean>) => req<TrainResult>(`/api/runs/${id}/train`, json(arms)),
  results: (id: string, context: number) => req<Results>(`/api/runs/${id}/results?context=${context}`),
  exportFile: (id: string, kind: 'recipe' | 'card' | 'cli') =>
    req<{ filename: string; content: string }>(`/api/runs/${id}/export/${kind}`),
};

export { ApiError };
