/**
 * Cloudflare Worker entry for the BYOM service (see tools/smk/README.md).
 *
 * API responses are kept in the edge cache for CACHE_TTL seconds (default 600),
 * so a bulk preview does not hit the SMK API once per page for shared data such as
 * the palette, while a re-preview a few minutes later picks up fresh data.
 * Concurrent requests to the API are capped, to stay polite.
 */
import { createHandler } from './handler.js';

const MAX_CONCURRENT = 2;
let active = 0;
const queue = [];

async function limited(fn) {
  if (active >= MAX_CONCURRENT) await new Promise((r) => { queue.push(r); });
  active += 1;
  try {
    return await fn();
  } finally {
    active -= 1;
    const next = queue.shift();
    if (next) next();
  }
}

function edgeFetcher(ttl, ctx) {
  const memo = new Map();
  return (url) => {
    if (!memo.has(url)) {
      memo.set(url, (async () => {
        const key = new Request(url);
        const cache = (typeof caches !== 'undefined' ? caches.default : null);
        const hit = cache ? await cache.match(key) : null;
        if (hit) return hit.json();
        const res = await limited(() => fetch(url, {
          headers: { 'User-Agent': 'smk-explorer BYOM (Edge Delivery Services)' },
        }));
        if (!res.ok) throw new Error(`SMK API ${res.status} for ${url}`);
        const body = await res.text();
        if (cache) {
          ctx.waitUntil(cache.put(key, new Response(body, {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${ttl}` },
          })));
        }
        return JSON.parse(body);
      })());
    }
    return memo.get(url);
  };
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const ttl = parseInt(env.CACHE_TTL || '600', 10);
    const fetchJson = edgeFetcher(ttl, ctx);
    const sheetUrl = env.SHEET_URL || 'https://main--smk-explorer--paolomoz.aem.page/data/colours.json';
    const handle = createHandler({
      fetchJson,
      origin: env.SITE_ORIGIN || 'https://main--smk-explorer--paolomoz.aem.live',
      loadSheet: async () => {
        const res = await fetch(sheetUrl, { cf: { cacheTtl: 60 } });
        return res.ok ? (await res.json()).data || [] : [];
      },
    });
    try {
      const { status, body, type } = await handle(pathname);
      return new Response(body, {
        status,
        headers: { 'Content-Type': type, 'Cache-Control': 'no-store' },
      });
    } catch (e) {
      return new Response(`Upstream error: ${e.message}`, { status: 502 });
    }
  },
};
