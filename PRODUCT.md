<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-11-11T07:37:57Z
  againstDirection: stardust/direction.md#active-direction
  readArtifacts:
    - stardust/state.json
    - stardust/current/PRODUCT.md
    - stardust/current/_brand-extraction.json
    - stardust/canon-source/_brand-extraction.json
    - stardust/canon-source/DESIGN.md
    - tools/smk/README.md
  synthesizedInputs: [Users, Positioning — inferred, see markers]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred — basis: captured home intro and colour pages address people browsing a national collection by word and by colour -->
Curious visitors and art lovers, art and design students, designers and illustrators looking for colour references, and teachers preparing lessons. Most arrive with a word (an artist, a subject) or a colour in mind and want to see works quickly, then follow links from a work to its colours and on to other works.

## Product Purpose

A colour-first explorer of the public-domain collection of SMK – National Gallery of Denmark. Scope: free-text and colour search with filters, a hub of the 236 colours SMK tags its works with, one page per colour and one page per work, all built on SMK's open (CC0) data.

## Positioning

<!-- _provenance: inferred — basis: home intro, colours hub copy -->
The only way into SMK's open collection by the colours inside the works: pick colours from the museum's own palette and see the paintings, prints and drawings that contain them. It complements open.smk.dk (the catalogue) rather than replacing it.

## Capabilities and Constraints

- Search runs live against the SMK Open API; hub, colour and artwork pages are static, crawlable pages generated from it.
- Only works with an image and in the public domain. Data and images are CC0; SMK is credited on every page.
- Authoring in DA (home intro, nav, footer, colour names and curator notes sheet). Blocks: search, swatches, artworks, facts.
- Typeface must be openly licensed and self-hosted (the design source's Unica77 LL is commercial and not reused).
- Artsy's logo, name and copy are not used; only its design system.

## Brand Commitments

- **Register:** product for search and browse; editorial detail on colour and artwork pages.
- **Personality:** gallery-quiet, editorial, modular-catalogue. Confident and unhurried; the interface is a white wall and the works hang on it.
- **Design system:** adopted closely from Artsy's Palette (monochrome chrome, one sans-serif at one weight, one ultramarine state colour, 10px spacing unit, pill buttons, 3px fields, square imagery).
- **Colour discipline:** SMK's 236 palette colours are data. They appear only where they describe works (swatches, wheel, grid). Chrome never borrows them, and the state colour never stands in for them.
- **Anti-references:**
  - Generic 2026 SaaS silhouette (gradient hero, rounded cards, icon-tile feature grid).
  - Museum-website clichés: full-bleed hero carousels, gold serif "heritage" styling, red ticketing banners.
  - Colourful UI chrome competing with artworks.
  - Rounded or shadowed image cards.

## Evidence on Hand

- `stardust/current/pages/` — home (search), colours hub, colour page, artwork page, with rendered DOM and screenshots.
- `stardust/current/_brand-extraction.json` — current placeholder surface (system font, neutrals).
- `stardust/canon-source/` — design source: Palette tokens (MIT), 8 storybook theme renders, component measurements.
- Content: 236 colour names and curator notes (DA sheet), ~2,100 artwork pages, SMK imagery via the Media Bus.
- Absent, do not fabricate: logo artwork (text wordmark only), photography beyond the artworks, testimonials, events, prices.

## Product Principles

- **Hang the work, hide the frame.** The artwork is the only colourful thing in view; chrome stays black, white and grey.
- **Name every colour.** A colour is always shown with its name and hex, never as an unlabelled dot.
- **Make every view addressable.** Each search, colour and work has its own shareable, indexable URL.
- **Credit the source.** SMK and CC0 are named wherever works appear.
- **Calm over clever.** Hierarchy from size and space, not weight, colour or motion.

## Accessibility & Inclusion

- Text pairs meet WCAG AA (graphite #707070 on white 4.95:1; on #f7f7f7 4.6:1).
- Colour is never the only carrier of meaning: swatches carry names; selected states use outline and text, not hue.
- Visible focus on every control (ultramarine ring); search suggestions and colour pickers keyboard-operable.
- Reduced motion respected.
