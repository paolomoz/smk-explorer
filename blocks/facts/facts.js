/**
 * Facts: label | value rows, rendered as a description list.
 * @param {Element} block
 */
export default function decorate(block) {
  const dl = document.createElement('dl');
  [...block.children].forEach((row) => {
    const [label, value] = row.children;
    if (!label || !value || !value.textContent.trim()) return;
    const dt = document.createElement('dt');
    dt.textContent = label.textContent.trim();
    const dd = document.createElement('dd');
    dd.append(...value.childNodes);
    dl.append(dt, dd);
  });
  block.replaceChildren(dl);
}
