#!/usr/bin/env node
/**
 * Uploads, previews and publishes the generated pages, one at a time with a delay.
 * Only run this when the site owner has asked for it: it changes DA and the site.
 *
 *   node tools/smk/publish.js [--upload] [--preview] [--publish] [--paths a,b] [--delay MS]
 *
 *   --upload    POST content/<path>.plain.html to DA (only needed without the BYOM overlay)
 *   --preview   preview each page (Edge Delivery fetches it, copies images to the Media Bus)
 *   --publish   publish each page (adds it to the query index and the sitemap)
 *   --paths     comma-separated paths; default: migration-work/smk/generated-paths.json
 *   --include-authored  also handle /, /nav, /footer and /data/colours
 *
 * Credentials for admin.hlx.page and admin.da.live are injected by the environment.
 */
import {
  existsSync, readFileSync, writeFileSync, mkdirSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const ORG = 'paolomoz';
const SITE = 'smk-explorer';
const REF = 'main';

const { values: args } = parseArgs({
  options: {
    upload: { type: 'boolean', default: false },
    preview: { type: 'boolean', default: false },
    publish: { type: 'boolean', default: false },
    paths: { type: 'string' },
    delay: { type: 'string', default: '1000' },
    'include-authored': { type: 'boolean', default: false },
  },
});

const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
// eslint-disable-next-line no-console
const log = (...m) => console.log(...m);

function paths() {
  let list = args.paths
    ? args.paths.split(',').map((p) => p.trim()).filter(Boolean)
    : JSON.parse(readFileSync(join(root, 'migration-work', 'smk', 'generated-paths.json'), 'utf8'));
  if (args['include-authored']) list = ['/nav', '/footer', '/data/colours', '/', ...list];
  return list;
}

async function upload(path) {
  const isSheet = path === '/data/colours';
  const file = join(root, 'content', isSheet ? 'data/colours.json' : `${path === '/' ? 'index' : path.slice(1)}.plain.html`);
  if (!existsSync(file)) throw new Error(`missing ${file}`);
  const raw = readFileSync(file, 'utf8');
  const body = isSheet ? raw : `<body><header></header><main>${raw}</main><footer></footer></body>`;
  const target = isSheet ? `${path}.json` : `${path === '/' ? '/index' : path}.html`;
  const form = new FormData();
  form.append('data', new Blob([body], { type: isSheet ? 'application/json' : 'text/html' }));
  const res = await fetch(`https://admin.da.live/source/${ORG}/${SITE}${target}`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`upload ${res.status}`);
}

/** Sheets are previewed with their .json extension. */
const adminPath = (path) => (path === '/data/colours' ? '/data/colours.json' : path);

async function admin(route, path) {
  const res = await fetch(`https://admin.hlx.page/${route}/${ORG}/${SITE}/${REF}${path}`, { method: 'POST' });
  if (!res.ok) throw new Error(`${route} ${res.status} ${res.headers.get('x-error') || ''}`.trim());
}

async function main() {
  if (!args.upload && !args.preview && !args.publish) {
    log('Nothing to do: pass --upload, --preview and/or --publish.');
    return;
  }
  const list = paths();
  const delay = parseInt(args.delay, 10);
  const results = [];
  for (let i = 0; i < list.length; i += 1) {
    const path = list[i];
    const result = { path };
    try {
      // eslint-disable-next-line no-await-in-loop
      if (args.upload) { await upload(path); result.uploaded = true; await sleep(delay); }
      // eslint-disable-next-line no-await-in-loop
      if (args.preview) { await admin('preview', adminPath(path)); result.previewed = true; await sleep(delay); }
      // eslint-disable-next-line no-await-in-loop
      if (args.publish) { await admin('live', adminPath(path)); result.published = true; await sleep(delay); }
    } catch (e) {
      result.error = e.message;
      log(`${path}: ${e.message}`);
    }
    results.push(result);
    if ((i + 1) % 25 === 0) log(`${i + 1}/${list.length}`);
  }
  const out = join(root, 'migration-work', 'smk', 'publish-log.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(results, null, 2)}\n`);
  log(`done: ${results.filter((r) => !r.error).length}/${results.length} ok`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
