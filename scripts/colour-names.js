/**
 * Colour naming for the SMK palette.
 *
 * Each palette colour is named after the nearest CSS named colour, measured as
 * the Euclidean distance in CIELAB (CIE76 ΔE*ab, D65 white point).
 * When several palette colours end up with the same CSS name, the hex is appended
 * to the display name so they can be told apart.
 *
 * Pure ES module without DOM access: it is used by the browser (search block)
 * and by Node (page generator and BYOM service).
 */

/* CSS Color Module Level 4 named colours, with readable names.
 * Spelling aliases (grey/gray, aqua/cyan, fuchsia/magenta) are listed once. */
export const CSS_COLOURS = [
  ['alice blue', '#f0f8ff'], ['antique white', '#faebd7'], ['aquamarine', '#7fffd4'],
  ['azure', '#f0ffff'], ['beige', '#f5f5dc'], ['bisque', '#ffe4c4'], ['black', '#000000'],
  ['blanched almond', '#ffebcd'], ['blue', '#0000ff'], ['blue violet', '#8a2be2'],
  ['brown', '#a52a2a'], ['burlywood', '#deb887'], ['cadet blue', '#5f9ea0'],
  ['chartreuse', '#7fff00'], ['chocolate', '#d2691e'], ['coral', '#ff7f50'],
  ['cornflower blue', '#6495ed'], ['cornsilk', '#fff8dc'], ['crimson', '#dc143c'],
  ['cyan', '#00ffff'], ['dark blue', '#00008b'], ['dark cyan', '#008b8b'],
  ['dark goldenrod', '#b8860b'], ['dark gray', '#a9a9a9'], ['dark green', '#006400'],
  ['dark khaki', '#bdb76b'], ['dark magenta', '#8b008b'], ['dark olive green', '#556b2f'],
  ['dark orange', '#ff8c00'], ['dark orchid', '#9932cc'], ['dark red', '#8b0000'],
  ['dark salmon', '#e9967a'], ['dark sea green', '#8fbc8f'], ['dark slate blue', '#483d8b'],
  ['dark slate gray', '#2f4f4f'], ['dark turquoise', '#00ced1'], ['dark violet', '#9400d3'],
  ['deep pink', '#ff1493'], ['deep sky blue', '#00bfff'], ['dim gray', '#696969'],
  ['dodger blue', '#1e90ff'], ['firebrick', '#b22222'], ['floral white', '#fffaf0'],
  ['forest green', '#228b22'], ['gainsboro', '#dcdcdc'], ['ghost white', '#f8f8ff'],
  ['gold', '#ffd700'], ['goldenrod', '#daa520'], ['gray', '#808080'], ['green', '#008000'],
  ['green yellow', '#adff2f'], ['honeydew', '#f0fff0'], ['hot pink', '#ff69b4'],
  ['indian red', '#cd5c5c'], ['indigo', '#4b0082'], ['ivory', '#fffff0'], ['khaki', '#f0e68c'],
  ['lavender', '#e6e6fa'], ['lavender blush', '#fff0f5'], ['lawn green', '#7cfc00'],
  ['lemon chiffon', '#fffacd'], ['light blue', '#add8e6'], ['light coral', '#f08080'],
  ['light cyan', '#e0ffff'], ['light goldenrod yellow', '#fafad2'], ['light gray', '#d3d3d3'],
  ['light green', '#90ee90'], ['light pink', '#ffb6c1'], ['light salmon', '#ffa07a'],
  ['light sea green', '#20b2aa'], ['light sky blue', '#87cefa'], ['light slate gray', '#778899'],
  ['light steel blue', '#b0c4de'], ['light yellow', '#ffffe0'], ['lime', '#00ff00'],
  ['lime green', '#32cd32'], ['linen', '#faf0e6'], ['magenta', '#ff00ff'], ['maroon', '#800000'],
  ['medium aquamarine', '#66cdaa'], ['medium blue', '#0000cd'], ['medium orchid', '#ba55d3'],
  ['medium purple', '#9370db'], ['medium sea green', '#3cb371'], ['medium slate blue', '#7b68ee'],
  ['medium spring green', '#00fa9a'], ['medium turquoise', '#48d1cc'],
  ['medium violet red', '#c71585'], ['midnight blue', '#191970'], ['mint cream', '#f5fffa'],
  ['misty rose', '#ffe4e1'], ['moccasin', '#ffe4b5'], ['navajo white', '#ffdead'],
  ['navy', '#000080'], ['old lace', '#fdf5e6'], ['olive', '#808000'], ['olive drab', '#6b8e23'],
  ['orange', '#ffa500'], ['orange red', '#ff4500'], ['orchid', '#da70d6'],
  ['pale goldenrod', '#eee8aa'], ['pale green', '#98fb98'], ['pale turquoise', '#afeeee'],
  ['pale violet red', '#db7093'], ['papaya whip', '#ffefd5'], ['peach puff', '#ffdab9'],
  ['peru', '#cd853f'], ['pink', '#ffc0cb'], ['plum', '#dda0dd'], ['powder blue', '#b0e0e6'],
  ['purple', '#800080'], ['rebecca purple', '#663399'], ['red', '#ff0000'],
  ['rosy brown', '#bc8f8f'], ['royal blue', '#4169e1'], ['saddle brown', '#8b4513'],
  ['salmon', '#fa8072'], ['sandy brown', '#f4a460'], ['sea green', '#2e8b57'],
  ['seashell', '#fff5ee'], ['sienna', '#a0522d'], ['silver', '#c0c0c0'], ['sky blue', '#87ceeb'],
  ['slate blue', '#6a5acd'], ['slate gray', '#708090'], ['snow', '#fffafa'],
  ['spring green', '#00ff7f'], ['steel blue', '#4682b4'], ['tan', '#d2b48c'], ['teal', '#008080'],
  ['thistle', '#d8bfd8'], ['tomato', '#ff6347'], ['turquoise', '#40e0d0'], ['violet', '#ee82ee'],
  ['wheat', '#f5deb3'], ['white', '#ffffff'], ['white smoke', '#f5f5f5'], ['yellow', '#ffff00'],
  ['yellow green', '#9acd32'],
];

