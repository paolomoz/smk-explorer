/**
 * Renders the generated pages (colours hub, colour pages, artwork pages) as
 * Edge Delivery markup: sections are top-level <div>s, blocks are
 * <div class="name"> tables of rows and cells, page metadata is a metadata block.
 *
 * Everything a crawler needs (titles, text, links, images, JSON-LD) is in the markup.
 * Images are absolute IIIF URLs: Edge Delivery copies them to the Media Bus on
 * preview, so the delivered pages serve them from the site as responsive images.
 *
 * Pure functions (no I/O), shared by the generator (Node) and the BYOM service.
 */
import {
  SITE_NAME, SMK_NAME, artworkPath, iiifImage, title, artists, dateLabel, dimensionsLabel,
  description, creditLine, workTypes, techniques,
} from '../../../scripts/smk-api.js';
import { colourPath, normaliseHex } from '../../../scripts/colour-names.js';

export const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
export const SMK_URL = 'https://www.smk.dk/';

const nf = new Intl.NumberFormat('en-GB');
export const fmt = (n) => nf.format(n || 0);
export const plural = (n, one, many) => `${fmt(n)} ${n === 1 ? one : many}`;

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const p = (html) => `<p>${html}</p>`;
const row = (...cells) => `<div>${cells.map((c) => `<div>${c}</div>`).join('')}</div>`;
const block = (name, rows) => `<div class="${esc(name)}">${rows.join('')}</div>`;
const section = (...parts) => `<div>${parts.filter(Boolean).join('')}</div>`;

function truncate(text, max = 160) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length)}…`;
}

/** Metadata block. JSON-LD goes in the `json-ld` property, which Edge Delivery
 * turns into a <script type="application/ld+json"> in the head. */
function metadata(props) {
  const rows = Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => row(esc(k), esc(typeof v === 'string' ? v : JSON.stringify(v))));
  return section(block('metadata', rows));
}

function picture(src, alt, width, height) {
  const dims = width && height ? ` width="${width}" height="${height}"` : '';
  return `<picture><img src="${esc(src)}" alt="${esc(alt)}"${dims}></picture>`;
}

/** Image dimensions scaled to fit a IIIF `!w,h` box. */
function fitSize(item, box) {
  const w = item.image_width;
  const h = item.image_height;
  if (!w || !h) return [null, null];
  const scale = Math.min(1, box / Math.max(w, h));
  return [Math.round(w * scale), Math.round(h * scale)];
}

const searchPath = (colours) => `/?colours=${colours.map((c) => normaliseHex(c).slice(1)).join(',')}`;

/** Swatch rows: hex | name (linked) | count */
function swatchRow(colour, countText, linkIt = true) {
  const name = linkIt ? link(colourPath(colour.name, colour.hex), colour.name) : esc(colour.name);
  return row(esc(colour.hex), p(name), countText ? p(esc(countText)) : '');
}

/** Artwork card rows: picture | title (linked), artist, date */
function artworkRow(item) {
  const t = title(item);
  const who = artists(item).join(', ');
  const [w, h] = fitSize(item, 1024);
  return row(
    picture(iiifImage(item), `${t}${who ? ` by ${who}` : ''}`, w, h),
    [
      p(link(artworkPath(item.object_number), t)),
      who ? p(esc(who)) : '',
      dateLabel(item) ? p(esc(dateLabel(item))) : '',
    ].join(''),
  );
}

function organisation() {
  return { '@type': 'Museum', name: SMK_NAME, url: SMK_URL };
}

/**
 * Colours hub.
 * @param {object} d { origin, colours: [{hex, name, count}], totalWorks }
 */
export function renderHub(d) {
  const { origin, colours, totalWorks } = d;
  const url = `${origin}/colours`;
  const pageTitle = 'Colours in the SMK collection';
  const desc = `Browse the ${colours.length} colours SMK – National Gallery of Denmark uses to tag ${fmt(totalWorks)} public-domain works, with the number of works for each.`;
  const sorted = [...colours].sort((a, b) => b.count - a.count);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: desc,
    url,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${origin}/` },
    about: organisation(),
    license: CC0,
    mainEntity: {
      '@type': 'ItemList',
      name: 'SMK colour palette',
      numberOfItems: sorted.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: sorted.map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: c.name, url: `${origin}${colourPath(c.name, c.hex)}`,
      })),
    },
  };
  return [
    section(
      `<h1>${esc(pageTitle)}</h1>`,
      p(`SMK tags every digitised work with the colours found in its image. These are the ${fmt(colours.length)} colours used on the ${fmt(totalWorks)} works that have an image and are in the public domain. Each colour is named after the nearest CSS colour.`),
      p(`Open a colour to see the works that contain it and the colours it most often appears with, or ${link('/', 'search the collection by colour')}.`),
    ),
    section(block('swatches', sorted.map((c) => swatchRow(c, plural(c.count, 'work', 'works'))))),
    metadata({
      title: `${pageTitle} | ${SITE_NAME}`,
      description: desc,
      template: 'colours',
      'json-ld': jsonLd,
    }),
  ].join('\n');
}

