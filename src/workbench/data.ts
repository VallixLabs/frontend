/**
 * The few constants the UI still owns.
 *
 * Everything else that used to live here — rungs, fingerprint blocks, candidates,
 * metric tables, history — now comes from the API, computed from the table that was
 * actually loaded. What remains is presentation vocabulary: the stage names, the
 * status colours, and how a scope is drawn.
 */

import { wb } from './theme';

export const SCOPES = ['run', 'task', 'layer', 'node', 'column', 'row'] as const;
export type Scope = (typeof SCOPES)[number];

export const STAGE_NAMES = [
  'Your table',
  'Disclosure level',
  'Fingerprint',
  'The recipe',
  'Train',
  'Results',
  'Export',
] as const;

export type StageStatus = 'done' | 'running' | 'active' | 'failed' | 'skipped' | 'idle';

export const STATUS_DOT: Record<StageStatus, string> = {
  done: wb.good,
  running: wb.acc,
  active: wb.acc,
  failed: wb.bad,
  skipped: wb.ghost,
  idle: wb.ghost,
};

export const SCOPE_TIPS: Record<Scope, string> = {
  run: 'Drawn once for the entire run. Every task, layer and row sees the same value.',
  task: 'Redrawn for each synthetic table. This is the usual granularity for structural choices.',
  layer:
    'Redrawn at every layer of the generator. Same set, same weights — a different sample each depth.',
  node: 'Redrawn at every node of the structural graph. Neighbouring nodes are unrelated draws.',
  column: 'Redrawn per column, so columns differ in character within a single table.',
  row: 'Redrawn per row — the finest granularity. Effectively i.i.d. noise across observations.',
};

/**
 * The scope chip's visual weight climbs with granularity: six pips fill left to
 * right, and the border warms from grey to full amber. Scope is a coordinate of
 * the space, so it is encoded, not merely labelled.
 */
export const scopeChrome = (scope: Scope) => {
  const idx = SCOPES.indexOf(scope);
  return {
    idx,
    pips: SCOPES.map((_, i) => (i <= idx ? wb.acc : wb.well)),
    border: ['#4A4A4A', '#565656', '#6B5A3E', '#8A6A3A', '#B07C34', wb.acc][idx],
    bg: idx >= 4 ? wb.accWell : wb.surfaceLo,
    fg: idx >= 3 ? wb.acc : wb.muted,
  };
};
