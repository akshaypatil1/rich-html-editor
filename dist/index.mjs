import {
  ACTIVE_OUTLINE,
  BUTTON_ACTIVE_BG,
  BUTTON_BG,
  BUTTON_BORDER,
  BUTTON_COLOR,
  CLASS_ACTIVE,
  CLASS_EDITABLE,
  FONT_OPTIONS,
  FORMAT_OPTIONS,
  HOVER_OUTLINE,
  INFO_COLOR,
  LABEL_ALIGN_CENTER,
  LABEL_ALIGN_LEFT,
  LABEL_ALIGN_RIGHT,
  LABEL_BOLD,
  LABEL_ITALIC,
  LABEL_LINK,
  LABEL_REDO,
  LABEL_STRIKETHROUGH,
  LABEL_UNDERLINE,
  LABEL_UNDO,
  SIZE_OPTIONS,
  STYLE_ID,
  TOOLBAR_BG,
  TOOLBAR_BORDER,
  TOOLBAR_ID,
  _getCurrentEditable,
  _getDoc,
  _getRedoStack,
  _getUndoStack,
  _setCurrentEditable,
  _setDoc,
  _setRedoStack,
  _setUndoStack,
  editorEventEmitter,
  getEditorEventEmitter,
  pushStandaloneSnapshot,
  sanitizeHtml
} from "./chunk-A3UDAUE6.mjs";