/**
 * Colour page.
 * @param {object} d { origin, colour: {hex, name, note, count}, together: [{hex,name,count}],
 *   works: [item], totalWorks }
 */
export function renderColour(d) {
  const {
    origin, colour, together, works,
  } = d;
  const path = colourPath(colour.name, colour.hex);
  const url = `${origin}${path}`;
  const search = searchPath([colour.hex]);
  const countText = plural(colour.count, 'work', 'works');
  const label = colour.name.includes(colour.hex) ? colour.name : `${colour.name} (${colour.hex})`;
  const desc = truncate(`${label} in the SMK collection: ${countText} in the public domain contain this colour. ${colour.note || ''}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${colour.name} in the SMK collection`,
    description: desc,
    url,
    isPartOf: { '@type': 'CollectionPage', name: 'Colours in the SMK collection', url: `${origin}/colours` },
    about: { '@type': 'Thing', name: colour.name, identifier: colour.hex },
    license: CC0,
    mainEntity: {
      '@type': 'ItemList',
      name: `Works with ${colour.name}`,
      numberOfItems: works.length,
      itemListElement: works.map((w, i) => ({
        '@type': 'ListItem', position: i + 1, name: title(w), url: `${origin}${artworkPath(w.object_number)}`,
      })),
    },
    relatedLink: together.map((c) => `${origin}${colourPath(c.name, c.hex)}`),
  };
  return [
    section(
      `<h1>${esc(colour.name)}</h1>`,
      block('swatches feature', [swatchRow(colour, `${colour.hex} · ${countText}`, false)]),
      colour.note ? p(esc(colour.note)) : '',
      p(`${esc(countText.charAt(0).toUpperCase() + countText.slice(1))} with an image and in the public domain contain this colour.`),
      p(`<strong>${link(search, `Search works with ${colour.name}`)}</strong>`),
    ),
    together.length ? section(
      '<h2>Often together</h2>',
      p(`The ${together.length === 1 ? 'colour' : `${together.length} colours`} that most often appear in the same works as ${esc(colour.name)}.`),
      block('swatches', together.map((c) => swatchRow(c, `${plural(c.count, 'work', 'works')} together`))),
    ) : '',
    section(
      `<h2>Works with ${esc(colour.name)}</h2>`,
      works.length ? block('artworks', works.map(artworkRow)) : p('No works found.'),
      colour.count > works.length ? p(link(search, `See all ${countText} with ${colour.name}`)) : '',
    ),
    metadata({
      title: `${colour.name} – colour in the SMK collection | ${SITE_NAME}`,
      description: desc,
      template: 'colour',
      'json-ld': jsonLd,
    }),
  ].join('\n');
}

/**
 * Artwork page.
 * @param {object} d { origin, item, palette: Map<hex, {hex,name}> }
 */
