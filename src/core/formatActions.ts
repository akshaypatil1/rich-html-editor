import { _getDoc, pushStandaloneSnapshot } from "./state";
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
    else if (command === "strike") wrapSelectionWithElement(doc, "s");
    else if (command === "fontName")
      wrapSelectionWithElement(doc, "span", { fontFamily: value as any });
    else if (command === "fontSize") {
      // Accept numeric font-size values (e.g. "12", "16") and apply as px.
      const raw = value || "14";
      const n = parseInt(raw, 10);
      const sz = Number.isFinite(n) ? `${n}px` : raw;
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
    } else if (command === "formatBlock") {
      // Change block-level element to selected tag (p, h1..h6)
      const sel = doc.getSelection();
      const node = sel?.anchorNode || null;
      const block = findBlockAncestor(node);
      const tag = (value || "p").toLowerCase();
      if (block && block.parentElement) {
        // Replace existing block with new block of desired tag
        const newEl = doc.createElement(tag);
        // Preserve inline styles?
        newEl.className = (block as HTMLElement).className || "";
        while (block.firstChild) newEl.appendChild(block.firstChild);
        block.parentElement.replaceChild(newEl, block);
      } else {
        // Wrap selection in the block tag
        wrapSelectionWithElement(doc, tag);
      }
    } else if (command === "unorderedList" || command === "orderedList") {
      const tag = command === "unorderedList" ? "ul" : "ol";
      toggleList(doc, tag);
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

function toggleList(doc: Document, listTag: "ul" | "ol") {
  const sel = doc.getSelection();
  if (!sel || !sel.rangeCount) return;
  const node = sel.anchorNode || null;
  const block = findBlockAncestor(node);

  // If we're inside an LI
  if (block && block.tagName === "LI" && block.parentElement) {
    const parentList = block.parentElement as HTMLElement;
    const parentTag = parentList.tagName.toLowerCase();
    if (parentTag === listTag) {
      // unwrap list: convert each LI into a P and replace the list
      const frag = doc.createDocumentFragment();
      Array.from(parentList.children).forEach((li) => {
        const p = doc.createElement("p");
        while (li.firstChild) p.appendChild(li.firstChild);
        frag.appendChild(p);
      });
      parentList.parentElement?.replaceChild(frag, parentList);
      return;
    } else {
      // change list type (ul <-> ol)
      const newList = doc.createElement(listTag);
      while (parentList.firstChild) newList.appendChild(parentList.firstChild);
      parentList.parentElement?.replaceChild(newList, parentList);
      return;
    }
  }

  // Not inside an existing list: wrap selection in a new list with a single LI per block
  const range = sel.getRangeAt(0);
  if (range.collapsed) {
    const list = doc.createElement(listTag);
    const li = doc.createElement("li");
    const zw = doc.createTextNode("\u200B");
    li.appendChild(zw);
    list.appendChild(li);
    range.insertNode(list);
    // place cursor inside the zero-width text node
    const newRange = doc.createRange();
    newRange.setStart(zw, 1);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    return;
  }

  // Non-collapsed: extract contents and wrap in a single LI (preserve structure)
  const content = range.extractContents();
  const list = doc.createElement(listTag);
  const li = doc.createElement("li");
  li.appendChild(content);
  list.appendChild(li);
  range.insertNode(list);
  sel.removeAllRanges();
  const newRange = doc.createRange();
  newRange.selectNodeContents(li);
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
