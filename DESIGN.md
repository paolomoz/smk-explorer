<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-11-11T07:37:57Z
  againstDirection: stardust/direction.md#active-direction
  mode: design-donor Mode A (donor: Artsy Palette, stardust/canon-source/)
  readArtifacts:
    - stardust/canon-source/DESIGN.md
    - stardust/canon-source/_brand-extraction.json
    - stardust/canon-source/storybook/themes-v3.js (@artsy/palette-tokens 7.3.0, MIT)
    - stardust/canon-source/storybook/typography-v3.js
    - stardust/canon-source/storybook/component-measurements.json
    - stardust/current/_brand-extraction.json
    - PRODUCT.md
  synthesizedInputs:
    - typeface substitution (Hanken Grotesk for Unica77 LL — user decision: open look-alike)
    - field border at rest (graphite, a11y refinement over donor plaster)
  stardustVersion: 0.32.1
-->
---
name: SMK Explorer
description: A white gallery wall for SMK's open collection — monochrome chrome, one grotesque, one ultramarine for state; the works bring the colour.
colors:
  etching-black: "#000000"
  graphite: "#707070"
  plaster: "#c2c2c2"
  mount-board: "#d8d8d8"
  hairline: "#e7e7e7"
  gallery-floor: "#f7f7f7"
  gallery-wall: "#ffffff"
  ultramarine-deep: "#050e3e"
  ultramarine-dark: "#0a1c7b"
  ultramarine: "#1023d7"
  ultramarine-veil: "#cacdec"
  ultramarine-wash: "#e6e7f5"
  verdigris: "#00674a"
  verdigris-wash: "#e8efe2"
  ochre: "#e2b929"
  ochre-wash: "#fffae9"
  vermilion: "#d71023"
  vermilion-wash: "#fef2ef"
typography:
  xxxl: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "102px", fontWeight: 400, lineHeight: "108px", letterSpacing: "-0.01em" }
  xxl: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "60px", fontWeight: 400, lineHeight: "70px", letterSpacing: "-0.01em" }
  xl: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "40px", fontWeight: 400, lineHeight: "48px", letterSpacing: "-0.01em" }
  lg: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "26px", fontWeight: 400, lineHeight: "40px", letterSpacing: "-0.01em" }
  lg-display: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "26px", fontWeight: 400, lineHeight: "32px", letterSpacing: "-0.01em" }
  md: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "20px", fontWeight: 400, lineHeight: "32px", letterSpacing: "normal" }
  sm: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: "26px", letterSpacing: "normal" }
  sm-display: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: "20px", letterSpacing: "normal" }
  xs: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "20px", letterSpacing: "normal" }
  xxs: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: 400, lineHeight: "14px", letterSpacing: "normal" }
  emphasis: { fontFamily: "Hanken Grotesk, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "inherit", fontWeight: 500, lineHeight: "inherit", letterSpacing: "normal" }
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: "13px", fontWeight: 400, lineHeight: "20px", letterSpacing: "normal" }
rounded:
  none: "0"
  field: "3px"
  pill: "9999px"
spacing:
  "0.5": "5px"
  "1": "10px"
  "2": "20px"
  "3": "30px"
  "4": "40px"
  "6": "60px"
  "12": "120px"
  section-desktop: "60px"
  section-tablet: "40px"
  section-mobile: "40px"
  gutter-desktop: "40px"
  gutter-mobile: "20px"
  container: "1200px"
components:
  button-primary: { backgroundColor: "{colors.etching-black}", textColor: "{colors.gallery-wall}", rounded: "{rounded.pill}", padding: "0 25px", height: "50px", typography: "{typography.sm-display}" }
  button-primary-hover: { backgroundColor: "{colors.ultramarine}", textColor: "{colors.gallery-wall}" }
  button-secondary: { backgroundColor: "transparent", textColor: "{colors.etching-black}", rounded: "{rounded.pill}", padding: "0 25px", height: "50px", typography: "{typography.sm-display}" }
  button-secondary-hover: { backgroundColor: "transparent", textColor: "{colors.ultramarine}" }
  button-quiet: { backgroundColor: "{colors.hairline}", textColor: "{colors.etching-black}", rounded: "{rounded.pill}", padding: "0 25px", height: "50px" }
  button-small: { rounded: "{rounded.pill}", padding: "0 15px", height: "30px", typography: "{typography.xs}" }
  input: { backgroundColor: "{colors.gallery-wall}", textColor: "{colors.etching-black}", rounded: "{rounded.field}", padding: "0 10px", height: "50px", typography: "{typography.sm}" }
  pill: { backgroundColor: "{colors.gallery-wall}", textColor: "{colors.etching-black}", rounded: "{rounded.pill}", padding: "0 15px", height: "30px", typography: "{typography.xs}" }
  pill-active: { backgroundColor: "{colors.ultramarine}", textColor: "{colors.gallery-wall}" }
  card: { backgroundColor: "transparent", textColor: "{colors.etching-black}", rounded: "{rounded.none}", padding: "0" }
  link: { textColor: "{colors.etching-black}" }
  message-info: { backgroundColor: "{colors.ultramarine-wash}", textColor: "{colors.ultramarine}", rounded: "{rounded.none}", padding: "15px 20px" }
---

# Design System: SMK Explorer

## Overview

**North star: the white gallery wall.** The site adopts Artsy's Palette design system closely. The interface is a white wall with black lettering and grey hairlines, and the works hang on it. One grotesque at one regular weight carries the whole hierarchy through size and tracking. A single ultramarine is the only interface colour, and it only ever signals state: focus, hover, active, selected filter.

