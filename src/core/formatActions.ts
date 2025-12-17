import { _getDoc, pushStandaloneSnapshot } from "./state";
import { sanitizeHtml } from "../utils/sanitize";
import { sanitizeURL } from "./sanitizeURL";

export function handleToolbarCommand(command: string, value?: string) {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] handleToolbarCommand called before initialization"
      );
      return;
    }
    if (command === "undo") return; // delegated to history module
    if (command === "redo") return; // delegated to history module
    if (command === "link") {
      const url = window.prompt("Enter URL (https://...):", "https://");
      if (url) {
        const sanitized = sanitizeURL(url);
        if (sanitized) applyStandaloneCommand("link", sanitized);
      }
      return;
    }
    applyStandaloneCommand(command, value);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Command handler failed:", message);
  }
}

export function applyStandaloneCommand(command: string, value?: string) {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] applyStandaloneCommand called before initialization"
      );
      return;
    }

    if (command === "bold") wrapSelectionWithElement(doc, "strong");
    else if (command === "italic") wrapSelectionWithElement(doc, "em");
    else if (command === "underline") wrapSelectionWithElement(doc, "u");
    else if (command === "fontName")
      wrapSelectionWithElement(doc, "span", { fontFamily: value as any });
    else if (command === "fontSize") {
      const map: Record<string, string> = {
        "2": "12px",
        "3": "14px",
        "4": "16px",
        "5": "18px",
        "6": "20px",
      };
      const sz = map[value || "3"] || value || "";
      wrapSelectionWithElement(doc, "span", { fontSize: sz as any });
    } else if (command === "link") {
      const sel = doc.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const content = range.extractContents();
      const a = doc.createElement("a");
      a.href = sanitizeURL(value || "#");
      a.appendChild(content);
      range.insertNode(a);
    } else if (command === "foreColor")
      wrapSelectionWithElement(doc, "span", { color: value as any });
    else if (command === "hiliteColor")
      wrapSelectionWithElement(doc, "span", { backgroundColor: value as any });
    else if (command === "align") {
      const sel = doc.getSelection();
      const node = sel?.anchorNode || null;
      const block = findBlockAncestor(node);
      if (block) block.style.textAlign = value || "left";
      else wrapSelectionWithElement(doc, "div", { textAlign: value as any });
    }
    pushStandaloneSnapshot();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Apply command failed:", message);
  }
}

function wrapSelectionWithElement(
  doc: Document,
  tagName: string,
  style?: Partial<CSSStyleDeclaration>
): void {
  const sel = doc.getSelection();
  if (!sel) return;
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  if (range.collapsed) {
    const el = doc.createElement(tagName);
    if (style) Object.assign(el.style, style as any);
    const zw = doc.createTextNode("\u200B");
    el.appendChild(zw);
    range.insertNode(el);
    const newRange = doc.createRange();
    newRange.setStart(zw, 1);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    return;
  }
  const content = range.extractContents();
  const wrapper = doc.createElement(tagName);
  if (style) Object.assign(wrapper.style, style as any);
  wrapper.appendChild(content);
  range.insertNode(wrapper);
  sel.removeAllRanges();
  const newRange = doc.createRange();
  newRange.selectNodeContents(wrapper);
  sel.addRange(newRange);
}

function findBlockAncestor(node: Node | null): HTMLElement | null {
  let n = node as Node | null;
  const BLOCKS = [
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
  ];
  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n as HTMLElement;
      if (BLOCKS.includes(el.tagName)) return el;
    }
    n = n.parentNode;
  }
  return null;
}
