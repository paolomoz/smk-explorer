<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-11T07:36:15Z
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/_brand-extraction.json
    - styles/styles.css
  synthesizedInputs: []
  notes: descriptive snapshot of a deliberate placeholder design
  stardustVersion: 0.32.1
-->
---
name: SMK Explorer (current)
description: Placeholder look — system font, neutral greys — set while functionality was built.
colors:
  text: "#1a1a1a"
  text-secondary: "#5c5c5c"
  background: "#ffffff"
  surface: "#f4f4f4"
  border: "#d0d0d0"
typography:
  h1: { fontFamily: "system-ui, -apple-system, Segoe UI, roboto, Helvetica Neue, arial, sans-serif", fontSize: "36px", fontWeight: 600, lineHeight: 1.25 }
  h2: { fontFamily: "system-ui, -apple-system, Segoe UI, roboto, Helvetica Neue, arial, sans-serif", fontSize: "28px", fontWeight: 600, lineHeight: 1.25 }
  body: { fontFamily: "system-ui, -apple-system, Segoe UI, roboto, Helvetica Neue, arial, sans-serif", fontSize: "18px", fontWeight: 400, lineHeight: 1.6 }
  small: { fontFamily: "system-ui, -apple-system, Segoe UI, roboto, Helvetica Neue, arial, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: 1.6 }
rounded:
  sm: "4px"
  pill: "999px"
spacing:
  section: "40px"
  gutter: "24px"
  container: "1200px"
components:
  button-primary: { backgroundColor: "{colors.text}", textColor: "{colors.background}", rounded: "{rounded.sm}", padding: "8px 16px" }
  input: { backgroundColor: "{colors.background}", textColor: "{colors.text}", rounded: "{rounded.sm}", padding: "8px 12px" }
---

# Design System: SMK Explorer (current state)

## Overview

A deliberately plain placeholder: system UI font, near-black text on white, light grey tiles behind artworks, a 1200px container. The only strong colour on the page is data: SMK's 236 palette colours in the colour wheel, grid and swatches.

## Colors

Near-black #1a1a1a text and links (underlined), #5c5c5c secondary text, #d0d0d0 borders, #f4f4f4 artwork tiles and quiet surfaces, white page. No brand accent.

## Typography

system-ui throughout. h1 36px / h2 28px at 600; body 18px, small 14–16px. Ad-hoc scale.

## Layout

1200px max container, 24px gutters (32px ≥ 900px), 40px between sections. Search page: 340px sidebar (colour wheel, filters) + results grid at ≥ 900px. Artwork grids: auto-fill tiles ≥ 200px.

## Shapes

4px radius on inputs, buttons and swatch chips; full pills on toggles and selected-colour chips; circles for wheel dots.

## Components

Search form (input + black submit), colour wheel and grid, facet selects, artwork tiles (square, contained image on #f4f4f4, title/artist/date below), swatches (chip + name + count), facts list (label/value), header nav (wordmark text, Search, Colours, SMK Open), footer (CC0 credit).
