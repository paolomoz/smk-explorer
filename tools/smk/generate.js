#!/usr/bin/env node
/**
 * Generates the colours hub, the colour pages and the artwork pages from the
 * SMK Open API, as Edge Delivery markup in `content/` (one `.plain.html` per page).
 *
 *   node tools/smk/generate.js [options]
 *
 *   --only hub,colours,artworks   generate only some page types (default: all)
 *   --limit N                     only the first N colours (for testing)
 *   --delay MS                    pause between API requests (default 500)
 *   --refresh                     ignore cached API responses
 *   --origin URL                  site origin used in canonical URLs and JSON-LD
 *   --out DIR                     output folder (default content)
 *   --seed-sheet                  rewrite the colours sheet with computed names and notes
 *
 * API responses are cached in tools/smk/.cache (7 days). The colours sheet
 * (content/data/colours.json: hex, name, note) is authored content: it is created
 * on the first run and read on later runs, so authored names and notes are kept.
 * The home page, nav and footer are seeded from tools/smk/seed when missing.
 */
import {
  existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import createFetcher from './lib/fetch-node.js';
import {
  loadPalette, nameColours, byHex, loadColourPage, loadArtworks, seedSheetRows, isPublishable,
} from './lib/data.js';
import { renderHub, renderColour, renderArtwork } from './lib/render.js';
import { artworkPath } from '../../scripts/smk-api.js';
import { colourPath } from '../../scripts/colour-names.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');

const { values: args } = parseArgs({
  options: {
    only: { type: 'string', default: 'hub,colours,artworks' },
    limit: { type: 'string' },
    delay: { type: 'string', default: '500' },
    refresh: { type: 'boolean', default: false },
    origin: { type: 'string', default: 'https://main--smk-explorer--paolomoz.aem.live' },
    out: { type: 'string', default: 'content' },
    'seed-sheet': { type: 'boolean', default: false },
    verbose: { type: 'boolean', default: false },
  },
});

const only = new Set(args.only.split(','));
const out = resolve(root, args.out);
const origin = args.origin.replace(/\/$/, '');
const fetchJson = createFetcher({
  cacheDir: join(here, '.cache'),
  delay: parseInt(args.delay, 10),
  refresh: args.refresh,
  // eslint-disable-next-line no-console
  log: args.verbose ? console.log : () => {},
});
// eslint-disable-next-line no-console
const log = (...m) => console.log(...m);

function write(path, html) {
  const file = join(out, `${path.replace(/^\//, '')}.plain.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${html}\n`);
}

function seedAuthoredPages() {
  const seedDir = join(here, 'seed');
  readdirSync(seedDir).forEach((name) => {
    const target = join(out, name);
    if (!existsSync(target)) {
      copyFileSync(join(seedDir, name), target);
      log(`seeded ${name}`);
    }
  });
}

const sheetFile = join(out, 'data', 'colours.json');

function readSheet() {
  if (!existsSync(sheetFile)) return null;
  const json = JSON.parse(readFileSync(sheetFile, 'utf8'));
  return json.data || json.colours?.data || [];
}

function writeSheet(rows) {
  mkdirSync(dirname(sheetFile), { recursive: true });
  writeFileSync(sheetFile, `${JSON.stringify({
    total: rows.length, offset: 0, limit: rows.length, data: rows, ':type': 'sheet',
  }, null, 2)}\n`);
}

async function main() {
  mkdirSync(out, { recursive: true });
  seedAuthoredPages();

  const palette = await loadPalette(fetchJson);
  log(`palette: ${palette.colours.length} colours, ${palette.totalWorks} works`);

  const sheet = args['seed-sheet'] ? null : readSheet();
  let named = nameColours(palette.colours, sheet || []);
  let paletteMap = byHex(named);

  const limit = args.limit ? parseInt(args.limit, 10) : named.length;
  const colourData = new Map();
  if (only.has('colours') || only.has('artworks') || !sheet) {
    const list = named.slice(0, limit);
    for (let i = 0; i < list.length; i += 1) {
      const c = list[i];
      // eslint-disable-next-line no-await-in-loop
      colourData.set(c.hex, await loadColourPage(fetchJson, c.hex, paletteMap));
      if ((i + 1) % 20 === 0) log(`colours: ${i + 1}/${list.length}`);
    }
  }

  if (!sheet) {
    const togetherByHex = new Map([...colourData].map(([hex, d]) => [hex, d.together]));
    writeSheet(seedSheetRows(named, togetherByHex));
    log(`wrote colours sheet with ${named.length} rows`);
    named = nameColours(palette.colours, readSheet());
    paletteMap = byHex(named);
    // refresh the names of "often together" colours
    colourData.forEach((d) => {
      d.together = d.together.map((t) => ({ ...paletteMap.get(t.hex), count: t.count }));
    });
  }

  const paths = [];
  if (only.has('hub')) {
    write('/colours', renderHub({ origin, colours: named, totalWorks: palette.totalWorks }));
    paths.push('/colours');
  }

  if (only.has('colours')) {
    colourData.forEach((d, hex) => {
      const colour = { ...paletteMap.get(hex), count: d.found };
      const path = colourPath(colour.name, colour.hex);
      write(path, renderColour({
        origin, colour, together: d.together, works: d.works,
      }));
      paths.push(path);
    });
    log(`colour pages: ${colourData.size}`);
  }

  if (only.has('artworks')) {
    const numbers = [...new Set([...colourData.values()]
      .flatMap((d) => d.works.map((w) => w.object_number)))];
    log(`artworks: ${numbers.length} unique works on the colour pages`);
    const batch = 40;
    let done = 0;
    for (let i = 0; i < numbers.length; i += batch) {
      // eslint-disable-next-line no-await-in-loop
      const items = await loadArtworks(fetchJson, numbers.slice(i, i + batch));
      const publishable = items.filter(isPublishable);
      publishable.forEach((item) => {
        const path = artworkPath(item.object_number);
        write(path, renderArtwork({ origin, item, palette: paletteMap }));
        paths.push(path);
      });
      done += publishable.length;
      if ((i / batch) % 10 === 9) log(`artworks: ${done}/${numbers.length}`);
    }
    log(`artwork pages: ${done}`);
  }

  const manifest = join(root, 'migration-work', 'smk', 'generated-paths.json');
  mkdirSync(dirname(manifest), { recursive: true });
  const previous = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : [];
  const partial = args.limit || only.size < 3;
  const all = [...new Set([...(partial ? previous : []), ...paths])].sort();
  writeFileSync(manifest, `${JSON.stringify(all, null, 2)}\n`);
  log(`done: ${paths.length} pages (${fetchJson.stats.network} API requests, ${fetchJson.stats.cached} from cache)`);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
