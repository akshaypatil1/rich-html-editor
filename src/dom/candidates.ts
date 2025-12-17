/**
 * Check if an element can be edited
 *
 * Valid elements: Text container tags (p, div, section, etc.)
 * Invalid elements: HTML structure tags, inputs, scripts, styles
 *
 * @param el - Element to check
 * @returns True if element is a valid editable candidate
 */
export function isEditableCandidate(el: HTMLElement | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  const DISALLOWED = [
    "HTML",
    "HEAD",
    "BODY",
    "SCRIPT",
    "STYLE",
    "LINK",
    "META",
    "NOSCRIPT",
  ];
  if (DISALLOWED.includes(tag)) return false;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
  return true;
}
