#!/usr/bin/env node
/**
 * Runs the BYOM service locally (Node), e.g. to test it or to run it on any Node host.
 *
 *   node tools/smk/byom/server.js [--port 8787]
 *
 * API responses are cached on disk for 10 minutes, with a delay between API requests.
 * The colours sheet is read from SHEET_URL, or from content/data/colours.json.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import createFetcher from '../lib/fetch-node.js';
import { createHandler } from './handler.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const { values: args } = parseArgs({ options: { port: { type: 'string', default: '8787' } } });

const handle = createHandler({
  fetchJson: createFetcher({
    cacheDir: join(here, '..', '.cache', 'byom'), delay: 300, ttl: 10 * 60 * 1000,
  }),
  origin: process.env.SITE_ORIGIN || 'https://main--smk-explorer--paolomoz.aem.live',
  loadSheet: async () => {
    if (process.env.SHEET_URL) {
      const res = await fetch(process.env.SHEET_URL);
      return res.ok ? (await res.json()).data || [] : [];
    }
    const file = join(root, 'content', 'data', 'colours.json');
    return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).data : [];
  },
});

createServer(async (req, res) => {
  try {
    const { status, body, type } = await handle(new URL(req.url, 'http://localhost').pathname);
    res.writeHead(status, { 'Content-Type': type });
    res.end(body);
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Upstream error: ${e.message}`);
  }
}).listen(parseInt(args.port, 10), () => {
  // eslint-disable-next-line no-console
  console.log(`BYOM service on http://localhost:${args.port}`);
});
