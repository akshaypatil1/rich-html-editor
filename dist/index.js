"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core/events.ts
function getEditorEventEmitter() {
  return editorEventEmitter;
}
var EditorEventEmitter, editorEventEmitter;
var init_events = __esm({
  "src/core/events.ts"() {
    "use strict";
    EditorEventEmitter = class {
      constructor() {
        this.listeners = /* @__PURE__ */ new Map();
      }
      on(type, handler) {
        if (!this.listeners.has(type)) {
          this.listeners.set(type, /* @__PURE__ */ new Set());
        }
        this.listeners.get(type).add(handler);
        return () => this.off(type, handler);
      }
      once(type, handler) {
        const unsubscribe = this.on(type, (event) => {
          handler(event);
          unsubscribe();
        });
      }
      off(type, handler) {
        const handlers = this.listeners.get(type);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) this.listeners.delete(type);
        }
      }
      emit(event) {
        const handlers = this.listeners.get(event.type);
        if (handlers) {
          handlers.forEach((handler) => {
            try {
              handler(event);
            } catch (error) {
              console.error(
                `[rich-html-editor] Error in event handler for ${event.type}:`,
                error
              );
            }
          });
        }
      }
      removeAllListeners(type) {
        if (type) this.listeners.delete(type);
        else this.listeners.clear();
      }
      listenerCount(type) {
        var _a, _b;
        return (_b = (_a = this.listeners.get(type)) == null ? void 0 : _a.size) != null ? _b : 0;
      }
    };
    editorEventEmitter = new EditorEventEmitter();
  }
});

// src/core/constants.ts
var TOOLBAR_ID, STYLE_ID, CLASS_EDITABLE, CLASS_ACTIVE, DEFAULT_MAX_STACK, TOOLBAR_BG, TOOLBAR_BORDER, BUTTON_BORDER, BUTTON_ACTIVE_BG, BUTTON_BG, BUTTON_COLOR, INFO_COLOR, HOVER_OUTLINE, ACTIVE_OUTLINE;
var init_constants = __esm({
  "src/core/constants.ts"() {
    "use strict";
    TOOLBAR_ID = "editor-toolbar";
    STYLE_ID = "editor-styles";
    CLASS_EDITABLE = "editor-editable-element";
    CLASS_ACTIVE = "editor-active-element";
    DEFAULT_MAX_STACK = 60;
    TOOLBAR_BG = "#f8fafc";
    TOOLBAR_BORDER = "#e5e7eb";
    BUTTON_BORDER = "#d1d5db";
    BUTTON_ACTIVE_BG = "#e0e7ff";
    BUTTON_BG = "#fff";
    BUTTON_COLOR = "#222";
    INFO_COLOR = "#888";
    HOVER_OUTLINE = "#2563eb";
    ACTIVE_OUTLINE = "#16a34a";
  }
});

// src/utils/sanitize.ts
function sanitizeHtml(html, ctx) {
  if (!html) return "";
  let win = null;
  if (ctx && ctx.defaultView) {
    win = ctx.defaultView;
  } else if (ctx && ctx.document) {
    win = ctx;
  } else if (typeof window !== "undefined") {
    win = window;
  }
  if (win) {
    try {
      const DOMPurify = (0, import_dompurify.default)(win);
      return DOMPurify.sanitize(html, {
        // Use sensible defaults: allow common formatting tags but strip scripts
        ALLOWED_TAGS: [
          "a",
          "b",
          "i",
          "em",
          "strong",
          "u",
          "p",
          "div",
          "span",
          "ul",
          "ol",
          "li",
          "br",
          "hr",
          "blockquote",
          "pre",
          "code",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "img"
        ],
        ALLOWED_ATTR: ["href", "title", "alt", "src", "class", "style"]
      });
    } catch (e) {
    }
  }
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/on[a-z]+=\"[^"]*\"/gi, "");
}
var import_dompurify;
var init_sanitize = __esm({
  "src/utils/sanitize.ts"() {
    "use strict";
    import_dompurify = __toESM(require("dompurify"));
  }
});