// src/dom/styles.ts
function injectStyles(doc) {
  const styleId = STYLE_ID;
  let styleEl = doc.getElementById(styleId);
  const css = `
.${CLASS_EDITABLE}{outline:2px dashed ${HOVER_OUTLINE};cursor:text}
.${CLASS_ACTIVE}{outline:2px solid ${ACTIVE_OUTLINE};cursor:text}
#${TOOLBAR_ID}{
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${TOOLBAR_BG};
  border-bottom: 1px solid ${TOOLBAR_BORDER};
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(2,6,23,0.08);
  backdrop-filter: blur(6px);
}
#${TOOLBAR_ID} button{
  padding: 6px 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: ${BUTTON_BG};
  color: ${BUTTON_COLOR};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
  outline: none;
  margin-right: 2px;
}
#${TOOLBAR_ID} button[aria-pressed="true"]{
  background: ${BUTTON_ACTIVE_BG};
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(99,102,241,0.12);
}
#${TOOLBAR_ID} button:hover:not(:disabled){
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(2,6,23,0.08);
}
#${TOOLBAR_ID} select, #${TOOLBAR_ID} input[type="color"]{
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} span{
  margin-left: 16px;
  color: ${INFO_COLOR};
  font-size: 90%;
}

/* Grouping and separators */
#${TOOLBAR_ID} .toolbar-group{
  display: flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .toolbar-sep{
  width: 1px;
  height: 28px;
  background: rgba(15,23,42,0.06);
  margin: 0 8px;
  border-radius: 1px;
}
#${TOOLBAR_ID} .toolbar-spacer{
  flex: 1 1 auto;
}
#${TOOLBAR_ID} button svg{
  width: 16px;
  height: 16px;
  display: block;
  /* Default: use stroke icons (outline) so they look like Phosphor regular */
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

/* Active/pressed: switch to filled appearance */
#${TOOLBAR_ID} button[aria-pressed="true"] svg{
  fill: currentColor;
  stroke: none;
}

/* Focus and accessibility */
#${TOOLBAR_ID} button:focus{
  outline: none;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}

/* Disabled state */
#${TOOLBAR_ID} button:disabled{
  opacity: 0.48;
  cursor: not-allowed;
}
`;
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = styleId;
    doc.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

// src/toolbar/toolbar.ts
function injectToolbar(doc, options) {
  const existing = doc.getElementById(TOOLBAR_ID);
  if (existing) existing.remove();
  const toolbar = doc.createElement("div");
  toolbar.id = TOOLBAR_ID;
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Rich text editor toolbar");
  function makeButton(label, title, command, value, isActive, disabled) {
    const btn = doc.createElement("button");
    btn.type = "button";
    if (label && label.trim().startsWith("<")) {
      btn.innerHTML = label;
    } else {
      btn.textContent = label;
    }
    btn.title = title;
    btn.setAttribute("aria-label", title);
    if (typeof isActive !== "undefined")
      btn.setAttribute("aria-pressed", String(!!isActive));
    btn.tabIndex = 0;
    if (disabled) btn.disabled = true;
    btn.onclick = () => options.onCommand(command, value);
    btn.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        btn.click();
      }
    });
    return btn;
  }
  function makeSelect(title, command, optionsList) {
    const select = doc.createElement("select");
    select.title = title;
    select.setAttribute("aria-label", title);
    select.appendChild(new Option(title, "", true, true));
    for (const opt of optionsList) {
      select.appendChild(new Option(opt.label, opt.value));
    }
    select.onchange = (e) => {
      const val = e.target.value;
      options.onCommand(command, val);
      select.selectedIndex = 0;
    };
    return select;
  }
  function makeColorInput(title, command) {
    const label = doc.createElement("label");
    label.title = title;
    label.setAttribute("aria-label", title);
    label.className = "color-input-label";
    const input = doc.createElement("input");
    input.type = "color";
    input.className = "toolbar-color-input";
    input.onchange = (e) => {
      options.onCommand(command, e.target.value);
    };
    label.appendChild(input);
    return label;
  }
  const format = options.getFormatState();
  function makeGroup() {
    const g = doc.createElement("div");
    g.className = "toolbar-group";
    return g;
  }
  function makeSep() {
    const s = doc.createElement("div");
    s.className = "toolbar-sep";
    return s;
  }
  const undoBtn = makeButton(
    LABEL_UNDO,
    "Undo",
    "undo",
    void 0,
    false,
    !options.canUndo()
  );
  undoBtn.onclick = () => options.onUndo();
  const redoBtn = makeButton(
    LABEL_REDO,
    "Redo",
    "redo",
    void 0,
    false,
    !options.canRedo()
  );
  redoBtn.onclick = () => options.onRedo();
  const grp1 = makeGroup();
  grp1.appendChild(undoBtn);
  grp1.appendChild(redoBtn);
  toolbar.appendChild(grp1);
  toolbar.appendChild(makeSep());
  const grp2 = makeGroup();
  grp2.appendChild(makeSelect("Format", "formatBlock", FORMAT_OPTIONS));
  grp2.appendChild(makeSelect("Font", "fontName", FONT_OPTIONS));
  grp2.appendChild(makeSelect("Size", "fontSize", SIZE_OPTIONS));
  toolbar.appendChild(grp2);
  toolbar.appendChild(makeSep());
  const grp3 = makeGroup();
  grp3.appendChild(
    makeButton(LABEL_BOLD, "Bold", "bold", void 0, format.bold)
  );
  grp3.appendChild(
    makeButton(LABEL_ITALIC, "Italic", "italic", void 0, format.italic)
  );
  grp3.appendChild(
    makeButton(
      LABEL_UNDERLINE,
      "Underline",
      "underline",
      void 0,
      format.underline
    )
  );
  grp3.appendChild(makeButton(LABEL_STRIKETHROUGH, "Strikethrough", "strike"));
  toolbar.appendChild(grp3);
  toolbar.appendChild(makeSep());
  const grp4 = makeGroup();
  grp4.appendChild(makeButton(LABEL_ALIGN_LEFT, "Align left", "align", "left"));
  grp4.appendChild(
    makeButton(LABEL_ALIGN_CENTER, "Align center", "align", "center")
  );
  grp4.appendChild(
    makeButton(LABEL_ALIGN_RIGHT, "Align right", "align", "right")
  );
  toolbar.appendChild(grp4);
  toolbar.appendChild(makeSep());
  const grp5 = makeGroup();
  grp5.appendChild(makeColorInput("Text color", "foreColor"));
  grp5.appendChild(makeColorInput("Highlight color", "hiliteColor"));
  toolbar.appendChild(grp5);
  toolbar.appendChild(makeSep());
  const grp6 = makeGroup();
  grp6.appendChild(makeButton(LABEL_LINK, "Insert link", "link"));
  toolbar.appendChild(grp6);
  toolbar.addEventListener("keydown", (e) => {
    const focusable = Array.from(
      toolbar.querySelectorAll("button, select, input, [tabindex]")
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!focusable.length) return;
    const idx = focusable.indexOf(document.activeElement);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = focusable[Math.min(focusable.length - 1, Math.max(0, idx + 1))];
      next == null ? void 0 : next.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = focusable[Math.max(0, idx - 1)] || focusable[0];
      prev == null ? void 0 : prev.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      focusable[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      focusable[focusable.length - 1].focus();
    }
  });
  doc.body.insertBefore(toolbar, doc.body.firstChild);
}

// src/dom/candidates.ts
function isEditableCandidate(el) {
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
    "NOSCRIPT"
  ];
  if (DISALLOWED.includes(tag)) return false;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
  return true;
}

