/**
 * Compute the current formatting state of selected text
 *
 * Detects bold, italic, and underline formatting based on:
 * - DOM element tags (strong, em, u)
 * - CSS computed styles (fontWeight, fontStyle, textDecoration)
 *
 * @param doc - Document context
 * @returns Object with boolean flags for bold, italic, underline
 */
export function computeFormatState(doc: Document): {
  bold: boolean;
  italic: boolean;
  underline: boolean;
} {
  try {
    const s = doc.getSelection();
    let el: HTMLElement | null = null;
    if (s && s.anchorNode)
      el =
        s.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (s.anchorNode as HTMLElement)
          : (s.anchorNode.parentElement as HTMLElement);
    if (!el) return { bold: false, italic: false, underline: false };
    const computed = doc.defaultView?.getComputedStyle(el) as
      | CSSStyleDeclaration
      | undefined;
    const bold = !!(
      el.closest("strong, b") ||
      (computed &&
        (computed.fontWeight === "700" || Number(computed.fontWeight) >= 700))
    );
    const italic = !!(
      el.closest("em, i") ||
      (computed && computed.fontStyle === "italic")
    );
    const underline = !!(
      el.closest("u") ||
      (computed && (computed.textDecorationLine || "").includes("underline"))
    );
    return { bold, italic, underline };
  } catch (err) {
    return { bold: false, italic: false, underline: false };
  }
}

/**
 * Get a human-readable label for an element
 *
 * Format: `tagname#id.class`
 * Example: `p#intro.highlight` or `div.container`
 *
 * @param el - HTML element to label
 * @returns Label string or null if element is null
 */
export function getElementLabel(el: HTMLElement | null): string | null {
  if (!el) return null;
  const id = el.id ? `#${el.id}` : "";
  const cls = el.className ? `.${String(el.className).split(" ")[0]}` : "";
  const tag = el.tagName.toLowerCase();
  return `${tag}${id}${cls}`;
}
