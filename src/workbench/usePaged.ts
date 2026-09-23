import { useCallback, useEffect, useState } from 'react';

import type { Page } from './api';

/**
 * A page of server-side data, with the controls to walk it.
 *
 * Paging happens on the server rather than by slicing a fully-downloaded table:
 * a run's table and its predictions are both unbounded in principle, and shipping
 * either one whole just to show ten rows is the wrong trade.
 */
export function usePaged<T>(
  fetcher: ((offset: number, limit: number) => Promise<Page<T>>) | null,
  limit: number,
  resetKey: string,
) {
  const [page, setPage] = useState<Page<T> | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (at: number) => {
    if (!fetcher) return;
    setLoading(true);
    try {
      setPage(await fetcher(at, limit));
      setOffset(at);
    } catch {
      /* the caller's error banner already covers a dead API */
    } finally {
      setLoading(false);
    }
  }, [fetcher, limit]);

  useEffect(() => {
    // `resetKey` stands in for "the thing being paged has changed", so a new table
    // or a fresh inference pass starts back at the first page.
    // This effect polls a server, which is the case the set-state-in-effect rule
    // exempts; the linter cannot see that through `load`'s async boundary.
    // oxlint-disable-next-line react/set-state-in-effect
    if (fetcher) void load(0);
  }, [resetKey, fetcher, load]);

  const total = page?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);
  const pageNo = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  return {
    page, offset, loading, total, from, to, pageNo, pages,
    canPrev: offset > 0,
    canNext: offset + limit < total,
    first: () => load(0),
    prev: () => load(Math.max(0, offset - limit)),
    next: () => load(offset + limit),
    last: () => load(Math.max(0, (pages - 1) * limit)),
  };
}