export function renderArtwork(d) {
  const { origin, item, palette } = d;
  const t = title(item);
  const who = artists(item);
  const date = dateLabel(item);
  const types = workTypes(item);
  const techs = techniques(item);
  const dims = dimensionsLabel(item);
  const text = description(item);
  const credit = creditLine(item);
  const path = artworkPath(item.object_number);
  const url = `${origin}${path}`;
  const colours = (item.colors || []).map(normaliseHex).filter((h) => palette.has(h))
    .map((h) => palette.get(h));
  const [w, h] = fitSize(item, 1024);
  const byline = [who.join(', '), date].filter(Boolean).join(', ');

  const facts = [
    ['Artist', who.map((a) => link(`/?artist=${encodeURIComponent(a)}`, a)).join(', ')],
    ['Date', esc(date)],
    ['Type', types.map((x) => link(`/?type=${encodeURIComponent(x.toLowerCase())}`, x)).join(', ')],
    ['Technique', techs.map((x) => link(`/?technique=${encodeURIComponent(x.toLowerCase())}`, x)).join(', ')],
    ['Dimensions', esc(dims)],
    ['Inventory number', esc(item.object_number)],
    ['Credit line', esc(credit)],
  ].filter(([, v]) => v);

  const desc = truncate([
    `${t}${who.length ? ` by ${who.join(', ')}` : ''}${date ? `, ${date}` : ''}.`,
    [types[0], techs[0]].filter(Boolean).join(', '),
    text,
  ].filter(Boolean).join(' '));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: t,
    url,
    identifier: item.object_number,
    sameAs: item.frontend_url,
    description: text ? truncate(text, 500) : undefined,
    creator: who.map((name) => {
      const prod = (item.production || []).find((x) => x.creator && name.includes(x.creator_surname || '~'));
      return {
        '@type': 'Person', name, nationality: prod?.creator_nationality || undefined,
      };
    }),
    dateCreated: date || undefined,
    artform: types[0],
    artMedium: techs.join(', ') || undefined,
    artworkSurface: (item.materials || []).join(', ') || undefined,
    creditText: credit,
    license: CC0,
    isAccessibleForFree: true,
    keywords: colours.map((c) => c.name).join(', ') || undefined,
    provider: organisation(),
  };

  return [
    section(
      picture(iiifImage(item), `${t}${who.length ? ` by ${who.join(', ')}` : ''}`, w, h),
      `<h1>${esc(t)}</h1>`,
      byline ? p(esc(byline)) : '',
      block('facts', facts.map(([k, v]) => row(esc(k), v))),
    ),
    colours.length ? section(
      '<h2>Colours</h2>',
      p(`SMK tags this work with ${colours.length === 1 ? 'one colour' : `${colours.length} colours`}. Each links to the other works that contain it.`),
      block('swatches compact', colours.map((c) => swatchRow(c, ''))),
      colours.length > 1 ? p(link(searchPath(colours.slice(0, 3).map((c) => c.hex)), `Find works with ${colours.slice(0, 3).map((c) => c.name).join(', ')}`)) : '',
    ) : '',
    section(
      '<h2>About the work</h2>',
      text ? p(esc(text)) : p('SMK has not published a description of this work.'),
      item.frontend_url ? p(`<strong>${link(item.frontend_url, `See ${t} on open.smk.dk`)}</strong>`) : '',
    ),
    metadata({
      title: `${t}${who.length ? ` – ${who[0]}` : ''} | ${SITE_NAME}`,
      description: desc,
      template: 'artwork',
      'json-ld': JSON.parse(JSON.stringify(jsonLd)),
    }),
  ].join('\n');
}

/** Full HTML document, as served by the BYOM service. */
export function htmlDocument(main) {
  return `<!DOCTYPE html>
<html>
<head></head>
<body>
<header></header>
<main>
${main}
</main>
<footer></footer>
</body>
</html>
`;
}
