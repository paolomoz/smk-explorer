/**
 * SMK Open API helpers (https://api.smk.dk/api/v1, CC0 data).
 *
 * Pure ES module without DOM access, shared by the browser (search block)
 * and Node (page generator and BYOM service). Fetching and caching live in the
 * callers, so each runtime can cache in its own way.
 */

export const API_BASE = 'https://api.smk.dk/api/v1';

/** Only works that have an image and are in the public domain. */
export const BASE_FILTERS = ['has_image:true', 'public_domain:true'];

export const SITE_NAME = 'SMK Explorer';
export const SMK_NAME = 'SMK – National Gallery of Denmark';

/** Search state keys, as they appear in the URL of the search page. */
export const FACETS = [
  { param: 'type', field: 'object_names', label: 'Work type' },
  { param: 'artist', field: 'artist', label: 'Artist' },
  { param: 'nationality', field: 'creator_nationality', label: 'Nationality' },
  { param: 'technique', field: 'techniques', label: 'Technique' },
];

export const CENTURY_FIELD = 'production_dates_start';

const filterValue = (v) => String(v).replace(/[[\]]/g, ' ').trim();

/**
 * Builds the `filters` parameter. All filters are combined (AND), so several
 * colours mean works that contain all of them. Everything goes into one
 * parameter: the API only honours the last `filters` parameter.
 */
export function buildFilters({ colours = [], ...rest } = {}) {
  const parts = [...BASE_FILTERS];
  colours.forEach((c) => parts.push(`colors:${c}`));
  FACETS.forEach(({ param, field }) => {
    const values = [].concat(rest[param] || []).filter(Boolean);
    values.forEach((v) => parts.push(`${field}:${filterValue(v)}`));
  });
  return parts.map((p) => `[${p}]`).join(',');
}

/** Start year of a century, e.g. 1800 -> `[production_dates_start:{1800-…;1899-…}]` */
export function centuryRange(startYear) {
  const y = parseInt(startYear, 10);
  if (Number.isNaN(y)) return null;
  const pad = (n) => String(n).padStart(4, '0');
  return `[${CENTURY_FIELD}:{${pad(y)}-01-01T00:00:00Z;${pad(y + 99)}-12-31T23:59:59Z}]`;
}

/** Range facet that counts works per century. */
export const CENTURY_RANGE_STEP = `[${CENTURY_FIELD}:{1000-01-01T00:00:00Z;2100-01-01T00:00:00Z;+100YEARS}]`;

/**
 * URL for /art/search.
 * @param {object} state { q, colours[], type, artist, nationality, technique, century }
 * @param {object} opts { offset, rows, facets[], facetNum, fields[], centuries }
 */
export function searchUrl(state = {}, opts = {}) {
  const params = new URLSearchParams();
  params.set('keys', state.q && state.q.trim() ? state.q.trim() : '*');
  params.set('filters', buildFilters(state));
  const range = state.century ? centuryRange(state.century) : null;
  if (range) params.set('range', range);
  if (opts.facets && opts.facets.length) {
    params.set('facets', opts.facets.join(','));
    if (opts.facetNum) params.set('facetNum', opts.facetNum);
  }
  if (opts.centuries) params.set('rangeStep', CENTURY_RANGE_STEP);
  if (opts.fields && opts.fields.length) params.set('fields', opts.fields.join(','));
  params.set('offset', opts.offset || 0);
  params.set('rows', opts.rows ?? 24);
  params.set('lang', 'en');
  return `${API_BASE}/art/search/?${params.toString()}`;
}

/** URL to look up one work (object number lookup is case-insensitive). */
export function artworkUrl(objectNumber) {
  return `${API_BASE}/art/?object_number=${encodeURIComponent(objectNumber)}&lang=en`;
}

/** Facet arrays come flat: [value, count, value, count, …]. */
export function pairs(flat = []) {
  const out = [];
  for (let i = 0; i < flat.length; i += 2) out.push({ value: flat[i], count: flat[i + 1] });
  return out;
}

