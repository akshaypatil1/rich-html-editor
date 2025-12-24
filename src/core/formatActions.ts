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
      // mark anchor as editor-created (so clearFormat can detect it)
      a.dataset.rheFormat = "true";
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
        // mark as editor-created block
        (newEl as HTMLElement).dataset.rheFormat = "true";
        block.parentElement.replaceChild(newEl, block);
      } else {
        // Wrap selection in the block tag
        wrapSelectionWithElement(doc, tag);
      }
    } else if (command === "unorderedList" || command === "orderedList") {
      const tag = command === "unorderedList" ? "ul" : "ol";
      toggleList(doc, tag);
    } else if (command === "clearFormat") {
      clearSelectionFormatting(doc);
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
    // mark element as created by editor for session-only clearing
    (el as HTMLElement).dataset.rheFormat = "true";
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
  // mark wrapper so we can clear editor-applied formatting later
  (wrapper as HTMLElement).dataset.rheFormat = "true";
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

function clearSelectionFormatting(doc: Document) {
  const sel = doc.getSelection();
  if (!sel || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  if (range.collapsed) return;

  // If selection is nested inside editor-created inline wrappers (strong/em/u/span),
  // expand the range to include the outermost marked ancestor that covers the
  // selection so extractContents contains them. Build ancestor chains for both
  // range boundaries and choose the outermost common marked ancestor when possible.
  try {
    const INLINE_WRAP = ["STRONG", "B", "EM", "I", "U", "S", "SPAN", "A"];
    function getMarkedAncestors(node: Node | null) {
      const out: HTMLElement[] = [];
      let n: Node | null =
        node && node.nodeType === Node.ELEMENT_NODE
          ? node
          : ((node && (node as Node).parentElement) as Node | null);
      while (n) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const el = n as HTMLElement;
          if (el.dataset && el.dataset.rheFormat === "true") out.push(el);
        }
        n = (n as Node).parentNode;
      }
      return out; // closest first, farthest last
    }

    const startAnc = getMarkedAncestors(range.startContainer);
    const endAnc = getMarkedAncestors(range.endContainer);

    // find outermost common ancestor (farthest from leaf)
    let outer: HTMLElement | null = null;
    for (let i = startAnc.length - 1; i >= 0; i--) {
      const a = startAnc[i];
      if (endAnc.includes(a)) {
        outer = a;
        break;
      }
    }
    // fallback: choose the outermost of either side
    if (!outer) {
      if (startAnc.length) outer = startAnc[startAnc.length - 1];
      else if (endAnc.length) outer = endAnc[endAnc.length - 1];
    }

    if (outer && INLINE_WRAP.includes(outer.tagName)) {
      try {
        range.setStartBefore(outer);
        range.setEndAfter(outer);
      } catch (e) {
        /* ignore set range errors */
      }
    }
  } catch (e) {
    /* ignore ancestor expansion errors */
  }

  const content = range.extractContents();

  // Aggressive cleaning pass: unwrap any remaining marked nodes inside the
  // extracted content by moving into a temporary container and repeatedly
  // replacing marked elements with their children (or converting headings).
  try {
    const container = doc.createElement("div");
    container.appendChild(content);
    let seen = 0;
    while (true) {
      const el = container.querySelector('[data-rhe-format="true"]');
      if (!el) break;
      const tagName = el.tagName;
      if (/^H[1-6]$/.test(tagName)) {
        const p = doc.createElement("p");
        while (el.firstChild) p.appendChild(el.firstChild);
        el.parentNode?.replaceChild(p, el);
      } else {
        // remove inline styles and unwrap
        try {
          (el as HTMLElement).style.cssText = "";
        } catch (e) {
          /* ignore style set errors */
        }
        const frag = doc.createDocumentFragment();
        while (el.firstChild) frag.appendChild(el.firstChild);
        el.parentNode?.replaceChild(frag, el);
      }
      seen++;
      // defensive: avoid infinite loops
      if (seen > 200) break;
    }
    // build a cleaned fragment to continue processing
    const cleaned = doc.createDocumentFragment();
    while (container.firstChild) cleaned.appendChild(container.firstChild);
    // replace original content with cleaned fragment
    // (content was moved into container, so use cleaned)
    // continue using 'content' variable as the cleaned fragment
    // by reassigning via a temporary variable
    // (we'll use 'contentToInsert' below)
    var contentToInsert = cleaned;

    // replace content variable for downstream cleaning steps
    // (note: content is not reused directly after this, so we will use contentToInsert)

    // Use contentToInsert for the rest of the cleaning below
    // We'll set 'content' back to contentToInsert by appending its children
    while (contentToInsert.firstChild)
      content.appendChild(contentToInsert.firstChild);
  } catch (e) {
    /* aggressive cleaning failed; ignore and continue */
  }

  // Recursively clean nodes that were created by this editor session
  function cleanNode(node: Node) {
    // logging removed for cleanliness
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // If element was created by editor, unwrap or replace depending on tag
      const isMarked = el.dataset && el.dataset.rheFormat === "true";

      const tag = el.tagName;
      if (
        isMarked &&
        (tag === "STRONG" ||
          tag === "B" ||
          tag === "EM" ||
          tag === "I" ||
          tag === "U" ||
          tag === "S")
      ) {
        // replace element with its children and continue cleaning those children
        const frag = doc.createDocumentFragment();
        while (el.firstChild) frag.appendChild(el.firstChild);
        const parent = el.parentNode as Node | null;
        if (parent) parent.replaceChild(frag, el);
        // clean any nodes that were moved up into the fragment location
        Array.from(frag.childNodes).forEach((c) => cleanNode(c));
        return;
      }

      if (isMarked && tag === "SPAN") {
        // remove inline styles applied by editor and unwrap
        el.style.cssText = "";
        const frag = doc.createDocumentFragment();
        while (el.firstChild) frag.appendChild(el.firstChild);
        const parent = el.parentNode as Node | null;
        if (parent) parent.replaceChild(frag, el);
        Array.from(frag.childNodes).forEach((c) => cleanNode(c));
        return;
      }

      if (isMarked && /^H[1-6]$/.test(tag)) {
        // convert heading to paragraph
        const p = doc.createElement("p");
        while (el.firstChild) p.appendChild(el.firstChild);
        const parent = el.parentNode as Node | null;
        if (parent) parent.replaceChild(p, el);
        // continue cleaning inside the new paragraph
        Array.from(p.childNodes).forEach((c) => cleanNode(c));
        return;
      }

      // Otherwise, clean inline styles on marked elements
      if (isMarked) {
        el.style.cssText = "";
      }

      // Recurse into children
      Array.from(el.childNodes).forEach((c) => cleanNode(c));
    }
  }

  // Traverse and clean
  Array.from(content.childNodes).forEach((n) => cleanNode(n));

  // Insert cleaned content wrapped so selection can be restored
  const wrapper = doc.createElement("span");
  wrapper.appendChild(content);
  range.insertNode(wrapper);
  sel.removeAllRanges();
  const newRange = doc.createRange();
  newRange.selectNodeContents(wrapper);
  sel.addRange(newRange);

  // Unwrap wrapper while keeping selection (selection references the nodes)
  const parent = wrapper.parentElement;
  if (parent) {
    const frag = doc.createDocumentFragment();
    while (wrapper.firstChild) frag.appendChild(wrapper.firstChild);
    parent.replaceChild(frag, wrapper);
  }

  // Final cleanup: ensure no leftover editor-marked elements remain
  const root = parent || doc.body;
  const leftover = Array.from(
    (root as Element).querySelectorAll('[data-rhe-format="true"]')
  );
  leftover.forEach((el) => {
    const tag = el.tagName;
    if (/^H[1-6]$/.test(tag)) {
      const p = doc.createElement("p");
      while (el.firstChild) p.appendChild(el.firstChild);
      el.parentElement?.replaceChild(p, el);
      return;
    }
    // unwrap element (move children up); if empty, just remove
    if (el.firstChild) {
      const frag = doc.createDocumentFragment();
      while (el.firstChild) frag.appendChild(el.firstChild);
      el.parentElement?.replaceChild(frag, el);
    } else {
      el.parentElement?.removeChild(el);
    }
  });

  // If the selection was inside a heading element that was marked, convert it to a paragraph
  const possibleBlock = findBlockAncestor(range.startContainer);
  if (
    possibleBlock &&
    possibleBlock.dataset.rheFormat === "true" &&
    /^H[1-6]$/.test(possibleBlock.tagName)
  ) {
    const p = doc.createElement("p");
    while (possibleBlock.firstChild) p.appendChild(possibleBlock.firstChild);
    possibleBlock.parentElement?.replaceChild(p, possibleBlock);
  }
}
