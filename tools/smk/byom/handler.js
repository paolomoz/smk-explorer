/**
 * BYOM ("bring your own markup") request handler for the generated pages.
 *
 * Edge Delivery fetches overlay pages from this service when a page is previewed,
 * so re-previewing a page renders it again from fresh API data. Unknown paths
 * answer 404, which makes Edge Delivery fall back to the documents in DA.
 *
 *   /colours                  colours hub
 *   /colours/{name}-{hex}     colour page
 *   /artworks/{id}            artwork page
 */
import {
  loadPalette, nameColours, byHex, loadColourPage, loadArtworkById, findColourBySlug,
  isPublishable,
} from '../lib/data.js';
import {
  renderHub, renderColour, renderArtwork, htmlDocument,
} from '../lib/render.js';

const html = (status, body) => ({ status, body, type: 'text/html; charset=utf-8' });
const notFound = () => html(404, htmlDocument('<div><h1>Not found</h1></div>'));

/** `/colours/x.plain.html`, `/colours/x.html`, `/colours/index` -> `/colours/x`, `/colours` */
export function normalisePath(pathname) {
  let p = decodeURIComponent(pathname).replace(/\.(plain\.)?html$/, '').replace(/\.md$/, '');
  p = p.replace(/\/index$/, '').replace(/\/+$/, '');
  return p.toLowerCase() || '/';
}

/**
 * @param {object} deps
 * @param {(url: string) => Promise<object>} deps.fetchJson polite, cached JSON fetch
 * @param {() => Promise<object[]>} deps.loadSheet rows of the colours sheet
 * @param {string} deps.origin site origin for canonical URLs and JSON-LD
 */
export function createHandler({ fetchJson, loadSheet, origin }) {
  async function namedPalette() {
    const [palette, sheet] = await Promise.all([
      loadPalette(fetchJson),
      loadSheet().catch(() => []),
    ]);
    const named = nameColours(palette.colours, sheet);
    return { palette, named, map: byHex(named) };
  }

  return async function handle(pathname) {
    const path = normalisePath(pathname);

    if (path === '/colours') {
      const { palette, named } = await namedPalette();
      return html(200, htmlDocument(renderHub({
        origin, colours: named, totalWorks: palette.totalWorks,
      })));
    }

    let m = path.match(/^\/colours\/([a-z0-9-]+-[0-9a-f]{6})$/);
    if (m) {
      const { named, map } = await namedPalette();
      const found = findColourBySlug(named, m[1]);
      if (!found || !found.canonical) return notFound();
      const data = await loadColourPage(fetchJson, found.colour.hex, map);
      return html(200, htmlDocument(renderColour({
        origin,
        colour: { ...found.colour, count: data.found },
        together: data.together,
        works: data.works,
      })));
    }

    m = path.match(/^\/artworks\/([a-z0-9][a-z0-9._-]*)$/);
    if (m) {
      const [{ map }, item] = await Promise.all([namedPalette(), loadArtworkById(fetchJson, m[1])]);
      if (!isPublishable(item)) return notFound();
      return html(200, htmlDocument(renderArtwork({ origin, item, palette: map })));
    }

    return notFound();
  };
}
