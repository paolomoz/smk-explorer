/**
 * Cross-document view transitions (View Transition API, level 2).
 *
 * CSS opts every same-origin navigation in (`@view-transition` in styles.css), which
 * cross-fades the pages. This module adds a shared element: an artwork card's image
 * grows into the picture on that artwork's page, and shrinks back on return
 * (transition name: artwork-image). The old page names its element in `pageswap`, the
 * new page in `pagereveal`; names are removed once the transition ends.
 * The new page must be laid out in its first frame for this to work: scripts.js is
 * render-blocking and decorates default content and the page template synchronously.
 * Browsers without support navigate as before.
 */

const ARTWORK = /\/artworks\/([^/?#]+)/;

const idOf = (url, pattern) => {
  try {
    return new URL(url, window.location.href).pathname.match(pattern)?.[1]?.toLowerCase() || null;
  } catch (e) {
    return null;
  }
};

/** first link on the page pointing at the artwork / colour with this id */
function linkTo(pattern, id) {
  if (!id) return null;
  return [...document.querySelectorAll('main a[href]')].find((a) => idOf(a.href, pattern) === id) || null;
}

const artworkHero = () => document.querySelector('body.artwork main > .section:first-of-type picture img');
/** the image of the card holding this link (decorated card, or a raw block row) */
const cardImage = (link) => (link?.closest('li') || link?.closest('.artworks > div'))?.querySelector('img') || null;

/** Give `el` the transition name (one element per name), and clear it when done. */
function name(el, transitionName, transition) {
  if (!el) return;
  el.style.viewTransitionName = transitionName;
  transition.finished.finally(() => { el.style.viewTransitionName = ''; });
}

/** Old page, just before it is replaced: name the element the next page will match. */
function onPageSwap(event) {
  const { viewTransition: transition, activation } = event;
  if (!transition || !activation?.entry?.url) return;
  const to = activation.entry.url;

  // going to an artwork: the card that links to it; leaving an artwork page: its picture
  const toArtwork = idOf(to, ARTWORK);
  name(cardImage(linkTo(ARTWORK, toArtwork)) || artworkHero(), 'artwork-image', transition);
}

/** New page, just before its first frame: name the matching element. */
function onPageReveal(event) {
  const { viewTransition: transition } = event;
  if (!transition) return;
  const from = window.navigation?.activation?.from?.url || '';

  // coming back from an artwork page: its card on this page; else this page's own picture
  name(cardImage(linkTo(ARTWORK, idOf(from, ARTWORK))) || artworkHero(), 'artwork-image', transition);
}

export default function initViewTransitions() {
  window.addEventListener('pageswap', onPageSwap);
  window.addEventListener('pagereveal', onPageReveal);
}
