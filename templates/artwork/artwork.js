/**
 * Artwork page template: the picture is a card. Its back carries the title, byline
 * and details table, as if written on the back of the work. Hovering flips the card;
 * on touch screens a tap flips it, and a button does the same for keyboard users.
 * Runs after decorateMain, before the first section loads. The details stay in the
 * page markup (readable by crawlers and screen readers).
 * @param {Element} main
 */
export default function decorate(main) {
  const section = main.querySelector(':scope > .section');
  const content = section?.querySelector(':scope > .default-content-wrapper');
  const picture = content?.querySelector('picture');
  const title = content?.querySelector(':scope > h1');
  if (!picture || !title) return;

  const el = (tag, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  };

  // back of the card: the title and everything after it, then the section's blocks (details table)
  const back = el('div', 'artwork-card-back');
  const moving = [];
  for (let node = title; node; node = node.nextElementSibling) moving.push(node);
  back.append(...moving);
  [...section.children]
    .filter((child) => child !== content)
    .forEach((child) => back.append(child));

  // front of the card: the picture (and its paragraph, if it was wrapped in one)
  const front = el('div', 'artwork-card-front');
  const holder = picture.parentElement.tagName === 'P'
    && picture.parentElement.textContent.trim() === '' ? picture.parentElement : picture;
  front.append(holder);

  const inner = el('div', 'artwork-card-inner');
  inner.append(front, back);
  const card = el('div', 'artwork-card');
  card.append(inner);

  // a button flips it without hover (keyboard, touch, voice control)
  const toggle = el('button', 'artwork-card-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-pressed', 'false');
  toggle.textContent = 'Show details';
  const setFlipped = (flipped) => {
    card.classList.toggle('is-flipped', flipped);
    toggle.setAttribute('aria-pressed', String(flipped));
    toggle.textContent = flipped ? 'Show picture' : 'Show details';
  };
  toggle.addEventListener('click', () => setFlipped(!card.classList.contains('is-flipped')));

  // touch screens have no hover: a tap on the card flips it (links on the back still work)
  const noHover = window.matchMedia('(hover: none)');
  card.addEventListener('click', (e) => {
    if (!noHover.matches || e.target.closest('a')) return;
    setFlipped(!card.classList.contains('is-flipped'));
  });

  const controls = el('p', 'artwork-card-controls');
  controls.append(toggle);

  content.replaceChildren(card, controls);
}