/**
 * Normalises a colour to lower-case `#rrggbb`. Accepts `rrggbb`, `#rgb`, `#rrggbb`.
 * @param {string} value
 * @returns {string|null}
 */
export function normaliseHex(value) {
  if (!value) return null;
  let v = String(value).trim().toLowerCase().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/.test(v)) v = v.split('').map((c) => c + c).join('');
  return /^[0-9a-f]{6}$/.test(v) ? `#${v}` : null;
}

/** @returns {number[]} [r, g, b] in 0–255 */
export function hexToRgb(hex) {
  const v = normaliseHex(hex).slice(1);
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
}

/** sRGB (0–255) to CIELAB, D65. */
export function rgbToLab([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)];
  const x = (lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375) / 0.95047;
  const y = (lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750) / 1.0;
  const z = (lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const [fx, fy, fz] = [f(x), f(y), f(z)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function hexToLab(hex) {
  return rgbToLab(hexToRgb(hex));
}

/** CIE76 colour difference. */
export function deltaE(lab1, lab2) {
  return Math.hypot(lab1[0] - lab2[0], lab1[1] - lab2[1], lab1[2] - lab2[2]);
}

const CSS_LAB = CSS_COLOURS.map(([name, hex]) => ({ name, hex, lab: hexToLab(hex) }));

/**
 * Nearest CSS named colour in Lab space.
 * @param {string} hex
 * @returns {{name: string, hex: string, distance: number}}
 */
export function nearestCssColour(hex) {
  const lab = hexToLab(hex);
  let best = null;
  CSS_LAB.forEach((c) => {
    const distance = deltaE(lab, c.lab);
    if (!best || distance < best.distance) best = { name: c.name, hex: c.hex, distance };
  });
  return best;
}

/** "dark slate gray" -> "Dark slate gray" */
export function sentenceCase(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function slugify(s) {
  return String(s).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/#[0-9a-f]{6}\b/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Path segment for a colour page: `{name}-{hex}`, e.g. `dark-slate-gray-2f4f4f`.
 * The hex is always part of the slug so URLs stay unique and stable.
 */
export function colourSlug(name, hex) {
  const h = normaliseHex(hex).slice(1);
  const base = slugify(name);
  return base ? `${base}-${h}` : h;
}

export function colourPath(name, hex) {
  return `/colours/${colourSlug(name, hex)}`;
}

/** Extracts the hex from a colour page path or slug. */
export function hexFromSlug(slugOrPath) {
  const m = String(slugOrPath).match(/([0-9a-f]{6})\/?$/i);
  return m ? `#${m[1].toLowerCase()}` : null;
}

/**
 * Names every colour of a palette.
 * @param {string[]} hexes palette colours
 * @returns {Map<string, {hex, name, cssName, cssHex, distance}>} keyed by hex
 */
export function namePalette(hexes) {
  const entries = hexes.map(normaliseHex).filter(Boolean).map((hex) => {
    const n = nearestCssColour(hex);
    return {
      hex, cssName: n.name, cssHex: n.hex, distance: n.distance,
    };
  });
  const counts = entries.reduce((acc, e) => {
    acc[e.cssName] = (acc[e.cssName] || 0) + 1;
    return acc;
  }, {});
  const map = new Map();
  entries.forEach((e) => {
    const base = sentenceCase(e.cssName);
    map.set(e.hex, { ...e, name: counts[e.cssName] > 1 ? `${base} ${e.hex}` : base });
  });
  return map;
}

/** Lightness, chroma, hue (degrees) from Lab. */
export function labToLch([l, a, b]) {
  const c = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return [l, c, h];
}

/** Sort key that orders colours as a palette: greys by lightness, then by hue. */
export function hueSortKey(hex) {
  const [l, c, h] = labToLch(hexToLab(hex));
  if (c < 8) return [0, -l, 0];
  return [1, Math.round(h / 15), -l];
}

export function compareByHue(hexA, hexB) {
  const a = hueSortKey(hexA);
  const b = hueSortKey(hexB);
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

/**
 * Plain-language description of a colour, used to seed the curator notes.
 * @param {string} hex
 */
export function describeColour(hex) {
  const [l, c, h] = labToLch(hexToLab(hex));
  let tone = 'mid';
  if (l > 85) tone = 'very light';
  else if (l > 65) tone = 'light';
  else if (l < 20) tone = 'very dark';
  else if (l < 40) tone = 'dark';
  const h6 = normaliseHex(hex);
  if (h6 === '#ffffff') return 'Pure white, the brightest value in the palette';
  if (h6 === '#000000') return 'Pure black, the darkest value in the palette';
  if (c < 8) {
    if (l < 10) return 'A near-black, almost neutral tone';
    if (l > 95) return 'A near-white, almost neutral tone';
    return `A ${tone} neutral grey`;
  }
  const families = [
    [20, 'red'], [45, 'red-orange'], [70, 'orange-brown'], [100, 'ochre-yellow'],
    [135, 'olive-green'], [170, 'green'], [220, 'blue-green'], [260, 'blue'],
    [300, 'violet'], [340, 'magenta-pink'], [361, 'red'],
  ];
  const family = families.find(([max]) => h < max)[1];
  let strength = 'vivid';
  if (c < 20) strength = 'muted';
  else if (c < 40) strength = 'soft';
  return `A ${tone}, ${strength} ${family} tone`;
}