// src/dom/format.ts
function computeFormatState(doc) {
  var _a;
  try {
    const s = doc.getSelection();
    let el = null;
    if (s && s.anchorNode)
      el = s.anchorNode.nodeType === Node.ELEMENT_NODE ? s.anchorNode : s.anchorNode.parentElement;
    if (!el) return { bold: false, italic: false, underline: false };
    const computed = (_a = doc.defaultView) == null ? void 0 : _a.getComputedStyle(el);
    const bold = !!(el.closest("strong, b") || computed && (computed.fontWeight === "700" || Number(computed.fontWeight) >= 700));
    const italic = !!(el.closest("em, i") || computed && computed.fontStyle === "italic");
    const underline = !!(el.closest("u") || computed && (computed.textDecorationLine || "").includes("underline"));
    return { bold, italic, underline };
  } catch (err) {
    return { bold: false, italic: false, underline: false };
  }
}
function getElementLabel(el) {
  if (!el) return null;
  const id = el.id ? `#${el.id}` : "";
  const cls = el.className ? `.${String(el.className).split(" ")[0]}` : "";
  const tag = el.tagName.toLowerCase();
  return `${tag}${id}${cls}`;
}

// src/core/sanitizeURL.ts
function sanitizeURL(url) {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.toLowerCase().startsWith("javascript:") || trimmed.toLowerCase().startsWith("data:")) {
    console.warn("Blocked potentially dangerous URL protocol");
    return "";
  }
  if (!trimmed.startsWith("http") && !trimmed.startsWith("#")) {
    return "https://" + trimmed;
  }
  return trimmed;
}

// src/core/history.ts
function handleUndo() {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] handleUndo called before initialization"
      );
      return;
    }
    if (_getUndoStack().length < 2) return;
    const undoStack = _getUndoStack();
    const redoStack = _getRedoStack();
    const current = undoStack.pop();
    redoStack.push(current);
    const prev = undoStack[undoStack.length - 1];
    if (!doc.documentElement) {
      throw new Error("Document is missing documentElement");
    }
    const safe = sanitizeHtml(prev.replace(/^<!doctype html>\n?/i, ""), doc);
    doc.documentElement.innerHTML = safe;
    injectStyles(doc);
    try {
      doc.dispatchEvent(new Event("selectionchange"));
    } catch (err) {
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Undo failed:", message);
  }
}
function handleRedo() {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] handleRedo called before initialization"
      );
      return;
    }
    if (!_getRedoStack().length) return;
    const undoStack = _getUndoStack();
    const redoStack = _getRedoStack();
    const next = redoStack.pop();
    undoStack.push(next);
    if (!doc.documentElement) {
      throw new Error("Document is missing documentElement");
    }
    const safeNext = sanitizeHtml(
      next.replace(/^<!doctype html>\n?/i, ""),
      doc
    );
    doc.documentElement.innerHTML = safeNext;
    injectStyles(doc);
    try {
      doc.dispatchEvent(new Event("selectionchange"));
    } catch (err) {
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Redo failed:", message);
  }
}

// src/core/formatActions.ts
function handleToolbarCommand(command, value) {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] handleToolbarCommand called before initialization"
      );
      return;
    }
    if (command === "undo") return;
    if (command === "redo") return;
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
function applyStandaloneCommand(command, value) {
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
      wrapSelectionWithElement(doc, "span", { fontFamily: value });
    else if (command === "fontSize") {
      const raw = value || "14";
      const n = parseInt(raw, 10);
      const sz = Number.isFinite(n) ? `${n}px` : raw;
      wrapSelectionWithElement(doc, "span", { fontSize: sz });
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
      wrapSelectionWithElement(doc, "span", { color: value });
    else if (command === "hiliteColor")
      wrapSelectionWithElement(doc, "span", { backgroundColor: value });
    else if (command === "align") {
      const sel = doc.getSelection();
      const node = (sel == null ? void 0 : sel.anchorNode) || null;
      const block = findBlockAncestor(node);
      if (block) block.style.textAlign = value || "left";
      else wrapSelectionWithElement(doc, "div", { textAlign: value });
    } else if (command === "formatBlock") {
      const sel = doc.getSelection();
      const node = (sel == null ? void 0 : sel.anchorNode) || null;
      const block = findBlockAncestor(node);
      const tag = (value || "p").toLowerCase();
      if (block && block.parentElement) {
        const newEl = doc.createElement(tag);
        newEl.className = block.className || "";
        while (block.firstChild) newEl.appendChild(block.firstChild);
        block.parentElement.replaceChild(newEl, block);
      } else {
        wrapSelectionWithElement(doc, tag);
      }
    }
    pushStandaloneSnapshot();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Apply command failed:", message);
  }
}
function wrapSelectionWithElement(doc, tagName, style) {
  const sel = doc.getSelection();
  if (!sel) return;
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  if (range.collapsed) {
    const el = doc.createElement(tagName);
    if (style) Object.assign(el.style, style);
    const zw = doc.createTextNode("\u200B");
    el.appendChild(zw);
    range.insertNode(el);
    const newRange2 = doc.createRange();
    newRange2.setStart(zw, 1);
    newRange2.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange2);
    return;
  }
  const content = range.extractContents();
  const wrapper = doc.createElement(tagName);
  if (style) Object.assign(wrapper.style, style);
  wrapper.appendChild(content);
  range.insertNode(wrapper);
  sel.removeAllRanges();
  const newRange = doc.createRange();
  newRange.selectNodeContents(wrapper);
  sel.addRange(newRange);
}
function findBlockAncestor(node) {
  let n = node;
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
    "H6"
  ];
  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) {
      const el = n;
      if (BLOCKS.includes(el.tagName)) return el;
    }
    n = n.parentNode;
  }
  return null;
}

