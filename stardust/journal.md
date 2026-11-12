# Journal — SMK Explorer redesign

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-11-11T07:38:02Z — Extract + direct — brand design defined from Artsy's Palette design system

**Prompt:** Define the brand design for the SMK collection explorer based on www.artsy.net and its Palette storybook; design definition only, no block changes.

**Decisions:**
- Typeface: open look-alike of Unica77 LL (user) → Hanken Grotesk (SIL OFL), self-hosted 400/500; Inter rejected as a reflex-reject font.
- Fidelity: close to Artsy (user) → design-donor Mode A; Palette tokens adopted as-is, role-renamed to museum names.
- Field and pill borders at rest use graphite #707070, not plaster #c2c2c2 (1.78:1 fails WCAG 1.4.11).
- SMK palette colours are data only; ultramarine #1023d7 is the single state colour.
- ia-fidelity stamped verbatim (assumption): page structures are the user's functional brief.
- Primary captured from the collection-explorer branch preview (has the working search); 4 pages, one per template.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json — created (target)
- stardust/direction.md, stardust/prototypes/index-improvements.md — created
- stardust/current/* — created (4 pages, census, brand extraction, PRODUCT/DESIGN, brand-review.html)
- stardust/canon-source/* — created (8 storybook pages, census, tokens, measurements, DESIGN.md/json)
- stardust/state.json — created; 4 pages extracted → directed
- .gitignore (stardust .env block), .hlxignore (stardust/) — updated

**Findings worth flagging:**
- www.artsy.net serves a Cloudflare challenge to headless browsers here; the crawler's headed-Chrome fallback needs a Chrome binary that is not installed. The Palette storybook and @artsy/palette-tokens (MIT) are unblocked and authoritative.
- style-census.mjs finds no text/buttons in Storybook iframe stories; component specs came from a direct probe (named deviation 2).

**Open questions:**
- ia-fidelity verbatim vs reimagined (assumed verbatim).

**Next:** `$stardust prototype index` — render the home/search page in the new system.

---

## 2026-11-11T11:14:43Z — Implement — artwork page in the new design system (direct EDS implementation)

**Prompt:** Implement the artwork details page based on the design just defined.

**Decisions:**
- Implemented straight in the EDS code at the user's request, skipping `prototype` → `deploy` (named deviation: no stardust prototype for `artworks-kms3282`; state stays `directed`).
- Global tokens from DESIGN.md in styles/styles.css (legacy variable names kept as aliases so existing blocks keep working); Hanken Grotesk self-hosted (variable latin + latin-ext, italic latin; OFL in /fonts).
- Artwork template stylesheet at templates/artwork/artwork.css, loaded eagerly for template=artwork: image left at true aspect, title/byline/details right from 768px (equal columns, 2:1 from 1280px); content order unchanged.
- facts: hairline-separated label/value rows; swatches: square chips, name and mono hex on separate lines (hex stays inside the link for a unique accessible name); header: hairline, sm links, aria-current; footer: white with hairline top.

**Artifacts touched:**
- styles/styles.css, styles/fonts.css, fonts/hanken-grotesk-*.woff2, fonts/hanken-grotesk-OFL.txt — updated/created
- templates/artwork/artwork.css, scripts/scripts.js — created/updated
- blocks/facts/facts.css, blocks/swatches/swatches.{js,css}, blocks/header/header.{js,css}, blocks/footer/footer.css — updated

**Open questions:**
- none

**Next:** home/search page against stardust/prototypes/index-improvements.md.

---

## 2026-11-11T13:03:42Z — Extract — Adobe design captured as a library entry (stardust/designs/adobe)

**Prompt:** Extract an "Adobe design" with stardust into a dedicated folder, ready for when the user asks to give a page an Adobe design: fonts, motion, colours, buttons, cards, page layout. Sources: adobe.com Photoshop (UK) and MAX pages.

**Decisions:**
- Stored as an inactive library entry in stardust/designs/adobe/ (not canon-source, not root DESIGN.md), so the active Artsy-based design is untouched.
- Added two pages of the same families (uk/products/illustrator, uk/creativecloud) for button and card evidence.
- Normative values from adobe.com's own --s2a-* (Spectrum 2 for Adobe.com) custom properties; computed styles and hover/scroll probes for the rest.

**Named deviations:**
- Capture through the Playwright MCP browser: crawl.mjs hit adobe.com bot management and its headed-Chrome fallback is unavailable (no Chrome binary; installs forbidden). Page records keep the live-render provenance fields (renderedBy, fetchedAt, waitMs, waitMode, httpStatus).
- Brand surface and DESIGN files assembled by inline scripts from the page records (no shipped aggregator for a design-library entry).

**Artifacts touched:**
- stardust/designs/adobe/{README.md, DESIGN.md, DESIGN.json, _brand-extraction.json, _custom-properties.json, _interaction-states.json, _crawl-log.json, pages/*} — created

**Findings worth flagging:**
- Adobe Clean / Adobe Clean Display are proprietary (Adobe Fonts kit bound to adobe.com): applying the design needs a licensed Adobe Fonts web project or an open substitute (Source Sans 3 suggested).
- Primary button hover colour was not measured (inferred blue-1000).

**Open questions:**
- Typeface and scope (one page vs whole site) when the Adobe design is applied.

**Next:** when asked for an Adobe design, follow stardust/designs/adobe/README.md.

---

## 2026-11-11T14:07:42Z — Implement — Adobe design applied to the artwork template

**Prompt:** Give the page an Adobe design.

**Decisions:**
- Typeface: the user chose real Adobe Clean via an Adobe Fonts web project; the kit ID is pending, wired as ADOBE_FONTS_KIT in templates/artwork/artwork.js (empty → Adobe fallback stack).
- Scope: artwork pages only (templates/artwork/artwork.css). Adobe tokens from stardust/designs/adobe are scoped to body.artwork by re-pointing the site's semantic tokens, so header and footer on artwork pages follow; the rest of the site keeps the root design.
- Kept the flip card; applied Adobe's grey hero band, white rounded content sheet, 16px card radius, display 900 headings, 40px blue/outline pills, 0.3s state easing and a per-element 24px scroll-in reveal (bounded to 160px of scroll so long text is never left faded).

**Named deviation:** a page-template scoped design that diverges from the active root DESIGN.md (Artsy-based); root DESIGN.md not changed.

**Artifacts touched:**
- templates/artwork/artwork.css, templates/artwork/artwork.js — updated

**Open questions:**
- Adobe Fonts kit ID (and the kit's allowed domains: localhost, *.aem.page, *.aem.live).

**Next:** set ADOBE_FONTS_KIT when the ID is available.

---

## 2026-11-11T14:08:58Z — Revert — artwork template back to the root (Artsy-based) design

**Prompt:** Revert to the previous design.

**Decisions:**
- templates/artwork/artwork.css and artwork.js restored to the flip-card version styled by the root design; Adobe Fonts kit loader removed.
- The Adobe design library entry (stardust/designs/adobe/) is kept for later use.

**Artifacts touched:**
- templates/artwork/artwork.css, templates/artwork/artwork.js — reverted

**Open questions:**
- none

**Next:** none pending.

---

## 2026-11-11T14:09:42Z — Revert — artwork flip card removed

**Prompt:** Revert the flipping card too.

**Decisions:**
- templates/artwork/artwork.{js,css} restored to the two-column version: picture left, title/byline/details right, title cap-aligned with the picture top; stacked under 480px.

**Artifacts touched:**
- templates/artwork/artwork.css, templates/artwork/artwork.js — reverted

**Open questions:**
- none

**Next:** none pending.

---

## 2026-11-11T15:36:11Z — Implement — artwork close-up that zooms out on scroll

**Prompt:** Open on a painting close-up, zooming out to the whole work as visitors scroll; authors choose the detail.

**Decisions:**
- Pages without a chosen detail show the whole work (user). Existing 1024px images kept (user): close-ups above ~1.5x look soft.
- Detail source: page metadata "Detail" (x% y% zoom), else the DA sheet /data/artwork-details (Artwork, X, Y, Zoom), read at runtime (capped 600ms) so authors only publish the sheet; no page regeneration.
- Sticky stage: picture stays in place while scrolling zooms it out (45svh mobile, 60svh desktop), then the page continues; reduced motion shows the whole work.
- Author tool: ?detail-picker on any artwork page (click to place, slider to zoom, copy sheet row).
- Sample sheet row: DEP289 (Harvest) 29% 24% 2.5 in content/data/artwork-details.json (local).

**Artifacts touched:**
- templates/artwork/artwork.js, templates/artwork/artwork.css, scripts/scripts.js (await template), content/data/artwork-details.json — updated/created

**Findings worth flagging:**
- position: sticky only travels inside the container content box: scroll room must be a spacer, not padding.

**Open questions:**
- Upload the artwork-details sheet to DA; consider 2048px images for sharper close-ups.

**Next:** none pending.

---

## 2026-11-11T15:50:19Z — Revert — artwork close-up zoom removed

**Prompt:** Revert it (the scroll zoom-out).

**Decisions:**
- templates/artwork/artwork.{js,css} back to the two-column version; scripts/scripts.js no longer awaits the template; sample sheet content/data/artwork-details.json removed.

**Artifacts touched:**
- templates/artwork/artwork.js, templates/artwork/artwork.css, scripts/scripts.js — reverted; content/data/artwork-details.json — deleted

**Open questions:**
- none

**Next:** none pending.

---

## 2026-11-12T16:29:37Z — Implement — artwork details on the back of a real card (flip on hover)

**Prompt:** Put the details behind the picture as a real card and flip the picture on hover to show the details.

**Decisions:**
- Flip card restored (picture alone, centred; title, byline, details on the back; button, tap and focus also flip; reduced motion fades).
- "Real card": soft resting shadow, deeper shadow while turned (lift), pale card-stock back with an inset mount line; 800ms flip easing. No scale on the lift (scaling blurred the back text).

**Named deviation:** card shadow is an intentional exception to DESIGN.md "flat imagery, no shadows on images".

**Artifacts touched:**
- templates/artwork/artwork.js, templates/artwork/artwork.css — updated

**Open questions:**
- none

**Next:** none pending.

---
