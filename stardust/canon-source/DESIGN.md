<!-- stardust:provenance
  writtenBy: stardust:extract (--design-source)
  writtenAt: 2026-11-11T07:36:15Z
  role: design-source (descriptive)
  readArtifacts:
    - stardust/canon-source/_brand-extraction.json
    - stardust/canon-source/storybook/themes-v3.js (@artsy/palette-tokens 7.3.0, MIT)
    - stardust/canon-source/storybook/typography-v3.js
    - stardust/canon-source/storybook/component-measurements.json
    - stardust/canon-source/pages/*.json (8 Palette storybook Theme stories, live renders)
  synthesizedInputs: []
  notes: www.artsy.net was blocked by a Cloudflare challenge; the system is described from Artsy's own Palette design system.
  stardustVersion: 0.32.1
-->
---
name: Artsy Palette (design source)
description: Artsy's design system: monochrome gallery canvas, one sans-serif, a single electric blue.
colors:
  mono100: "#000000"
  mono60: "#707070"
  mono30: "#c2c2c2"
  mono15: "#d8d8d8"
  mono10: "#e7e7e7"
  mono5: "#f7f7f7"
  mono0: "#ffffff"
  blue200: "#050e3e"
  blue150: "#0a1c7b"
  blue100: "#1023d7"
  blue15: "#cacdec"
  blue10: "#e6e7f5"
  green100: "#00674a"
  green10: "#e8efe2"
  yellow100: "#e2b929"
  yellow10: "#fffae9"
  orange100: "#da6722"
  red100: "#d71023"
  red10: "#fef2ef"
typography:
  xxxl: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "102px", fontWeight: 400, lineHeight: "108px", letterSpacing: "-0.01em" }
  xxl: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "60px", fontWeight: 400, lineHeight: "70px", letterSpacing: "-0.01em" }
  xl: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "40px", fontWeight: 400, lineHeight: "48px", letterSpacing: "-0.01em" }
  lg: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "26px", fontWeight: 400, lineHeight: "40px", letterSpacing: "-0.01em" }
  lg-display: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "26px", fontWeight: 400, lineHeight: "32px", letterSpacing: "-0.01em" }
  md: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "20px", fontWeight: 400, lineHeight: "32px" }
  sm: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: "26px" }
  sm-display: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: "20px" }
  xs: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "20px" }
  xxs: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "11px", fontWeight: 400, lineHeight: "14px" }
  bq: { fontFamily: "ll-unica77, Helvetica Neue, Helvetica, Arial, sans-serif", fontSize: "50px", fontWeight: 400, lineHeight: "60px", letterSpacing: "-0.01em" }
rounded:
  none: "0"
  input: "3px"
  pill: "25px"
spacing:
  "0.5": "5px"
  "1": "10px"
  "2": "20px"
  "4": "40px"
  "6": "60px"
  "12": "120px"
components:
  button-primary-black: { backgroundColor: "{colors.mono100}", textColor: "{colors.mono0}", rounded: "{rounded.pill}", padding: "0 25px", height: "50px" }
  button-primary-black-hover: { backgroundColor: "{colors.blue100}", textColor: "{colors.mono0}" }
  button-secondary-gray: { backgroundColor: "{colors.mono10}", textColor: "{colors.mono100}", rounded: "{rounded.pill}", padding: "0 25px", height: "50px" }
  button-secondary-outline: { backgroundColor: "transparent", textColor: "{colors.mono100}", rounded: "{rounded.pill}", padding: "0 25px", height: "50px" }
  button-disabled: { backgroundColor: "{colors.mono30}", textColor: "{colors.mono0}", rounded: "{rounded.pill}" }
  input: { backgroundColor: "{colors.mono0}", textColor: "{colors.mono100}", rounded: "{rounded.input}", padding: "0 10px", height: "50px", typography: "{typography.sm}" }
  input-focus: { backgroundColor: "{colors.mono0}", textColor: "{colors.mono100}" }
  message-info: { backgroundColor: "{colors.blue10}", textColor: "{colors.blue100}" }
---

# Design System: Artsy Palette (as captured)

## Overview

Palette is a gallery-wall system. The canvas is white, almost everything else is black or one of six greys, and the only colour with a job is a single electric blue (`blue100`, alias `brand`). Images carry the colour; the interface stays out of the way. One sans-serif family at one regular weight does nearly all the work, with size and tracking, not weight, making hierarchy. Spacing runs on a 10px unit.

## Colors

### Primary
- **mono100 #000000**: text, primary button fill, dark banners.
- **blue100 #1023d7** (brand): focus, hover state of black buttons, active pills, input focus border, info text. Used sparingly, as a state colour rather than decoration.

### Neutral
- **mono60 #707070**: secondary text, labels (text on mono5 and lighter).
- **mono30 #c2c2c2**: input borders, disabled fills (background only).
- **mono15 / mono10 #d8d8d8 / #e7e7e7**: dividers, secondary button fill.
- **mono5 #f7f7f7**: quiet surfaces, default message.
- **mono0 #ffffff**: page.

### Status
green100/green10 success, yellow100/yellow10 warning, orange100 alert, red100/red10 error. Each has a 10-tint background-only partner and a 150 hover shade.

Each token is labelled in the source with the backgrounds it is legible on ("suitable for text on mono10 and lighter").

## Typography

One family: **Unica77 LL** (Lineto, commercial), stack `"ll-unica77", "Helvetica Neue", Helvetica, Arial, sans-serif`. Regular 400 and Medium (mapped to 700), with italics.

### Hierarchy
Named variants, not a ratio scale: xxxl 102/108, xxl 60/70, bq 50/60, xl 40/48, lg 26/40, lg-display 26/32, md 20/32, sm 16/26 (body), sm-display 16/20, xs 13/20, xxs 11/14. Sizes at lg and above are tracked -0.01em. Display headings stay at regular weight; Medium is for emphasis inside small text.

## Layout

10px unit, scale 5 / 10 / 20 / 40 / 60 / 120. Breakpoints: xs < 768, sm 768, md 1280, lg 1920. Generous vertical rhythm (40–120px between sections); content sits on white with hairline mono10 dividers rather than boxes.

## Elevation & Depth

Mostly flat. `dropShadow` 0 2px 10px rgba(0,0,0,.08) for floating menus, `flatShadow` 0 1px 1px rgba(0,0,0,.05), `innerShadow` for inset fields. A 16-stop eased black overlay gradient and a 15px text shadow keep text legible over images; dialogs sit on a translucent `backdrop` rgba(229,229,229,.5).

## Shapes

Three radii: square (cards, images, banners), 3px (inputs), full pill (buttons, pills; 25px on the 50px button). No other rounding.

## Components

### Buttons
50px tall (large), pill, 0 25px padding, 1px border matching the fill. Variants: primary black, primary white, secondary grey (mono10), secondary outline (black border), secondary blue (blue text + border), tertiary (text only). Hover/focus turns black buttons blue100 and underlines the label; disabled goes mono30.

### Inputs / Fields
50px tall, 3px radius, 1px mono30 border, 0 10px padding, 16px text; hover mono60 border, focus blue100 border, error red100 border. Labels above in mono60 at 16/26.

### Navigation
Navigational tabs: full-width row, label centred, 2px black underline on the active tab, mono60 for the rest. Content tabs: compact, underline on active. Breadcrumbs: xs text, slash separators.

### Chips (Pills)
Small pill-shaped filters; default mono10 outline, active fills blue100 (or blue200) with white text, focus underlines.

### Messages and banners
Messages: tinted background (mono5, blue10, yellow10, red10) with a coloured title line. Banners: full-width bars in mono10, black, green100, red100 or blue100 with centred xs text and a close ×.

## Do's and Don'ts

### Do:
- Let artwork images provide the colour; keep chrome black, white and grey.
- Use blue100 only for state: focus, active, hover.
- Make hierarchy with size and tracking at one weight.
- Separate with whitespace and hairlines, not cards and shadows.

### Don't:
- Don't introduce extra accent colours or gradients in the chrome.
- Don't bold display headings.
- Don't round images or cards.
