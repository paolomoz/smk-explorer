import { normaliseHex, compareByHue } from '../../scripts/colour-names.js';

/**
 * Swatches: one row per colour.
 *   | #01535a | [Dark slate gray](/colours/dark-slate-gray-01535a) | 123 works |
 * The first cell is the hex, the second the (linked) name, the optional third the count.
 * Variants: `feature` (one large swatch), `compact` (small chips).
 */

function readCount(text) {
  const n = parseInt(String(text).replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

function addSort(block, ul) {
  const items = [...ul.children];
  const bar = document.createElement('div');
  bar.className = 'swatches-sort';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Sort colours');
  const label = document.createElement('span');
  label.textContent = 'Sort by';
  bar.append(label);
  const orders = {
    count: (a, b) => b.dataset.count - a.dataset.count,
    hue: (a, b) => compareByHue(a.dataset.hex, b.dataset.hex),
    name: (a, b) => a.dataset.name.localeCompare(b.dataset.name),
  };
  const labels = { count: 'Number of works', hue: 'Hue', name: 'Name' };
  Object.keys(orders).forEach((key, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = labels[key];
    button.setAttribute('aria-pressed', i === 0);
    button.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === button));
      ul.append(...items.sort(orders[key]));
    });
    bar.append(button);
  });
  block.prepend(bar);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const hex = normaliseHex(cells[0]?.textContent);
    if (!hex) return;
    const li = document.createElement('li');
    li.dataset.hex = hex;
    li.style.setProperty('--swatch', hex);

    const chip = document.createElement('span');
    chip.className = 'swatches-chip';
    chip.setAttribute('aria-hidden', 'true');

    const body = document.createElement('div');
    body.className = 'swatches-body';
    const nameCell = cells[1];
    const link = nameCell?.querySelector('a');
    const name = document.createElement(link ? 'a' : 'span');
    name.className = 'swatches-name';
    // names that share a CSS colour carry the hex ("Black #000000"): show it on its own line
    const fullName = (nameCell?.textContent || hex).trim();
    const baseName = fullName.toLowerCase().endsWith(` ${hex}`)
      ? fullName.slice(0, -(hex.length + 1)) : fullName;
    name.textContent = baseName;
    if (link) name.href = link.getAttribute('href');
    li.dataset.name = fullName;
    body.append(name);

    const countText = cells[2]?.textContent.trim();
    if (!countText?.includes(hex)) {
      const code = document.createElement('code');
      code.className = 'swatches-hex';
      code.textContent = hex;
      // inside the link, so its accessible name stays unique ("Black #000000")
      name.append(' ', code);
    }
    if (countText) {
      const count = document.createElement('span');
      count.className = 'swatches-count';
      count.textContent = countText;
      li.dataset.count = readCount(countText);
      body.append(count);
    }

    // make the whole swatch clickable when it links somewhere
    if (link) {
      chip.addEventListener('click', () => name.click());
    }
    li.append(chip, body);
    ul.append(li);
  });
  block.replaceChildren(ul);
  if (ul.children.length > 30 && !block.classList.contains('compact')) addSort(block, ul);
}
