<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-11T07:36:15Z
  readArtifacts:
    - https://collection-explorer--smk-explorer--paolomoz.aem.page/ (+ /colours, /colours/gold-f6d727, /artworks/kms3282)
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/*.json
    - tools/smk/README.md
  synthesizedInputs: [Users, Positioning — inferred from captured copy]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web (Adobe Edge Delivery Services; DA-authored documents plus pages generated from the SMK Open API)

## Users

_provenance: inferred_ — basis: captured copy addresses people browsing a national art collection by word and by colour.
Curious visitors, art and design students, designers looking for colour references, and teachers. They come with a word (an artist, a subject) or a colour in mind, and want to see works quickly and follow links between them.

## Product Purpose

An explorer for the ~39,500 public-domain works with images held by SMK – National Gallery of Denmark: free-text and colour search with filters (work type, artist, nationality, technique, century), a hub of the 236 colours SMK tags its works with, a page per colour, and a page per work.

## Positioning

_provenance: inferred_ — basis: home intro and colour pages.
A colour-first way into SMK's open collection. Where open.smk.dk is the museum's catalogue, this site lets people browse by the colours inside the paintings, prints and drawings.

## Capabilities and Constraints

- Search and colour pickers call the SMK Open API live in the browser; the hub, colour and artwork pages are static, crawlable pages.
- Images come from SMK's IIIF server (generated pages via the Media Bus).
- Data and images are CC0; every page credits SMK – National Gallery of Denmark.
- Content is authored in DA (home intro, nav, footer, colours sheet); blocks: search, swatches, artworks, facts.

## Brand Commitments

- Register: product (search and browse tool), with editorial detail pages (colour, artwork) that lean brand.
- Observed personality: plain, factual, catalogue-like. The current look is an intentional placeholder (system font, neutral greys) awaiting a design.
- Observed anti-references: none stated.
- The colours shown are data (SMK's palette), never decoration.

## Evidence on Hand

- `stardust/current/pages/` — 4 page records + rendered DOM (home with search, colours hub, colour page, artwork page)
- `stardust/current/assets/screenshots/` — full-page captures
- `stardust/current/_computed-styles.json` — computed-style census (1440px)
- `stardust/current/_brand-extraction.json` — consolidated surface

## Product Principles

- The artwork is the hero; the interface steps back.
- Every view is shareable and indexable (URL state, static generated pages).
- Credit SMK and the CC0 licence everywhere.

## Accessibility & Inclusion

Search, filters and colour buttons are labelled; colour choices are named (nearest CSS colour), not only shown; works have alt text built from title and artist.
