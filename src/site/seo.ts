import { useEffect } from 'react';

import meta from './pages.json';

/**
 * Per-page <head> tags while navigating inside the app. The same pages.json feeds scripts/seo-pages.mjs,
 * which writes a static HTML file per route at build time for crawlers and link previews that don't run JS.
 */
type Path = keyof typeof meta.pages;

function setTag(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function usePageMeta(path: Path) {
  useEffect(() => {
    const p: { title: string; description: string; noindex?: boolean } = meta.pages[path];
    const url = meta.site + (path === '/' ? '/' : path);
    document.title = p.title;
    setTag('meta[name="description"]', 'content', p.description);
    setTag('meta[name="robots"]', 'content', p.noindex ? 'noindex, nofollow' : 'index, follow');
    setTag('link[rel="canonical"]', 'href', url);
    setTag('meta[property="og:url"]', 'content', url);
    setTag('meta[property="og:title"]', 'content', p.title);
    setTag('meta[property="og:description"]', 'content', p.description);
    setTag('meta[name="twitter:title"]', 'content', p.title);
    setTag('meta[name="twitter:description"]', 'content', p.description);
  }, [path]);
}