This matters doubly here because colour is the site's subject. SMK's 236 palette colours are data. They appear in swatches, the colour wheel and grid, and nowhere else. Keeping the chrome monochrome is what lets a gold swatch read as gold and a painting's palette read as the painting's.

## Colors

Tokens keep Artsy Palette's values (mapping in `DESIGN.json` › `colorMeta`); names come from the museum's world.

### Ultramarine (state)
- **ultramarine #1023d7**: focus rings, hover on black buttons, active pills and tabs, field focus border, info text. 9.4:1 on white.
- **ultramarine-dark #0a1c7b**: pressed state. **ultramarine-wash #e6e7f5**: info message ground, focused tertiary button ground.

### Neutral
- **etching-black #000000**: text, primary buttons, active tab underline.
- **graphite #707070**: secondary text, labels, captions (white or gallery-floor ground only); field borders at rest.
- **plaster #c2c2c2**: disabled fills and text, decorative borders only (never the only boundary of a control).
- **mount-board #d8d8d8 / hairline #e7e7e7**: dividers, quiet button fill, image placeholders.
- **gallery-floor #f7f7f7**: quiet surfaces (messages, filter panel ground).
- **gallery-wall #ffffff**: page.

### Status (reserved)
verdigris (success), ochre (warning), vermilion (error), each with a background-only wash. Used only for system messages and form validation.

### Named Rules
**The Data Colour Rule.** SMK palette colours appear only as data (swatch chips, wheel, grid, a work's colour list). Never as a background, button, border or text colour in chrome.
**The One State Colour Rule.** Ultramarine means "this is focused, hovered or chosen". It is never decorative and never marks a colour swatch as selected: selected swatches get a black and white double outline.

## Typography

**Hanken Grotesk** (SIL OFL, self-hosted, weights 400 and 500), standing in for Artsy's licensed Unica77 LL. Stack: `"Hanken Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif`.

### Hierarchy
Palette's named variants, unchanged: xxxl 102/108, xxl 60/70, xl 40/48, lg 26/40, lg-display 26/32, md 20/32, sm 16/26 (body), sm-display 16/20 (buttons, one-line labels), xs 13/20 (captions, meta), xxs 11/14 (legal). Sizes from lg up track -0.01em. Responsive by step: a heading set xl on desktop drops to lg on mobile; xxl drops to xl.

### Named Rules
**One Weight Rule.** Headings stay at 400. Weight 500 is for emphasis inside small text only (a work's title in a caption, the active facet label).
**Sentence Case Rule.** All headings, buttons and labels in sentence case; no all-caps eyebrows.

## Layout

10px unit; spacing scale 5 / 10 / 20 / 30 / 40 / 60 / 120. Section rhythm 60px on desktop, 40px on tablet and mobile. Gutters 40px desktop, 20px mobile. Breakpoints follow Palette: xs < 768, sm 768, md 1280, lg 1920. Content is capped at 1200px wide (gutters sit outside it) and centred on wider screens; header, sections and footer share the same edges. Reading text is capped at about 70 characters. Separation comes from whitespace and hairline dividers, not boxes. Artwork walls use a masonry or aspect-true grid, never cropped squares.

## Elevation & Depth

Flat by default. One drop shadow (0 2px 10px rgba(0,0,0,.08)) is reserved for floating layers: search suggestions, dropdowns. Text over images uses Palette's eased black overlay gradient. No shadows on cards or images.

## Shapes

Three shapes only: square (images, cards, panels, messages), 3px (text fields), full pill (buttons, pills, selected-colour chips). Colour swatches are square chips; the colour wheel is the one circular element.

## Components

### Buttons
Pill, 50px tall (30px small), 0 25px padding, 1px border matching the fill, sm-display text. Primary: black fill, white text; hover and focus go ultramarine and underline the label. Secondary: transparent with a black border; hover turns text and border ultramarine. Quiet: hairline fill. Disabled: plaster.

### Inputs / Fields
50px, 3px radius, 1px graphite border, 0 10px padding, 16px text. Hover: black border. Focus: ultramarine border. Error: vermilion border with a vermilion xs message below. Labels sit above in graphite sm.

### Chips (Pills)
30px pills for facets and filters: white with a graphite outline and black text at rest; black outline on hover; ultramarine fill with white text when active. Selected-colour chips: pill holding a square swatch, the colour name and a remove control.

### Cards / Containers
Artwork cards are frameless: image at its true aspect on a white ground, then title (sm, weight 500), artist (sm graphite) and date (xs graphite) below with 10px spacing. No border, radius or shadow. Hover: title underlines.

### Navigation
Header: text wordmark left, links in sm, hairline bottom border. Active link marked by a 1px black underline. Tabs: underline style with a 2px black bar on the active tab.

### Colour swatch (signature component)
Square chip (no radius) with the colour name (sm) and hex (mono xs graphite) beside or below it, plus a count where relevant. Chips whose colour is close to white get a hairline outline so they stay visible.

### Messages
Square panels on a wash ground (gallery-floor, ultramarine-wash, ochre-wash, vermilion-wash), with a title line in the matching colour and body in black.

## Do's and Don'ts

### Do:
- Let artworks and SMK's colour data be the only colour on the page.
- Use ultramarine for state only, and always pair it with a non-colour cue (underline, outline, text).
- Make hierarchy with size, space and tracking at one weight.
- Show artworks uncropped at their true aspect ratio.
- Label every colour with its name and hex.

### Don't:
- Don't tint chrome with palette colours, gradients or a second accent.
- Don't bold headings or set labels in all caps.
- Don't round or shadow images and cards.
- Don't put graphite text on hairline or darker greys (fails AA).
- Don't use Artsy's logo, name or copy; only its system.
