/**
 * Polite fetching for Node: responses are cached on disk, network requests are
 * spaced by a delay, and 429/5xx responses are retried with backoff.
 */
import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, readFileSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });

/**
 * @param {object} opts
 * @param {string} opts.cacheDir
 * @param {number} [opts.delay=500] ms between network requests
 * @param {number} [opts.ttl=7 days] cache lifetime in ms
 * @param {boolean} [opts.refresh=false] ignore cached responses
 */
export default function createFetcher({
  cacheDir, delay = 500, ttl = 7 * 24 * 3600 * 1000, refresh = false, log = () => {},
}) {
  mkdirSync(cacheDir, { recursive: true });
  let last = 0;
  const stats = { network: 0, cached: 0 };

  async function fetchJson(url) {
    const key = createHash('sha1').update(url).digest('hex');
    const file = join(cacheDir, `${key}.json`);
    if (!refresh && existsSync(file)) {
      const entry = JSON.parse(readFileSync(file, 'utf8'));
      if (Date.now() - entry.fetchedAt < ttl) {
        stats.cached += 1;
        return entry.body;
      }
    }
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const wait = last + delay - Date.now();
      // eslint-disable-next-line no-await-in-loop
      if (wait > 0) await sleep(wait);
      last = Date.now();
      stats.network += 1;
      log(`GET ${url}`);
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(url, {
          headers: { 'User-Agent': 'smk-explorer page generator (Edge Delivery Services)' },
          signal: AbortSignal.timeout(60000),
        });
        if (res.ok) {
          // eslint-disable-next-line no-await-in-loop
          const body = await res.json();
          writeFileSync(file, JSON.stringify({ url, fetchedAt: Date.now(), body }));
          return body;
        }
        if (res.status !== 429 && res.status < 500) throw new Error(`${res.status} ${url}`);
        log(`retry after ${res.status}`);
      } catch (e) {
        if (attempt === 3 || /^\d{3} /.test(e.message)) throw e;
        log(`retry after ${e.message}`);
      }
      // eslint-disable-next-line no-await-in-loop
      await sleep(2000 * 2 ** attempt);
    }
    throw new Error(`failed ${url}`);
  }

  fetchJson.stats = stats;
  return fetchJson;
}
