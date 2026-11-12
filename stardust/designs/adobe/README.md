<!-- stardust:provenance
  writtenBy: stardust:extract (design library: adobe)
  stardustVersion: 0.32.1
-->
# Adobe design (library entry)

A captured, ready-to-apply design source taken from adobe.com (Spectrum 2 for Adobe.com). It is **not active**: the site's current design is the root `DESIGN.md` (Artsy Palette based). Use this folder when asked to "give the page an Adobe design".

## Source pages (captured 2026-11-11, live renders, 1440px)

- https://www.adobe.com/uk/products/photoshop.html (named by the user)
- https://www.adobe.com/max.html (named by the user)
- https://www.adobe.com/uk/products/illustrator.html (same product template)
- https://www.adobe.com/uk/creativecloud.html (hub with merch cards)

## What is here

| File | Contents |
|---|---|
| `DESIGN.md` | The design system: colours, type scale, spacing, radii, buttons, cards, layout, motion, do's and don'ts (Stitch frontmatter + 8 sections) |
| `DESIGN.json` | Sidecar: motion tokens (easings, durations, scroll-driven reveal spec, signature motions), breakpoints, layout, font licence note, component HTML/CSS snippets |
| `_brand-extraction.json` | Consolidated evidence: palette ramps, both type scales (s2a and Milo), spacing, motifs, component metrics, motion, voice, with sources |
| `_custom-properties.json` | All 760 `:root` custom properties read from the pages (`--s2a-*` tokens, Milo `--type-*`, `--spacing-*`, `--grid-*`) |
| `_interaction-states.json` | Hover/focus probe results and scroll-driven animation timelines |
| `pages/*.json`, `pages/*.html` | Per-page records (headings, body, CTAs, cards, sections, motion, colours) and the rendered DOM |
| `assets/screenshots/` | Full-page screenshots (not committed; regenerate by re-capturing) |
| `_crawl-log.json` | How the capture ran, vision checks |

## The design in one paragraph

Adobe Clean Display at 900 with tight negative tracking for headings (H2 56/56, -1.68px), Adobe Clean 18/27 body in #2c2c2c. One action colour, blue #3b63fb, on 40px pill buttons (17px bold, 2px border); outline pills in #2c2c2c. Light (#fff, #f8f8f8, #f3f3f3) and black bands alternate full bleed; content on a 12-column 1200px grid. Media cards have 16px corners and no shadow; merch cards are #eaeaea with 8px corners. The hero is split (copy left, media bleeding right), with a rounded white sheet rising over it. Motion: content rises 24px and fades in as it scrolls into view (view() timelines, staggered); the hero pins and pans; state changes take 0.3s cubic-bezier(0.42, 0, 0, 1); autoplaying muted video has a pause button; reduced motion is honoured.

## Applying it later ("give the page an Adobe design")

1. **Decide the typeface first.** Adobe Clean / Adobe Clean Display are proprietary and served from an Adobe Fonts kit bound to adobe.com. Either create an Adobe Fonts web project licensed for this site's domain, or use an open substitute (nearest relative: Source Sans 3, an Adobe Original under the SIL OFL).
2. **Choose the scope:** one page (e.g. the artwork template) or the whole site. A whole-site switch replaces the Artsy-based system.
3. **Run it through stardust:** point `stardust/state.json` → `designSource` at `stardust/designs/adobe/` and run `$stardust direct --re-direct` (this rewrites root `PRODUCT.md`/`DESIGN.md`/`DESIGN.json`, keeping the current version in `stardust/direction.md` history, and marks prototyped pages stale). For a single page, implement it as a page template (`templates/<name>/`) using the tokens here, without touching the global styles.
4. **Keep the data rules:** SMK palette colours remain data; Adobe's blue is for actions only.

Not reused: Adobe logo, product names, product colours, copy, imagery.
