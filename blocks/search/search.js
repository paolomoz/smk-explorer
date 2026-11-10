import {
  decorateBlock, loadBlock, readBlockConfig, sampleRUM,
} from '../../scripts/aem.js';
import {
  searchUrl, pairs, FACETS, centuryCounts, centuryLabel, CARD_FIELDS, artworkPath,
  iiifImage, title, artists, dateLabel,
} from '../../scripts/smk-api.js';
import {
  namePalette, normaliseHex, compareByHue, hexToLab, labToLch, colourPath,
} from '../../scripts/colour-names.js';

/**
 * Search: live search of the SMK collection (public-domain works with an image).
 *
 * Optional configuration rows set the starting state:
 *   | Query | portrait |  | Colours | #01535a, #ffffff |  | Type | painting |
 *   | Artist | … |  | Nationality | danish |  | Technique | … |  | Century | 1800 |
 *   | Results | 24 |
 * The state lives in the URL (?q=&colours=&type=&artist=&nationality=&technique=&century=),
 * so every search can be shared. URL state wins over the configured start.
 */

const STATE_KEYS = ['q', 'colours', ...FACETS.map((f) => f.param), 'century'];
const FACET_LIMIT = 60;
const CACHE_TTL = 10 * 60 * 1000;

/* ---------- polite fetching: in-memory + session cache, stale responses dropped ---------- */

