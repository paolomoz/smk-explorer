import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Artworks: a wall of works, one row per work.
 *   | picture | [Title](/artworks/kms1) / Artist / Date |
 * Used on colour pages and by the search block for its results.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const [media, body] = row.children;
    const img = media?.querySelector('img');
    if (img) {
      const figure = document.createElement('div');
      figure.className = 'artworks-image';
      // Media Bus images (same origin) get responsive renditions; others are used as is
      const sameOrigin = new URL(img.src, window.location.href).origin === window.location.origin;
      const picture = sameOrigin
        ? createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
        : img.closest('picture') || img;
      const pImg = picture.querySelector?.('img') || picture;
      pImg.loading = 'lazy';
      if (img.width && img.height) {
        pImg.width = img.width;
        pImg.height = img.height;
      }
      const link = body?.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.tabIndex = -1;
        a.setAttribute('aria-hidden', 'true');
        a.append(picture);
        figure.append(a);
      } else {
        figure.append(picture);
      }
      li.append(figure);
    }
    if (body) {
      body.className = 'artworks-body';
      const first = body.querySelector('p');
      if (first) first.classList.add('artworks-title');
      li.append(body);
    }
    ul.append(li);
  });
  block.replaceChildren(ul);
}
