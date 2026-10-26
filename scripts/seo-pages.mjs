// After `vite build`: write dist/<route>.html for each page in src/site/pages.json with that page's title,
// description, canonical URL and social tags, plus dist/sitemap.xml. Vercel serves these files ("cleanUrls")
// before the SPA fallback, so crawlers and link previews see the right <head> without running JavaScript.
import { readFileSync, writeFileSync } from 'node:fs';

const meta = JSON.parse(readFileSync(new URL('../src/site/pages.json', import.meta.url), 'utf8'));
const dist = new URL('../dist/', import.meta.url);
const base = readFileSync(new URL('index.html', dist), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function replaceOnce(html, re, value) {
  if (!re.test(html)) throw new Error('seo-pages: tag not found in dist/index.html: ' + re);
  return html.replace(re, value);
}

function pageHtml(path, p) {
  const url = meta.site + (path === '/' ? '/' : path), t = esc(p.title), d = esc(p.description);
  let h = base;
  h = replaceOnce(h, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  h = replaceOnce(h, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`);
  h = replaceOnce(h, /<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${p.noindex ? 'noindex, nofollow' : 'index, follow'}"`);
  h = replaceOnce(h, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  h = replaceOnce(h, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  h = replaceOnce(h, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`);
  h = replaceOnce(h, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`);
  h = replaceOnce(h, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`);
  h = replaceOnce(h, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`);
  return h;
}

const today = new Date().toISOString().slice(0, 10);
const urls = [];
for (const [path, p] of Object.entries(meta.pages)) {
  writeFileSync(new URL(path === '/' ? 'index.html' : path.slice(1) + '.html', dist), pageHtml(path, p));
  if (!p.noindex) urls.push(`  <url><loc>${meta.site}${path}</loc><lastmod>${today}</lastmod></url>`);
}
writeFileSync(new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`seo-pages: ${Object.keys(meta.pages).length} pages, ${urls.length} in sitemap.xml`);
