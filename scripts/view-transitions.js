/**
 * Cross-document view transitions (View Transition API, level 2).
 *
 * CSS opts every same-origin navigation in (`@view-transition` in styles.css), which
 * cross-fades the pages. This module adds shared elements, so things that appear on
 * both pages morph from one to the other:
 *   - an artwork card's image  <->  the picture on that artwork's page   (artwork-image)
 *   - a colour swatch's chip   <->  the large swatch on its colour page  (colour-chip)
 * The old page names its element in `pageswap`, the new page in `pagereveal`; names
 * are removed once the transition ends. Browsers without support navigate as before.
 */

const ARTWORK = /\/artworks\/([^/?#]+)/;
const COLOUR = /\/colours\/([^/?#]+)/;

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
const colourFeature = () => document.querySelector('main .swatches.feature .swatches-chip');
const cardImage = (link) => link?.closest('li')?.querySelector('img') || null;
const chip = (link) => link?.closest('li')?.querySelector('.swatches-chip') || null;

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

  const toArtwork = idOf(to, ARTWORK);
  name(cardImage(linkTo(ARTWORK, toArtwork)) || artworkHero(), 'artwork-image', transition);

  const toColour = idOf(to, COLOUR);
  name(chip(linkTo(COLOUR, toColour)) || colourFeature(), 'colour-chip', transition);
}

/** New page, just before its first frame: name the matching element. */
function onPageReveal(event) {
  const { viewTransition: transition } = event;
  if (!transition) return;
  const from = window.navigation?.activation?.from?.url || '';

  // coming back from an artwork page: its card on this page; else this page's own picture
  name(cardImage(linkTo(ARTWORK, idOf(from, ARTWORK))) || artworkHero(), 'artwork-image', transition);

  // this colour page's large swatch; else the chip of the colour we came from
  name(colourFeature() || chip(linkTo(COLOUR, idOf(from, COLOUR))), 'colour-chip', transition);
}

export default function initViewTransitions() {
  window.addEventListener('pageswap', onPageSwap);
  window.addEventListener('pagereveal', onPageReveal);
}
