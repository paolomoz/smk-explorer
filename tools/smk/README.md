# SMK collection explorer: generated pages

Data: [SMK Open API](https://api.smk.dk/api/v1), CC0. Only works with an image and in the
public domain (`[has_image:true],[public_domain:true]`).

## What is where

| Page | Source | How it gets to Edge Delivery |
| --- | --- | --- |
| `/` (intro + `search` block) | document in DA | authored |
| `/nav`, `/footer` | documents in DA | authored |
| `/data/colours` | sheet in DA (`hex`, `name`, `note`) | authored, seeded by the generator |
| `/colours` | SMK API | BYOM overlay (or uploaded document) |
| `/colours/{name}-{hex}` (236) | SMK API + colours sheet | BYOM overlay (or uploaded document) |
| `/artworks/{id}` (~2,100) | SMK API | BYOM overlay (or uploaded document) |

Artwork pages exist for every work shown on a colour page (24 per colour, SMK highlights
first). The page id is the object number in lower case, with `/` replaced by `-`.

Colour names: nearest CSS named colour in CIELAB (ΔE76), see `scripts/colour-names.js`.
When several palette colours share a name, the hex is appended. Authors can change names
and notes in the sheet. The URL slug is built from the name, so renaming a colour changes
its URL.

## Shared code

- `scripts/smk-api.js`, `scripts/colour-names.js`: used by the browser (search block) and Node.
- `tools/smk/lib/render.js`: page markup (sections, blocks, metadata, JSON-LD). Images
  are absolute IIIF URLs: on preview, Edge Delivery copies them to the Media Bus, so the
  delivered pages serve responsive images from the site.
- `tools/smk/lib/data.js`: what each page needs from the API.

## Generator (local content)

```
node tools/smk/generate.js            # all pages into content/
node tools/smk/generate.js --limit 5  # first 5 colours only
node tools/smk/generate.js --refresh  # ignore the API cache
```

About 290 API requests for all 2,373 pages: one for the palette, one per colour (works and
"often together" in a single request), and one per 40 artworks. Responses are cached in
`tools/smk/.cache` for 7 days, and requests are spaced by 500 ms (`--delay`).

## BYOM service (fresh data on every preview)

`tools/smk/byom/` renders the same pages on request. Edge Delivery fetches overlay pages
when they are previewed, so re-previewing a page refreshes its data. Unknown paths answer
404, so DA documents still work.

```
node tools/smk/byom/server.js          # local test on http://localhost:8787
npx wrangler deploy -c tools/smk/byom/wrangler.toml   # Cloudflare Worker
```

The worker caches API responses for `CACHE_TTL` seconds (600) and allows two API requests
at a time. After it is deployed, add it as the overlay in the site configuration
(`tools/smk/config/overlay.json`).

## Site configuration

Configuration lives in the config service, not in the repo:

- `tools/smk/config/query.yaml`: query index (all pages, with `template` and `robots`)
- `tools/smk/config/sitemap.yaml`: `/sitemap.xml` from the query index
- `tools/smk/config/robots.txt`: points crawlers to the sitemap
- `tools/smk/config/overlay.json`: the BYOM overlay

## Preview and publish

`tools/smk/publish.js` previews and publishes the pages one by one with a delay
(`--preview`, `--publish`). It can also upload the generated pages to DA (`--upload`),
for use without the overlay. Publishing adds the pages to the query index and the sitemap.

## SEO

- Title, description and canonical on every page (canonical is set by Edge Delivery
  from the path).
- JSON-LD: `VisualArtwork` on artwork pages, `CollectionPage` + `ItemList` on the hub and
  colour pages (`json-ld` metadata).
- Search URLs (`/?q=…`, `/?colours=…`) get `noindex, follow`; their canonical is `/`.
