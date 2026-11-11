/**
 * Artwork page template: groups the title, byline and details block of the first
 * section into one column, so the page lays out as picture | details.
 * Runs after decorateMain, before the first section loads. Content order is unchanged.
 * @param {Element} main
 */
export default function decorate(main) {
  const section = main.querySelector(':scope > .section');
  const content = section?.querySelector(':scope > .default-content-wrapper');
  const title = content?.querySelector(':scope > h1');
  if (!title) return;

  const details = document.createElement('div');
  details.className = 'artwork-details';

  // the title and everything after it in the default content (byline, notes)
  const moving = [];
  for (let el = title; el; el = el.nextElementSibling) moving.push(el);
  details.append(...moving);

  // the blocks that follow in the same section (the facts table)
  [...section.children]
    .filter((child) => child !== content && child !== details)
    .forEach((child) => details.append(child));

  content.after(details);
}
