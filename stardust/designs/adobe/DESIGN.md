<!-- stardust:provenance
  writtenBy: stardust:extract (design library: adobe)
  role: design-source library entry (descriptive, NOT the active target; root DESIGN.md stays the active design)
  readArtifacts:
    - stardust/designs/adobe/_brand-extraction.json
    - stardust/designs/adobe/_custom-properties.json (--s2a-* Spectrum 2 for Adobe.com tokens)
    - stardust/designs/adobe/_interaction-states.json
    - stardust/designs/adobe/pages/*.json (4 live renders: uk/products/photoshop, max, uk/products/illustrator, uk/creativecloud)
  synthesizedInputs:
    - primary button hover colour (not measured; inferred from the blue ramp, marked below)
  stardustVersion: 0.32.1
-->
---
name: Adobe (adobe.com, Spectrum 2 for Adobe.com)
description: Bold black display type on light grey and black bands, one Adobe blue for action, rounded media cards and scroll-driven reveals.
colors:
  gray-25: "#ffffff"
  gray-50: "#f8f8f8"
  gray-75: "#f3f3f3"
  gray-100: "#e9e9e9"
  gray-200: "#e1e1e1"
  gray-400: "#c6c6c6"
  gray-500: "#8f8f8f"
  gray-600: "#717171"
  gray-700: "#505050"
  gray-800: "#292929"
  gray-900: "#131313"
  gray-1000: "#000000"
  body-text: "#2c2c2c"
  subtle-text: "#000000a3"
  blue-900: "#3b63fb"
  blue-1000: "#274dea"
  blue-1100: "#1d3ecf"
  blue-200: "#e5f0fe"
  adobe-red: "#eb1000"
  red-900: "#d73220"
  green-900: "#05834e"
  yellow-400: "#f5c700"
typography:
  super: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "96px", fontWeight: 900, lineHeight: "92px", letterSpacing: "-3.84px" }
  heading-1: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "80px", fontWeight: 900, lineHeight: "76px", letterSpacing: "-3.2px" }
  heading-2: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "56px", fontWeight: 900, lineHeight: "56px", letterSpacing: "-1.68px" }
  heading-3: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "48px", fontWeight: 900, lineHeight: "48px", letterSpacing: "-1.44px" }
  heading-4: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "36px", fontWeight: 900, lineHeight: "32px", letterSpacing: "-1px" }
  heading-5: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "24px", fontWeight: 900, lineHeight: "24px", letterSpacing: "-0.96px" }
  heading-6: { fontFamily: "Adobe Clean Display, adobe-clean, Trebuchet MS, sans-serif", fontSize: "18px", fontWeight: 900, lineHeight: "18px", letterSpacing: "-0.2px" }
  body-lg: { fontFamily: "Adobe Clean, adobe-clean, Trebuchet MS, sans-serif", fontSize: "20px", fontWeight: 400, lineHeight: "30px", letterSpacing: "0" }
  body-md: { fontFamily: "Adobe Clean, adobe-clean, Trebuchet MS, sans-serif", fontSize: "18px", fontWeight: 400, lineHeight: "27px", letterSpacing: "0" }
  body-sm: { fontFamily: "Adobe Clean, adobe-clean, Trebuchet MS, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: "24px", letterSpacing: "0" }
  eyebrow: { fontFamily: "Adobe Clean, adobe-clean, Trebuchet MS, sans-serif", fontSize: "16px", fontWeight: 700, lineHeight: "20px", letterSpacing: "0" }
  label: { fontFamily: "Adobe Clean, adobe-clean, Trebuchet MS, sans-serif", fontSize: "14px", fontWeight: 700, lineHeight: "18px", letterSpacing: "0" }
  caption: { fontFamily: "Adobe Clean, adobe-clean, Trebuchet MS, sans-serif", fontSize: "12px", fontWeight: 700, lineHeight: "16px", letterSpacing: "0" }
rounded:
  none: "0"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "32px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "48px"
  4xl: "64px"
  section-sm: "40px"
  section-md: "80px"
  section-lg: "128px"
  container: "1200px"
components:
  button-primary: { backgroundColor: "{colors.blue-900}", textColor: "{colors.gray-25}", rounded: "{rounded.pill}", padding: "7px 18px 8px", height: "40px", typography: "{typography.label}" }
  button-primary-hover: { backgroundColor: "{colors.blue-1000}", textColor: "{colors.gray-25}" }
  button-secondary: { backgroundColor: "transparent", textColor: "{colors.body-text}", rounded: "{rounded.pill}", padding: "7px 18px 8px", height: "40px" }
  button-secondary-hover: { backgroundColor: "#00000014", textColor: "{colors.body-text}" }
  button-on-dark: { backgroundColor: "transparent", textColor: "{colors.gray-25}", rounded: "{rounded.pill}", padding: "0 24px", height: "40px" }
  card-media: { backgroundColor: "transparent", textColor: "{colors.gray-1000}", rounded: "{rounded.lg}", padding: "0" }
  card-merch: { backgroundColor: "{colors.gray-100}", textColor: "{colors.body-text}", rounded: "{rounded.sm}", padding: "24px" }
  card-dark: { backgroundColor: "#0a0a0a59", textColor: "{colors.gray-25}", rounded: "{rounded.md}", padding: "24px" }
---

# Design System: Adobe (as captured from adobe.com)

> Library entry. This describes adobe.com; it is not the active design for this site. See `README.md` in this folder for how to apply it.

## Overview

adobe.com runs on Spectrum 2 for Adobe.com (`--s2a-*` tokens) layered over the Milo/EDS base. The voice is loud and confident: very heavy display type (900 black) with tight negative tracking, set in short declarative sentences with full stops. Pages alternate light grey bands and black bands. Imagery and autoplaying video carry the colour; the interface uses one Adobe blue for action and black for everything else. Content sits on a 12-column, 1200px grid, while media and bands run full bleed. Motion is scroll-driven: sections and cards rise 24px into place as they enter, heroes pin and pan, and controls change state in 0.3s.

## Colors

### Primary
- **blue-900 #3b63fb**: primary call-to-action fill (white text). **blue-1000 #274dea**: link/hover text; a full 100–1600 blue ramp exists.
- **adobe-red #eb1000**: brand mark only (logo), not UI.

### Neutral
- Light grounds **#ffffff**, **gray-50 #f8f8f8**, **gray-75 #f3f3f3**; dividers **gray-200/400**; dark bands **gray-1000 #000**, **gray-900 #131313**, **#242424**.
- Text: **#2c2c2c** (Milo body), **#000 / #131313** (s2a headings, body strong), **#000000a3** subtle (64% black); on dark, white and 64% white.

### Product accents
Photoshop **#3a18ff**, Illustrator **#ff9a00**, Premiere/AE **#9999ff**, 3D **#99e83f**: used on product icons and themed sections only.

## Typography

**Adobe Clean Display** for headings (900), **Adobe Clean** for body (400) and UI labels (700). Proprietary, served from an Adobe Fonts kit bound to adobe.com; fallback `adobe-clean, "Trebuchet MS", sans-serif`.

### Hierarchy
s2a scale: super 96/92, H1 80/76, H2 56/56, H3 48/48, H4 36/32, H5 24/24, H6 18/18, all 900 with tracking from -3.84px to -0.2px (line height equals size from H2 down). Body 20/30, 18/27 (most frequent, #2c2c2c), 16/24; eyebrow 16/700 above section headings; labels 14/700; captions 12/700. Older Milo sections use 800 weight at 1.25 line height (44/55, 36/45, 28/35, 24/30).

## Layout

12-column grid in a 1200px container, margins `(100% - 1200px) / 2`; media and colour bands go full bleed (1440px frames). Section spacing tokens 40 / 48 / 64 / 128 / 240px; observed paddings 40, 80, 104 and 128px. Spacing scale 2–240px on a 4/8 base. Split hero: copy column left (~450px), media bleeding off the right edge. Content starts on a white rounded sheet that rises over the hero. Bento grids of rounded media cards; centred section intros (eyebrow, H2, lede) above them.

## Elevation & Depth

Mostly flat: cards carry no shadow. Shadow levels exist (0 1px 6px / 0 2px 8px / 0 4px 12px, 12–16% black) for floating UI. Depth comes from scroll motion (cards scaling back as the next slides over) and black gradient scrims over media.

## Shapes

Rounded but not soft: pills for buttons and tabs (20px on 40px, 999px), 16px on media and editorial cards, 12px on dark session cards, 8px on merch cards, a large radius on the top of the content sheet.

## Components

### Buttons
40px pills (50px xl), 2px border matching the fill, 17px/700 (14px/700 in compact variants). Primary: blue-900 fill, white text; hover darkens toward blue-1000 (inferred, not measured). Secondary: transparent with a 2px #2c2c2c border; hover adds an 8% black fill (measured). On dark: 2px white outline, or white fill with black text. State transitions: background, border and colour 0.3s cubic-bezier(0.42, 0, 0, 1).

### Cards / Containers
Media cards: image or video on top with 16px corners, no border or shadow, H5-size 900 title, 16–18px body. Overlay cards: white text on imagery under a black scrim. Merch cards: #eaeaea ground, 8px corners, price, bullet list, blue CTA. Dark session cards: 35% black ground, 1px #505050 border, 12px corners.

### Navigation
Sticky light header (#f8f8f8 or transparent), 72–80px; Adobe logo, 16px/700 black links, active link underlined, outline "Sign in" pill; breadcrumbs below on product pages.

### Signature: scroll motion
Entry reveal (24px rise and fade, staggered) on view() timelines; split hero pin-and-pan; garage-door section reveal (MAX); bento stack; autoplaying muted video loops with a pause control. Honours `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- Use heavy display type (900) with tight tracking for headings; short sentences with full stops.
- Keep one blue for action; black and greys elsewhere.
- Alternate light and black bands; let media run full bleed.
- Reveal content as it scrolls in, and offer pause on moving media.

### Don't:
- Don't use Adobe's logo, product names or product colours outside their meaning.
- Don't reuse Adobe Clean without a web licence for the target domain.
- Don't add shadows to cards; depth comes from motion and scrims.
