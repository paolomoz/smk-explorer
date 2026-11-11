<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-11-11T07:37:57Z
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/canon-source/_brand-extraction.json
    - stardust/canon-source/DESIGN.md
  synthesizedInputs: [Users and Positioning in PRODUCT.md (inferred, marked)]
  stardustVersion: 0.32.1
-->
---
title: "define the brand design based on Artsy and its Palette storybook"
resolvedAt: 2026-11-11T07:37:57Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

# Active direction (2026-11-11T07:37:57Z)

## Phrase

> with stardust define the brand design based on https://www.artsy.net/ and it's storybook https://palette-storybook.artsy.net/

## Restatement

Give the SMK collection explorer a real design system by adopting Artsy's Palette closely: a monochrome, gallery-white interface where one grotesque at one weight sets hierarchy through size, one ultramarine marks state, and the artworks plus SMK's colour data supply all the colour. Content, page structure and functionality stay as built. Only the design system is defined here; no blocks change yet.

## Movements

- **register** — `product` for search/browse, `brand` (editorial) for colour and artwork pages (inherited from current/PRODUCT.md)
- **expressive axis** — placeholder → `restrained` (design source is restrained by design)
- **tone** — neutral → `serious`, quiet (gallery)
- **density** — `balanced (donor-inherited)`: Palette 10px unit, section rhythm 60px desktop / 40px tablet and mobile
- **distinctiveness** — `familiar` → `distinctive` through the donor's discipline, not ornament
- **audience** — curious visitors, students, designers, teachers (inferred from captured copy)
- **ia-fidelity** — `verbatim (assumption)`: the page structures are the functional brief the user set; only the surface changes. Correct this if the prototype may move sections.
- **constraints** — open-licence typeface only; no Artsy logo, name or copy; WCAG AA; SMK credited on every page

## Gaps and questions

1. **Q:** Artsy's typeface, Unica77 LL, needs a paid licence. Which typeface should the SMK design use? (a) open look-alike, (b) Helvetica stack, (c) licensed Unica77.
   **A:** (a) open look-alike.
2. **Q:** How closely should the SMK explorer follow Artsy's design system? (a) close to Artsy, (b) Artsy-based with an SMK accent.
   **A:** (a) close to Artsy.

## Anchor references

- Artsy Palette design system (storybook + @artsy/palette-tokens 7.3.0, MIT) — design source, all tokens.

## Anti-references

- Generic 2026 SaaS silhouette (toolkit § 1).
- Museum-site clichés: hero carousels, gold serif heritage styling, ticketing banners.
- Colourful chrome competing with artworks.

## Divergence inputs

- **mode** — design-donor Mode A. Primary signal `signal-thin` (placeholder); donor signal `signal-strong`. Palette and type pinned to the donor.
- **seed** — implied by the donor, not rolled: `2025-now × gallery catalogue × catalogue × stark-white`; picked_by `anchor-reference: Artsy Palette`; ground-family override `brand-faithful`.
- **font deck** — donor-inherited Unica77 LL, substituted by **Hanken Grotesk** (SIL OFL; user constraint "open look-alike"; Inter rejected as a reflex-reject font, Hanken Grotesk is its listed substitute; self-hosted 400/500).
- **palette** — inherited from Palette tokens, role-renamed to museum names (etching-black, graphite, plaster, mount-board, hairline, gallery-floor, gallery-wall, ultramarine, verdigris, ochre, vermilion).
- **anti-toolbox audit** — 1 hit (pill buttons), justified as the donor's signature component shape.
- **brand-faithful inversions** — pure-white retention (#ffffff page ground, Palette mono0); pure-black retention (#000000 text and primary button, Palette mono100); hex format retention (Palette tokens are hex); sharp 0px corner retention (images, cards, panels); saturated colour retention (ultramarine #1023d7 as sole state colour).
- **brand-adjacent refinements** — field and pill borders at rest use graphite #707070 instead of plaster #c2c2c2 (1.78:1 fails WCAG 1.4.11; graphite 4.95:1 is a Palette token); typeface substitution as above.
- **motion register** — `editorial` (selected only; not applied until a cinematic prototype).

## Named deviations

1. **Design source captured from Artsy's design system, not www.artsy.net.** www.artsy.net answered a Cloudflare challenge (403) on every page; the crawler's headed-Chrome fallback needs a Chrome binary this environment lacks, and installing one is forbidden. Replacement: the Palette storybook (8 Theme stories, live renders via the bundled crawler) and the published @artsy/palette-tokens 7.3.0 (MIT) as normative values. Lives in `stardust/canon-source/`; logs in `stardust/.work/extract/`.
2. **Component measurements by direct probe.** The style census found no text or buttons in storybook stories (its generic selectors miss story markup). A one-off live probe measured buttons, inputs, type and tabs; output kept at `stardust/canon-source/storybook/component-measurements.json`.
3. **Brand-surface files authored from census output.** `_brand-extraction.json` for both origins was assembled from `_computed-styles.json`, page records and the token package by an inline script (no shipped aggregator exists for this step).

## Command sequence (proposed, not run)

1. `$stardust direct` — this step: PRODUCT.md, DESIGN.md, DESIGN.json, improvements list.
2. `$stardust prototype index` — home/search prototype against DESIGN.md and `stardust/prototypes/index-improvements.md` (`$impeccable shape` → `craft` → `typeset` → `critique` → `polish`).
3. Then the artwork, colour and colours-hub templates, and applying the system to `styles/` and the blocks.

## User confirmation

> Answers to the two questions above ("Open look-alike", "Close to Artsy"); plan accepted with them.

## Pages in scope

- `index`, `colours`, `colours-gold-f6d727`, `artworks-kms3282` (one per template; the system applies to all 2,373 generated pages through the shared blocks).