const memo = new Map();
function fetchJson(url) {
  if (memo.has(url)) return memo.get(url);
  const key = `smk:${url}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    if (cached && Date.now() - cached.t < CACHE_TTL) {
      const p = Promise.resolve(cached.body);
      memo.set(url, p);
      return p;
    }
  } catch (e) { /* no cache */ }
  const p = fetch(url).then((res) => {
    if (!res.ok) throw new Error(`SMK API responded ${res.status}`);
    return res.json();
  }).then((body) => {
    try {
      sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), body }));
    } catch (e) { /* storage full */ }
    return body;
  });
  p.catch(() => memo.delete(url));
  memo.set(url, p);
  return p;
}

/* ---------- palette (names from the authored colours sheet) ---------- */

let palettePromise;
function loadPalette() {
  if (!palettePromise) {
    palettePromise = Promise.all([
      fetchJson(searchUrl({}, { rows: 0, facets: ['colors'], facetNum: -1 })),
      fetch('/data/colours.json').then((r) => (r.ok ? r.json() : { data: [] })).catch(() => ({ data: [] })),
    ]).then(([res, sheet]) => {
      const colours = pairs(res.facets?.colors).map((c) => normaliseHex(c.value)).filter(Boolean);
      const computed = namePalette(colours);
      const authored = new Map((sheet.data || []).map((r) => [normaliseHex(r.hex), r]));
      return colours.map((hex) => ({
        hex,
        name: authored.get(hex)?.name?.trim() || computed.get(hex).name,
      }));
    });
  }
  return palettePromise;
}

/* ---------- index of published artwork pages, to link results to them ---------- */

let pagesPromise;
function loadArtworkPages() {
  if (!pagesPromise) {
    pagesPromise = (async () => {
      const paths = new Set();
      try {
        const cached = JSON.parse(sessionStorage.getItem('smk:artwork-pages'));
        if (cached && Date.now() - cached.t < CACHE_TTL) return new Set(cached.paths);
      } catch (e) { /* no cache */ }
      let offset = 0;
      const limit = 1000;
      for (let i = 0; i < 20; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(`/query-index.json?limit=${limit}&offset=${offset}`);
        if (!res.ok) break;
        // eslint-disable-next-line no-await-in-loop
        const json = await res.json();
        (json.data || []).forEach((r) => { if (r.path?.startsWith('/artworks/')) paths.add(r.path); });
        offset += limit;
        if (offset >= json.total) break;
      }
      try {
        sessionStorage.setItem('smk:artwork-pages', JSON.stringify({ t: Date.now(), paths: [...paths] }));
      } catch (e) { /* full */ }
      return paths;
    })().catch(() => new Set());
  }
  return pagesPromise;
}

/* ---------- state <-> URL ---------- */

function emptyState() {
  return {
    q: '', colours: [], type: '', artist: '', nationality: '', technique: '', century: '',
  };
}

function stateFromParams(params) {
  const s = emptyState();
  s.q = params.get('q') || '';
  s.colours = (params.get('colours') || '').split(',').map(normaliseHex).filter(Boolean);
  FACETS.forEach(({ param }) => { s[param] = params.get(param) || ''; });
  s.century = params.get('century') || '';
  return s;
}

function stateToParams(s, keepMarker) {
  const params = new URLSearchParams();
  if (s.q) params.set('q', s.q);
  if (s.colours.length) params.set('colours', s.colours.map((c) => c.slice(1)).join(','));
  FACETS.forEach(({ param }) => { if (s[param]) params.set(param, s[param]); });
  if (s.century) params.set('century', s.century);
  // an emptied search keeps one parameter, so the configured start is not applied again
  if (keepMarker && ![...params.keys()].length) params.set('q', '');
  return params;
}

const hasState = (params) => STATE_KEYS.some((k) => params.has(k));
const isEmpty = (s) => !s.q && !s.colours.length && !FACETS.some((f) => s[f.param]) && !s.century;

function stateFromConfig(config, palette) {
  const s = emptyState();
  const text = (v) => [].concat(v || []).join(', ').trim();
  s.q = text(config.query);
  s.colours = text(config.colours || config.colors).split(/[,;\n]+/).map((v) => {
    const t = v.trim();
    return normaliseHex(t) || palette.find((c) => c.name.toLowerCase() === t.toLowerCase())?.hex;
  }).filter(Boolean);
  FACETS.forEach(({ param }) => { s[param] = text(config[param]).toLowerCase(); });
  if (config.artist) s.artist = text(config.artist);
  const century = text(config.century).match(/\d+/);
  if (century) {
    const n = parseInt(century[0], 10);
    s.century = String(n < 100 ? (n - 1) * 100 : Math.floor(n / 100) * 100);
  }
  return s;
}

/** Search result URLs are not for indexing; the clean page is (its canonical has no query). */
function updateRobots(params) {
  let meta = document.head.querySelector('meta[name="robots"]');
  if (hasState(params)) {
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.append(meta);
    }
    meta.content = 'noindex, follow';
  } else if (meta?.content === 'noindex, follow') {
    meta.remove();
  }
}

/* ---------- DOM helpers ---------- */

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null || v === false) return;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v === true ? '' : v);
  });
  e.append(...children.filter((c) => c !== null && c !== undefined));
  return e;
}

const nf = new Intl.NumberFormat('en-GB');
const fmt = (n) => nf.format(n || 0);
const capitalise = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/* ---------- colour wheel layout ---------- */

/** Positions in a unit circle: angle = hue, distance = chroma; greys gather in the middle.
 * A few relaxation passes push overlapping dots apart. */
function wheelLayout(colours, dot = 0.1) {
  const pts = colours.map((c) => {
    const [l, ch, h] = labToLch(hexToLab(c.hex));
    const r = ch < 8 ? 0.12 * (1 - l / 100) : 0.18 + 0.78 * Math.min(1, ch / 75);
    const a = (h * Math.PI) / 180;
    return { hex: c.hex, x: r * Math.cos(a), y: -r * Math.sin(a) };
  });
  const max = 1 - dot / 2;
  for (let pass = 0; pass < 150; pass += 1) {
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const dx = pts[j].x - pts[i].x;
        const dy = pts[j].y - pts[i].y;
        const d = Math.hypot(dx, dy) || 0.0001;
        if (d < dot) {
          const push = (dot - d) / 2;
          const ux = dx / d;
          const uy = dy / d;
          pts[i].x -= ux * push; pts[i].y -= uy * push;
          pts[j].x += ux * push; pts[j].y += uy * push;
        }
      }
    }
    pts.forEach((p) => {
      const d = Math.hypot(p.x, p.y);
      if (d > max) { p.x *= max / d; p.y *= max / d; }
    });
  }
  return new Map(pts.map((p) => [p.hex, p]));
}

/* ---------- the block ---------- */

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const rows = Math.min(100, parseInt(config.results || config.rows, 10) || 24);
  // only the first search block on a page keeps its state in the URL
  const syncUrl = !document.querySelector('.search[data-url-sync]') && !/^(no|off|false)$/i.test(config['update-url'] || '');
  if (syncUrl) block.dataset.urlSync = 'true';
  block.replaceChildren();

  const uid = Math.random().toString(36).slice(2, 8);
  const ids = (n) => `search-${uid}-${n}`;

  /* form */
  const input = el('input', {
    type: 'search',
    id: ids('q'),
    name: 'q',
    autocomplete: 'off',
    placeholder: 'Artist, title, subject…',
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': 'false',
    'aria-controls': ids('suggest'),
  });
  const suggest = el('ul', {
    id: ids('suggest'), role: 'listbox', class: 'search-suggestions', hidden: true, 'aria-label': 'Suggestions',
  });
  const form = el(
    'form',
    { class: 'search-form', role: 'search' },
    el('label', { for: ids('q'), text: 'Search the collection' }),
    el('div', { class: 'search-query' }, input, el('button', { type: 'submit', text: 'Search' }), suggest),
  );

  /* colours */
  const wheel = el('div', { class: 'search-wheel', role: 'group', 'aria-label': 'Colour wheel' });
  const grid = el('div', {
    class: 'search-grid', role: 'group', 'aria-label': 'Colour grid', hidden: true,
  });
  const viewWheel = el('button', { type: 'button', 'aria-pressed': 'true', text: 'Wheel' });
  const viewGrid = el('button', { type: 'button', 'aria-pressed': 'false', text: 'Grid' });
  const selected = el('div', { class: 'search-selected', 'aria-live': 'polite' });
  const colourPanel = el(
    'details',
    { class: 'search-colours', open: true },
    el('summary', { text: 'Colours' }),
    el('p', { class: 'search-hint', text: 'Pick colours from SMK’s palette. With several colours, you get the works that contain all of them.' }),
    el('div', { class: 'search-view', role: 'group', 'aria-label': 'Show palette as' }, viewWheel, viewGrid),
    selected,
    wheel,
    grid,
  );

  /* filters */
  const filters = el('div', { class: 'search-filters' });
  const selects = {};
  [...FACETS, { param: 'century', label: 'Century' }].forEach(({ param, label }) => {
    const select = el('select', { id: ids(param), name: param });
    selects[param] = select;
    filters.append(el('div', { class: 'search-filter' }, el('label', { for: ids(param), text: label }), select));
  });

  /* results */
  const status = el('p', { class: 'search-status', role: 'status' });
  const corrections = el('p', { class: 'search-corrections', hidden: true });
  const results = el('div', { class: 'search-results' });
  const more = el('button', {
    type: 'button', class: 'button secondary search-more', hidden: true, text: 'Load more',
  });

  block.append(
    form,
    el('div', { class: 'search-layout' }, el('div', { class: 'search-side' }, colourPanel, filters), el('div', { class: 'search-main' }, status, corrections, results, el('p', { class: 'search-more-wrapper' }, more))),
  );

  const palette = await loadPalette().catch(() => []);
  const paletteMap = new Map(palette.map((c) => [c.hex, c]));
  const nameOf = (hex) => paletteMap.get(hex)?.name || hex;
  const configured = stateFromConfig(config, palette);
  const urlParams = new URLSearchParams(window.location.search);
  let state = syncUrl && hasState(urlParams) ? stateFromParams(urlParams) : configured;
  let offset = 0;
  let found = 0;
  let seq = 0;

  /* palette buttons */
  const layout = wheelLayout(palette);
  const buttons = new Map();
  const makeButton = (c) => el('button', {
    type: 'button', class: 'search-colour', 'data-hex': c.hex, 'aria-pressed': 'false', title: c.name, 'aria-label': c.name,
  });
  palette.forEach((c) => {
    const w = makeButton(c);
    const p = layout.get(c.hex);
    w.style.setProperty('--x', `${50 + p.x * 50}%`);
    w.style.setProperty('--y', `${50 + p.y * 50}%`);
    const g = makeButton(c);
    [w, g].forEach((b) => b.style.setProperty('--swatch', c.hex));
    buttons.set(c.hex, [w, g]);
    wheel.append(w);
  });
  [...palette].sort((a, b) => compareByHue(a.hex, b.hex))
    .forEach((c) => grid.append(buttons.get(c.hex)[1]));

  const setView = (view) => {
    wheel.hidden = view !== 'wheel';
    grid.hidden = view !== 'grid';
    viewWheel.setAttribute('aria-pressed', view === 'wheel');
    viewGrid.setAttribute('aria-pressed', view === 'grid');
    try { localStorage.setItem('smk:palette-view', view); } catch (e) { /* ignore */ }
  };
  viewWheel.addEventListener('click', () => setView('wheel'));
  viewGrid.addEventListener('click', () => setView('grid'));
  try { if (localStorage.getItem('smk:palette-view') === 'grid') setView('grid'); } catch (e) { /* ignore */ }

  /* rendering */
  function renderSelected() {
    selected.replaceChildren();
    if (!state.colours.length) return;
    const list = el('ul', { 'aria-label': 'Selected colours' });
    state.colours.forEach((hex) => {
      const remove = el('button', { type: 'button', 'aria-label': `Remove ${nameOf(hex)}` }, '×');
      remove.addEventListener('click', () => {
        // eslint-disable-next-line no-use-before-define
        update({ colours: state.colours.filter((h) => h !== hex) });
      });
      const chip = el('li', { class: 'search-chip' }, el('span', { class: 'search-chip-swatch', 'aria-hidden': 'true' }), el('a', { href: colourPath(nameOf(hex), hex), text: nameOf(hex) }), remove);
      chip.style.setProperty('--swatch', hex);
      list.append(chip);
    });
    const clear = el('button', { type: 'button', class: 'search-clear', text: 'Clear colours' });
    // eslint-disable-next-line no-use-before-define
    clear.addEventListener('click', () => update({ colours: [] }));
    selected.append(list, clear);
  }

  function renderColourCounts(counts) {
    buttons.forEach(([w, g], hex) => {
      const on = state.colours.includes(hex);
      const n = counts ? counts.get(hex) || 0 : null;
      const label = `${nameOf(hex)}${n !== null ? `, ${fmt(n)} works` : ''}${on ? ', selected' : ''}`;
      [w, g].forEach((b) => {
        b.setAttribute('aria-pressed', on);
        b.setAttribute('aria-label', label);
        b.title = label;
        b.classList.toggle('empty', n === 0 && !on);
      });
    });
  }

  function renderSelect(param, options, allLabel) {
    const select = selects[param];
    const current = state[param];
    select.replaceChildren(el('option', { value: '', text: allLabel }));
    const list = [...options];
    if (current && !list.some((o) => o.value === current)) {
      list.unshift({ value: current, label: capitalise(current), count: null });
    }
    list.forEach((o) => {
      const text = `${o.label}${o.count !== null && o.count !== undefined ? ` (${fmt(o.count)})` : ''}`;
      select.append(el('option', { value: o.value, text, selected: o.value === current }));
    });
    select.value = current;
  }

  async function cardRows(items) {
    const pages = await loadArtworkPages();
    const blockEl = el('div', { class: 'artworks' });
    items.forEach((item) => {
      const t = title(item);
      const who = artists(item).join(', ');
      const path = artworkPath(item.object_number);
      const href = pages.has(path) ? path : `https://open.smk.dk/artwork/image/${encodeURIComponent(item.object_number)}`;
      const { image_width: iw, image_height: ih } = item;
      const ratio = iw && ih ? ih / iw : null;
      const img = el('img', {
        src: iiifImage(item), alt: `${t}${who ? ` by ${who}` : ''}`, loading: 'lazy', width: 1024, height: ratio ? Math.round(1024 * ratio) : undefined,
      });
      blockEl.append(el(
        'div',
        {},
        el('div', {}, el('picture', {}, img)),
        el(
          'div',
          {},
          el('p', {}, el('a', { href, text: t })),
          who ? el('p', { text: who }) : null,
          dateLabel(item) ? el('p', { text: dateLabel(item) }) : null,
        ),
      ));
    });
    const wrapper = el('div', { class: 'search-page' }, blockEl);
    results.append(wrapper);
    decorateBlock(blockEl);
    await loadBlock(blockEl);
  }

  function renderCorrections(res) {
    corrections.replaceChildren();
    const terms = [];
    if (res.suggestion) terms.push(res.suggestion);
    (res.corrections || []).forEach((c) => Object.values(c).flat().forEach((t) => terms.push(t)));
    const unique = [...new Set(terms)].filter((t) => t && t !== state.q).slice(0, 4);
    corrections.hidden = !unique.length;
    if (!unique.length) return;
    corrections.append('Did you mean ');
    unique.forEach((t, i) => {
      const params = stateToParams({ ...state, q: t });
      const a = el('a', { href: `?${params}`, text: t });
      a.addEventListener('click', (e) => {
        e.preventDefault();
        input.value = t;
        // eslint-disable-next-line no-use-before-define
        update({ q: t });
      });
      if (i) corrections.append(i === unique.length - 1 ? ' or ' : ', ');
      corrections.append(a);
    });
    corrections.append('?');
  }

  function describeState() {
    const parts = [];
    if (state.q) parts.push(`“${state.q}”`);
    if (state.colours.length) parts.push(state.colours.map(nameOf).join(' + '));
    FACETS.forEach(({ param }) => { if (state[param]) parts.push(capitalise(state[param])); });
    if (state.century) parts.push(centuryLabel(state.century));
    return parts.join(' · ');
  }

  async function run(append = false) {
    seq += 1;
    const mine = seq;
    if (!append) offset = 0;
    block.setAttribute('aria-busy', 'true');
    more.disabled = true;
    try {
      const [res, colourRes] = await Promise.all([
        fetchJson(searchUrl(state, {
          offset,
          rows,
          facets: FACETS.map((f) => f.field),
          facetNum: FACET_LIMIT,
          centuries: true,
          fields: CARD_FIELDS,
        })),
        append ? null : fetchJson(searchUrl(state, { rows: 0, facets: ['colors'], facetNum: -1 })),
      ]);
      if (mine !== seq) return;
      found = res.found || 0;
      if (!append) {
        results.replaceChildren();
        renderCorrections(found ? {} : res);
        const counts = new Map(pairs(colourRes?.facets?.colors)
          .map((c) => [normaliseHex(c.value), c.count]));
        renderColourCounts(counts);
        FACETS.forEach(({ param, field, label }) => {
          const opts = pairs(res.facets?.[field]).filter((o) => o.value && o.value !== 'Unknown' && o.count)
            .map((o) => ({ value: o.value, label: capitalise(o.value), count: o.count }));
          renderSelect(param, opts, `Any ${label.toLowerCase()}`);
        });
        renderSelect('century', centuryCounts(res).map((c) => ({
          value: String(c.start), label: centuryLabel(c.start), count: c.count,
        })), 'Any century');
      }
      await cardRows(res.items || []);
      if (mine !== seq) return;
      const described = describeState();
      status.textContent = `${fmt(found)} ${found === 1 ? 'work' : 'works'}${described ? ` for ${described}` : ''}`;
      offset += rows;
      more.hidden = offset >= found;
    } catch (e) {
      if (mine !== seq) return;
      status.textContent = 'The SMK collection could not be reached. Please try again in a moment.';
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      if (mine === seq) {
        block.removeAttribute('aria-busy');
        more.disabled = false;
      }
    }
  }

  function syncForm() {
    input.value = state.q;
    renderSelected();
    renderColourCounts(null);
  }

  function update(changes, { push = true } = {}) {
    state = { ...state, ...changes };
    if (syncUrl && push) {
      const params = stateToParams(state, !isEmpty(configured));
      const url = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
      window.history.pushState(null, '', url);
      updateRobots(params);
    }
    syncForm();
    sampleRUM('search', { source: '.search', target: stateToParams(state).toString() });
    run();
  }

  /* palette clicks */
  [wheel, grid].forEach((container) => container.addEventListener('click', (e) => {
    const b = e.target.closest('.search-colour');
    if (!b) return;
    const { hex } = b.dataset;
    const on = state.colours.includes(hex);
    update({ colours: on ? state.colours.filter((h) => h !== hex) : [...state.colours, hex] });
  }));

  Object.entries(selects).forEach(([param, select]) => {
    select.addEventListener('change', () => update({ [param]: select.value }));
  });

  more.addEventListener('click', () => run(true));

  /* free text + suggestions */
  let active = -1;
  let suggestTimer;
  const closeSuggest = () => {
    suggest.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };
  const choose = (text) => {
    input.value = text;
    closeSuggest();
    update({ q: text });
  };
  const highlight = (i) => {
    const items = [...suggest.children];
    if (!items.length) return;
    active = (i + items.length) % items.length;
    items.forEach((li, n) => li.setAttribute('aria-selected', n === active));
    input.setAttribute('aria-activedescendant', items[active].id);
  };

  input.addEventListener('input', () => {
    clearTimeout(suggestTimer);
    const typed = input.value.trim();
    if (typed.length < 2) { closeSuggest(); return; }
    suggestTimer = setTimeout(async () => {
      try {
        const res = await fetchJson(searchUrl({ q: typed }, { rows: 0 }));
        if (input.value.trim() !== typed) return;
        const list = [...new Set(res.autocomplete || [])].slice(0, 8);
        suggest.replaceChildren(...list.map((text, i) => {
          const li = el('li', {
            role: 'option', id: ids(`opt-${i}`), 'aria-selected': 'false', text,
          });
          li.addEventListener('mousedown', (e) => { e.preventDefault(); choose(text); });
          return li;
        }));
        suggest.hidden = !list.length;
        input.setAttribute('aria-expanded', String(!!list.length));
        active = -1;
      } catch (e) { closeSuggest(); }
    }, 250);
  });
  input.addEventListener('keydown', (e) => {
    if (suggest.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); highlight(active + 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); highlight(active - 1); }
    if (e.key === 'Escape') closeSuggest();
    if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      choose(suggest.children[active].textContent);
    }
  });
  input.addEventListener('blur', () => setTimeout(closeSuggest, 100));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    closeSuggest();
    update({ q: input.value.trim() });
  });

  if (syncUrl) {
    window.addEventListener('popstate', () => {
      const params = new URLSearchParams(window.location.search);
      state = hasState(params) ? stateFromParams(params) : configured;
      updateRobots(params);
      syncForm();
      run();
    });
    updateRobots(urlParams);
  }

  syncForm();
  run();
}
