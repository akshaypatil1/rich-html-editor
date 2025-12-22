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
  foreColor: string | null;
  hiliteColor: string | null;
  fontName: string | null;
  fontSize: string | null;
  formatBlock: string | null;
  listType: string | null;
} {
  try {
    const s = doc.getSelection();
    let el: HTMLElement | null = null;
    if (s && s.anchorNode)
      el =
        s.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (s.anchorNode as HTMLElement)
          : (s.anchorNode.parentElement as HTMLElement);
    if (!el)
      return {
        bold: false,
        italic: false,
        underline: false,
        foreColor: null,
        hiliteColor: null,
        fontName: null,
        fontSize: null,
        formatBlock: null,
        listType: null,
      };
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
    // Try to detect text color and highlight (background) color at the selection
    const foreColor =
      (el.closest("font[color]") as HTMLElement | null)?.getAttribute(
        "color"
      ) ||
      (computed && computed.color) ||
      null;
    // Background color may come from a <mark> element or computed background-color
    const mark = el.closest("mark") as HTMLElement | null;
    const hiliteColor =
      (mark && (mark.getAttribute("style") || "")) ||
      (computed &&
      computed.backgroundColor &&
      computed.backgroundColor !== "rgba(0, 0, 0, 0)"
        ? computed.backgroundColor
        : null);

    // detect font name + size from computed style
    const fontName = (computed && computed.fontFamily) || null;
    const fontSize = (computed && computed.fontSize) || null;
    // detect block ancestor (paragraph, heading etc.)
    let blockEl: HTMLElement | null = el;
    while (blockEl && blockEl.parentElement) {
      const tag = blockEl.tagName;
      if (
        [
          "P",
          "DIV",
          "SECTION",
          "ARTICLE",
          "LI",
          "TD",
          "BLOCKQUOTE",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
        ].includes(tag)
      ) {
        break;
      }
      blockEl = blockEl.parentElement as HTMLElement | null;
    }
    const formatBlock = blockEl ? blockEl.tagName.toLowerCase() : null;
    // detect if selection is inside a list and which type
    let listType: string | null = null;
    try {
      if (blockEl && blockEl.tagName === "LI") {
        const list = blockEl.closest("ul,ol") as HTMLElement | null;
        if (list) listType = list.tagName.toLowerCase();
      } else {
        const possible = el.closest("ul,ol") as HTMLElement | null;
        if (possible) listType = possible.tagName.toLowerCase();
      }
    } catch (e) {
      listType = null;
    }

    return {
      bold,
      italic,
      underline,
      foreColor,
      hiliteColor,
      fontName,
      fontSize,
      formatBlock,
      listType,
    };
  } catch (err) {
    return {
      bold: false,
      italic: false,
      underline: false,
      foreColor: null,
      hiliteColor: null,
      fontName: null,
      fontSize: null,
      formatBlock: null,
      listType: null,
    };
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
