<!-- stardust:provenance
  writtenBy: stardust:direct (Phase 2.5, Mode A)
  writtenAt: 2026-11-11T07:37:57Z
  againstDirection: stardust/direction.md#active-direction
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/pages/index.json
    - stardust/current/brand-review.html (tensions T-scale, T-logo-variants, T-no-brand-accent)
    - blocks/search/search.css
    - blocks/artworks/artworks.css
    - DESIGN.md
  synthesizedInputs: []
  stardustVersion: 0.32.1
-->
# Improvements — home / search (`index`)

Gap between the current placeholder and a competent execution of the target system (DESIGN.md, Artsy Palette). Applies to the shared blocks too, so it also briefs the colours hub, colour and artwork pages.

1. **[dated pattern · type]** Hierarchy is carried by weight: h1 36px and h2 28px at 600 over an 18px/1.6 system-ui body (census `type.levels`; tension T-scale, ad-hoc 36→28→18→16→14). **Fix:** Palette variants at one weight: h1 `xl` 40/48 (−0.01em), h2 `lg` 26/40, body `sm` 16/26, captions `xs` 13/20, in Hanken Grotesk 400.

2. **[cluttered IA · density]** The search sidebar stacks five native `<select>`s (up to 60 options each, `FACET_LIMIT`) under a 340px colour wheel, so the filters sit below the fold at 1440×900. **Fix:** filters become a single row of 30px filter pills above the results (each opens its list with counts), with the colour picker in a disclosure panel; on mobile, pills scroll horizontally.

3. **[missed opportunity · imagery]** Artwork tiles force every work into a square `#f4f4f4` box (`.artworks-image { aspect-ratio: 1 }`, object-fit contain), so portraits and landscapes get grey letterboxing. **Fix:** frameless cards on white with each image at its true aspect ratio (the data has `image_width` / `image_height`), in a column-masonry wall; caption stack below: title 500, artist graphite, date `xs`.

4. **[dated pattern · controls]** The search field is about 38px tall (`padding: 8px 12px`, 4px radius) and the submit is a 4px-radius black block; Wheel/Grid and sort toggles are ad-hoc 999px pills at 14px. **Fix:** 50px field (3px radius, graphite border, ultramarine focus) with a 50px black pill submit; Wheel/Grid becomes underline tabs; filter toggles use the 30px pill.

5. **[accessibility · colour discipline]** Selection and focus share one cue: a selected colour gets a 3px `--text-color` outline, and focus is the same 2px near-black outline site-wide, so "chosen" and "focused" look alike on dark swatches (tension T-no-brand-accent). **Fix:** focus = 2px ultramarine ring everywhere; a selected swatch = black and white double outline plus "selected" in its label; light swatches (L > 90) get a hairline edge.
