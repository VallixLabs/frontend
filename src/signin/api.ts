/**
 * The slice of the backend API the sign-in page needs.
 *
 * In production the API lives on its own host (`VITE_API_BASE`, e.g. https://api.vallixlabs.com) and the
 * browser proves who is calling with the session cookie that host set at sign-in, so every request is sent
 * with `credentials: 'include'`. In dev the base is empty and the Vite proxy keeps the browser on one origin.
 */

/** Where the API is. Empty means "this origin" (dev, behind the Vite proxy). */
export const API_BASE: string = (import.meta.env.VITE_API_BASE ?? '').replace(/\/+$/, '');

// Every request carries this header. The backend refuses POSTs without it, which stops another site from
// driving the API through the browser (a custom header needs CORS approval, and the backend approves only
// the Vallix frontend's origin).
const CLIENT_HEADER = { 'X-Vallix-Client': 'workbench' };

export class UnauthorizedError extends Error {}

export type Me = { email: string; name: string; picture: string | null };

/**
 * Sign-in is a full-page navigation: the backend redirects to Google and back. The backend only returns to
 * `/workbench` after sign-in (its NEXT_PATHS allowlist), so this page lives there.
 */
export function signInUrl(): string {
  return `${API_BASE}/auth/google/login?next=${encodeURIComponent('/workbench')}`;
}

async function send(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...CLIENT_HEADER, ...(init?.headers ?? {}) },
  });
  if (res.status === 401) throw new UnauthorizedError('sign in required');
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

export const api = {
  /** The signed-in account; throws UnauthorizedError when signed out. */
  me: async () => (await send('/api/me')).json() as Promise<Me>,
  logout: async () => { await send('/auth/logout', { method: 'POST' }); },
};
