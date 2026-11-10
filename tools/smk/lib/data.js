/**
 * Loads the data behind the generated pages. Every function takes `fetchJson(url)`,
 * so the generator (disk cache + delay) and the BYOM service (edge cache) can
 * each bring their own polite fetching.
 */
import {
  searchUrl, artworkUrl, pairs, CARD_FIELDS, artworkId,
} from '../../../scripts/smk-api.js';
import {
  namePalette, normaliseHex, describeColour, hexFromSlug, colourSlug,
} from '../../../scripts/colour-names.js';

export const WORKS_PER_COLOUR = 24;
export const TOGETHER = 10;
/** Fixed seed: SMK highlights first, in a stable order between runs. */
export const HIGHLIGHT_SEED = 'smk';

/** All palette colours used on public-domain works with an image, with counts. */
export async function loadPalette(fetchJson) {
  const res = await fetchJson(searchUrl({}, { rows: 0, facets: ['colors'], facetNum: -1 }));
  return {
    totalWorks: res.found,
    colours: pairs(res.facets?.colors)
      .map(({ value, count }) => ({ hex: normaliseHex(value), count }))
      .filter((c) => c.hex),
  };
}

/**
 * Merges the palette with the authored colour sheet (hex, name, note).
 * Colours missing from the sheet get their computed name (nearest CSS colour in Lab).
 * @param {{hex,count}[]} colours
 * @param {object[]} sheetRows rows of the colours sheet (may be empty)
 */
export function nameColours(colours, sheetRows = []) {
  const computed = namePalette(colours.map((c) => c.hex));
  const authored = new Map();
  sheetRows.forEach((r) => {
    const hex = normaliseHex(r.hex || r.Hex);
    if (hex) authored.set(hex, r);
  });
  return colours.map((c) => {
    const a = authored.get(c.hex) || {};
    return {
      ...c,
      name: (a.name || a.Name || '').trim() || computed.get(c.hex).name,
      note: (a.note || a.Note || '').trim(),
    };
  });
}

/** Map hex -> named colour */
export const byHex = (named) => new Map(named.map((c) => [c.hex, c]));

/** Finds a colour by page slug. `canonical` is false when the name part is out of date. */
export function findColourBySlug(named, slug) {
  const hex = hexFromSlug(slug);
  const colour = named.find((c) => c.hex === hex);
  if (!colour) return null;
  return { colour, canonical: colourSlug(colour.name, colour.hex) === slug };
}

/** Works containing a colour, plus the colours that most often appear with it. */
export async function loadColourPage(fetchJson, hex, palette, rows = WORKS_PER_COLOUR) {
  const url = `${searchUrl({ colours: [hex] }, {
    rows, facets: ['colors'], facetNum: TOGETHER + 1, fields: CARD_FIELDS,
  })}&randomHighlights=${HIGHLIGHT_SEED}`;
  const res = await fetchJson(url);
  const together = pairs(res.facets?.colors)
    .map(({ value, count }) => ({ hex: normaliseHex(value), count }))
    .filter((c) => c.hex && c.hex !== hex && palette.has(c.hex))
    .slice(0, TOGETHER)
    .map((c) => ({ ...palette.get(c.hex), count: c.count }));
  return { found: res.found, works: res.items || [], together };
}

/** Full records for several works at once (the API accepts comma-separated object numbers). */
export async function loadArtworks(fetchJson, objectNumbers) {
  if (!objectNumbers.length) return [];
  const res = await fetchJson(artworkUrl(objectNumbers.join(',')));
  return res.items || [];
}

/**
 * One work by page id. The id is the object number in lower case with `/` replaced
 * by `-`; the lookup is case-insensitive, so try the id as-is first, then with the
 * dashes turned back into slashes.
 */
export async function loadArtworkById(fetchJson, id) {
  const candidates = [id];
  const dashes = [...id.matchAll(/-/g)].map((m) => m.index);
  dashes.reverse().forEach((i) => candidates.push(`${id.slice(0, i)}/${id.slice(i + 1)}`));
  if (dashes.length > 1) candidates.push(id.replace(/-/g, '/'));
  return candidates.reduce(async (found, candidate) => {
    const item = await found;
    if (item) return item;
    const res = await fetchJson(artworkUrl(candidate));
    return (res.items || []).find((i) => artworkId(i.object_number) === id) || null;
  }, Promise.resolve(null));
}

/** Whether a work belongs on the site (image and public domain). */
export const isPublishable = (item) => Boolean(item)
  && item.has_image !== false && item.public_domain !== false;

/** Seed rows for the colours sheet: computed name and a short descriptive note. */
export function seedSheetRows(named, togetherByHex = new Map()) {
  return named.map((c) => {
    const friends = (togetherByHex.get(c.hex) || []).slice(0, 2).map((t) => t.name.replace(/ #[0-9a-f]{6}$/, '').toLowerCase());
    const unique = [...new Set(friends)];
    const withText = unique.length ? ` In SMK's works it most often appears alongside ${unique.join(' and ')}.` : '';
    return { hex: c.hex, name: c.name, note: `${describeColour(c.hex)}.${withText}` };
  });
}