/** Range facet counts (centuries) as [{ start: 1800, count }]. */
export function centuryCounts(response) {
  const r = response?.facets_ranges?.[CENTURY_FIELD];
  if (!r) return [];
  return pairs(r.counts).map(({ value, count }) => ({ start: parseInt(value, 10), count }))
    .filter((c) => c.count > 0);
}

export function centuryLabel(startYear) {
  const n = Math.floor(parseInt(startYear, 10) / 100) + 1;
  const suffix = (n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
  return `${n}${suffix} century`;
}

/** Page id for a work: object number in lower case, `/` replaced by `-`. */
export function artworkId(objectNumber) {
  return String(objectNumber).toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-');
}

export function artworkPath(objectNumber) {
  return `/artworks/${artworkId(objectNumber)}`;
}

/**
 * IIIF image URL on SMK's thumbnail server. The default size is the API's own
 * `image_thumbnail` (1024px wide), which SMK serves from its cache; other sizes are
 * rendered on demand and can be slow, so the site uses one URL per work everywhere.
 * @param {object} item API item
 * @param {string} [size] IIIF size, e.g. `!1024,`
 */
export function iiifImage(item, size = '!1024,') {
  if (!item) return null;
  if (size === '!1024,' && item.image_thumbnail) return item.image_thumbnail;
  if (item.image_iiif_id) {
    const id = item.image_iiif_id.replace('https://iip.smk.dk/', 'https://iip-thumb.smk.dk/');
    return `${id}/full/${size}/0/default.jpg`;
  }
  return item.image_thumbnail || null;
}

/** Prefers the English title, falls back to the first one. */
export function title(item) {
  const titles = item?.titles || [];
  const en = titles.find((t) => /engelsk|english/i.test(t.language || ''));
  return (en || titles[0])?.title?.trim() || 'Untitled';
}

export function artists(item) {
  const list = item?.artist?.length ? item.artist : (item?.production || [])
    .map((p) => p.creator).filter(Boolean);
  return [...new Set(list)];
}

export function dateLabel(item) {
  const d = item?.production_date?.[0];
  if (!d) return '';
  if (d.period) return d.period;
  const s = d.start ? parseInt(d.start, 10) : null;
  const e = d.end ? parseInt(d.end, 10) : null;
  if (s && e && s !== e) return `${s}–${e}`;
  return s ? String(s) : '';
}

const UNIT_ORDER = ['height', 'width', 'depth', 'diameter'];

/** "53 × 63 cm" from the API dimensions, preferring the main (net) measurement. */
export function dimensionsLabel(item) {
  const dims = item?.dimensions || [];
  if (!dims.length) return '';
  const parts = [...new Set(dims.map((d) => d.part || ''))];
  const preferred = parts.find((p) => /netto|bladmaal|plademaal|billedmaal/i.test(p)) ?? parts[0];
  const chosen = dims.filter((d) => (d.part || '') === preferred && d.value)
    .sort((a, b) => UNIT_ORDER.indexOf(a.type) - UNIT_ORDER.indexOf(b.type));
  if (!chosen.length) return '';
  const unit = chosen[0].unit || '';
  const names = chosen.map((d) => d.type).filter(Boolean);
  const label = `${chosen.map((d) => d.value).join(' × ')} ${unit}`.trim();
  return names.length > 1 ? `${label} (${names.join(' × ')})` : label;
}

export function description(item) {
  const label = (item?.labels || []).map((l) => l.text).filter(Boolean)[0];
  const content = [].concat(item?.content_description || []).filter(Boolean).join(' ');
  return (label || content || '').replace(/\r?\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export function creditLine(item) {
  const c = [].concat(item?.credit_line || []).filter(Boolean).join('; ');
  return c || SMK_NAME;
}

export function workTypes(item) {
  return (item?.object_names || []).map((o) => o.name).filter(Boolean);
}

export function techniques(item) {
  return [].concat(item?.techniques || []).filter(Boolean);
}

export function nationalities(item) {
  return [...new Set((item?.production || []).map((p) => p.creator_nationality).filter(Boolean))];
}

/** Fields needed to render result cards. */
export const CARD_FIELDS = [
  'object_number', 'titles', 'artist', 'production', 'production_date',
  'image_iiif_id', 'image_thumbnail', 'image_width', 'image_height', 'colors',
];