// src/dom/handlers.ts
function attachStandaloneHandlers(doc) {
  doc.addEventListener(
    "click",
    (e) => {
      var _a, _b;
      const target = e.target;
      if (!isEditableCandidate(target)) return;
      if (_getCurrentEditable() && _getCurrentEditable() !== target) {
        (_a = _getCurrentEditable()) == null ? void 0 : _a.removeAttribute("contenteditable");
        (_b = _getCurrentEditable()) == null ? void 0 : _b.classList.remove(CLASS_ACTIVE);
      }
      _setCurrentEditable(target);
      target.classList.add(CLASS_ACTIVE);
      target.setAttribute("contenteditable", "true");
      target.focus();
    },
    true
  );
  doc.addEventListener("selectionchange", () => {
    injectToolbar(doc, {
      onCommand: handleToolbarCommand,
      canUndo: () => _getUndoStack().length > 1,
      canRedo: () => _getRedoStack().length > 0,
      onUndo: handleUndo,
      onRedo: handleRedo,
      getFormatState: () => computeFormatState(doc),
      getSelectedElementInfo: () => getElementLabel(_getCurrentEditable())
    });
  });
  doc.addEventListener("input", () => pushStandaloneSnapshot(), true);
  doc.addEventListener(
    "keydown",
    (e) => {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        handleToolbarCommand("bold");
        return;
      }
      if (key === "i") {
        e.preventDefault();
        handleToolbarCommand("italic");
        return;
      }
      if (key === "u") {
        e.preventDefault();
        handleToolbarCommand("underline");
        return;
      }
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      if (key === "y") {
        e.preventDefault();
        handleRedo();
        return;
      }
    },
    true
  );
}

// src/core/editor.ts
function initRichEditor(iframe, config) {
  try {
    if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
      throw new Error("Invalid iframe element provided to initRichEditor");
    }
    const doc = iframe.contentDocument;
    if (!doc) {
      throw new Error(
        "Unable to access iframe contentDocument. Ensure iframe src is same-origin."
      );
    }
    _setDoc(doc);
    injectStyles(doc);
    _setUndoStack([]);
    _setRedoStack([]);
    _setCurrentEditable(null);
    if (config == null ? void 0 : config.maxStackSize) {
      import("./state-54NPZ5HL.mjs").then((m) => m.setMaxStackSize(config.maxStackSize)).catch(() => {
      });
    }
    attachStandaloneHandlers(doc);
    pushStandaloneSnapshot();
    injectToolbar(doc, {
      onCommand: handleToolbarCommand,
      canUndo: () => _getUndoStack().length > 1,
      canRedo: () => _getRedoStack().length > 0,
      onUndo: handleUndo,
      onRedo: handleRedo,
      getFormatState: () => computeFormatState(doc),
      getSelectedElementInfo: () => getElementLabel(_getCurrentEditable())
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to initialize editor:", message);
    throw error;
  }
}
function getCleanHTML() {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] getCleanHTML called before editor initialization"
      );
      return "";
    }
    if (!doc.documentElement) {
      throw new Error("Document is missing documentElement");
    }
    const clone = doc.documentElement.cloneNode(true);
    const toolbarNode = clone.querySelector(`#${TOOLBAR_ID}`);
    if (toolbarNode && toolbarNode.parentNode)
      toolbarNode.parentNode.removeChild(toolbarNode);
    const styleNode = clone.querySelector(`#${STYLE_ID}`);
    if (styleNode && styleNode.parentNode)
      styleNode.parentNode.removeChild(styleNode);
    const editableNodes = clone.querySelectorAll(
      "[contenteditable], ." + CLASS_EDITABLE + ", ." + CLASS_ACTIVE
    );
    editableNodes.forEach((el) => {
      try {
        if (el instanceof Element) {
          if (el.hasAttribute("contenteditable"))
            el.removeAttribute("contenteditable");
          if (el.hasAttribute("tabindex")) el.removeAttribute("tabindex");
          el.classList.remove(CLASS_EDITABLE, CLASS_ACTIVE);
        }
      } catch (e) {
      }
    });
    return "<!doctype html>\n" + clone.outerHTML;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to get clean HTML:", message);
    throw error;
  }
}
export {
  editorEventEmitter,
  getCleanHTML,
  getEditorEventEmitter,
  initRichEditor
};
//# sourceMappingURL=index.mjs.map