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