// src/core/state.ts
var state_exports = {};
__export(state_exports, {
  _getCurrentEditable: () => _getCurrentEditable,
  _getDoc: () => _getDoc,
  _getRedoStack: () => _getRedoStack,
  _getUndoStack: () => _getUndoStack,
  _setCurrentEditable: () => _setCurrentEditable,
  _setDoc: () => _setDoc,
  _setRedoStack: () => _setRedoStack,
  _setUndoStack: () => _setUndoStack,
  pushStandaloneSnapshot: () => pushStandaloneSnapshot,
  setMaxStackSize: () => setMaxStackSize
});
function _setDoc(doc) {
  _doc = doc;
}
function _getDoc() {
  return _doc;
}
function _setUndoStack(stack) {
  _undoStack = stack;
  editorEventEmitter.emit({
    type: "undoStateChanged",
    timestamp: Date.now(),
    data: { canUndo: _undoStack.length > 1 }
  });
}
function _getUndoStack() {
  return _undoStack;
}
function _setRedoStack(stack) {
  _redoStack = stack;
  editorEventEmitter.emit({
    type: "redoStateChanged",
    timestamp: Date.now(),
    data: { canRedo: _redoStack.length > 0 }
  });
}
function _getRedoStack() {
  return _redoStack;
}
function _setCurrentEditable(el) {
  _currentEditable = el;
  editorEventEmitter.emit({
    type: "selectionChanged",
    timestamp: Date.now(),
    data: { element: el == null ? void 0 : el.tagName }
  });
}
function _getCurrentEditable() {
  return _currentEditable;
}
function pushStandaloneSnapshot(clearRedo = true) {
  if (!_doc) return;
  const snapRaw = _doc.documentElement.outerHTML;
  const snap = sanitizeHtml(snapRaw, _doc);
  if (!_undoStack.length || _undoStack[_undoStack.length - 1] !== snap) {
    _undoStack.push(snap);
    if (_undoStack.length > _maxStackSize) _undoStack.shift();
    editorEventEmitter.emit({
      type: "contentChanged",
      timestamp: Date.now(),
      data: { htmlLength: snap.length }
    });
  }
  if (clearRedo) {
    _redoStack = [];
    editorEventEmitter.emit({
      type: "redoStateChanged",
      timestamp: Date.now(),
      data: { canRedo: false }
    });
  }
}
function setMaxStackSize(size) {
  _maxStackSize = Math.max(1, size);
}
var _doc, _undoStack, _redoStack, _currentEditable, _maxStackSize;
var init_state = __esm({
  "src/core/state.ts"() {
    "use strict";
    init_events();
    init_constants();
    init_sanitize();
    _doc = null;
    _undoStack = [];
    _redoStack = [];
    _currentEditable = null;
    _maxStackSize = DEFAULT_MAX_STACK;
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  editorEventEmitter: () => editorEventEmitter,
  getCleanHTML: () => getCleanHTML,
  getEditorEventEmitter: () => getEditorEventEmitter,
  initRichEditor: () => initRichEditor
});
module.exports = __toCommonJS(index_exports);

// src/core/editor.ts
init_state();

// src/dom/styles.ts
init_constants();
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
init_constants();
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
    if (label && label.trim().startsWith("<svg")) {
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
    const input = doc.createElement("input");
    input.type = "color";
    input.onchange = (e) => {
      options.onCommand(command, e.target.value);
    };
    label.appendChild(input);
    return label;
  }
  const format = options.getFormatState();
  const ICON_BOLD = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 6h5a3 3 0 0 1 0 6H7V6z" fill="currentColor"/><path d="M7 12h6a3 3 0 0 1 0 6H7v-6z" fill="currentColor" opacity="0.95"/></svg>';
  const ICON_ITALIC = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 4h8v2h-3.5l-4.5 12H16v2H6v-2h3.5l4.5-12H10V4z" fill="currentColor"/></svg>';
  const ICON_UNDERLINE = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4h-2v6a4 4 0 0 1-8 0V4H6z" fill="currentColor"/><path d="M6 20h12v2H6v-2z" fill="currentColor"/></svg>';
  const ICON_UNDO = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9 7L4 12l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M20 12a8 8 0 0 0-8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const ICON_REDO = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 7l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 12a8 8 0 0 0 8 8h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const ICON_LINK = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 14a3 3 0 0 1 0-4l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M14 10a3 3 0 0 1 0 4l-1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const ICON_ALIGN_LEFT = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="4" y="5" width="14" height="2" rx="1" fill="currentColor"/><rect x="4" y="9" width="10" height="2" rx="1" fill="currentColor"/><rect x="4" y="13" width="14" height="2" rx="1" fill="currentColor"/><rect x="4" y="17" width="10" height="2" rx="1" fill="currentColor"/></svg>';
  const ICON_ALIGN_CENTER = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="5" y="5" width="14" height="2" rx="1" fill="currentColor"/><rect x="7" y="9" width="10" height="2" rx="1" fill="currentColor"/><rect x="5" y="13" width="14" height="2" rx="1" fill="currentColor"/><rect x="7" y="17" width="10" height="2" rx="1" fill="currentColor"/></svg>';
  const ICON_ALIGN_RIGHT = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="5" width="14" height="2" rx="1" fill="currentColor"/><rect x="8" y="9" width="10" height="2" rx="1" fill="currentColor"/><rect x="6" y="13" width="14" height="2" rx="1" fill="currentColor"/><rect x="8" y="17" width="10" height="2" rx="1" fill="currentColor"/></svg>';
  toolbar.appendChild(
    makeButton(ICON_BOLD, "Bold", "bold", void 0, format.bold)
  );
  toolbar.appendChild(
    makeButton(ICON_ITALIC, "Italic", "italic", void 0, format.italic)
  );
  toolbar.appendChild(
    makeButton(
      ICON_UNDERLINE,
      "Underline",
      "underline",
      void 0,
      format.underline
    )
  );
  toolbar.appendChild(
    makeSelect("Font", "fontName", [
      { label: "Arial", value: "Arial" },
      { label: "Georgia", value: "Georgia" },
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Courier New", value: "Courier New" },
      { label: "Tahoma", value: "Tahoma" }
    ])
  );
  toolbar.appendChild(
    makeSelect("Size", "fontSize", [
      { label: "Small", value: "2" },
      { label: "Normal", value: "3" },
      { label: "Medium", value: "4" },
      { label: "Large", value: "5" },
      { label: "XL", value: "6" }
    ])
  );
  toolbar.appendChild(
    makeButton(ICON_UNDO, "Undo", "undo", void 0, false, !options.canUndo())
  );
  toolbar.appendChild(
    makeButton(ICON_REDO, "Redo", "redo", void 0, false, !options.canRedo())
  );
  toolbar.appendChild(makeButton(ICON_LINK, "Insert link", "link"));
  toolbar.appendChild(makeColorInput("Text color", "foreColor"));
  toolbar.appendChild(makeColorInput("Highlight color", "hiliteColor"));
  toolbar.appendChild(
    makeButton(ICON_ALIGN_LEFT, "Align left", "align", "left")
  );
  toolbar.appendChild(
    makeButton(ICON_ALIGN_CENTER, "Align center", "align", "center")
  );
  toolbar.appendChild(
    makeButton(ICON_ALIGN_RIGHT, "Align right", "align", "right")
  );
  const info = doc.createElement("span");
  info.textContent = options.getSelectedElementInfo() ? `Selected: ${options.getSelectedElementInfo()}` : "Click any highlighted element to edit";
  toolbar.appendChild(info);
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

// src/dom/handlers.ts
init_state();

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
init_state();
init_sanitize();
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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Redo failed:", message);
  }
}

// src/core/formatActions.ts
init_state();
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
    else if (command === "fontName")
      wrapSelectionWithElement(doc, "span", { fontFamily: value });
    else if (command === "fontSize") {
      const map = {
        "2": "12px",
        "3": "14px",
        "4": "16px",
        "5": "18px",
        "6": "20px"
      };
      const sz = map[value || "3"] || value || "";
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
init_constants();
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
      Promise.resolve().then(() => (init_state(), state_exports)).then((m) => m.setMaxStackSize(config.maxStackSize)).catch(() => {
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
    return "<!doctype html>\n" + doc.documentElement.outerHTML;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to get clean HTML:", message);
    throw error;
  }
}

// src/index.ts
init_events();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  editorEventEmitter,
  getCleanHTML,
  getEditorEventEmitter,
  initRichEditor
});
//# sourceMappingURL=index.js.map