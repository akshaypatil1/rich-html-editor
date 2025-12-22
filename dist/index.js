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
var TOOLBAR_ID, STYLE_ID, CLASS_EDITABLE, CLASS_ACTIVE, DEFAULT_MAX_STACK, TOOLBAR_BG, TOOLBAR_BORDER, BUTTON_BORDER, BUTTON_ACTIVE_BG, BUTTON_BG, BUTTON_COLOR, INFO_COLOR, HOVER_OUTLINE, ACTIVE_OUTLINE, LABEL_BOLD, LABEL_ITALIC, LABEL_UNDERLINE, LABEL_STRIKETHROUGH, LABEL_UNDO, LABEL_REDO, LABEL_LINK, LABEL_UNORDERED_LIST, LABEL_ORDERED_LIST, LABEL_ALIGN_LEFT, LABEL_ALIGN_CENTER, LABEL_ALIGN_RIGHT, FONT_OPTIONS, SIZE_OPTIONS, FORMAT_OPTIONS;
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
    LABEL_BOLD = "<b>B</b>";
    LABEL_ITALIC = "<i>I</i>";
    LABEL_UNDERLINE = "<u>U</u>";
    LABEL_STRIKETHROUGH = "<s>S</s>";
    LABEL_UNDO = "\u21BA";
    LABEL_REDO = "\u21BB";
    LABEL_LINK = "\u{1F517}";
    LABEL_UNORDERED_LIST = `
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <rect x="6" y="3" width="9" height="2" rx="0.5" fill="currentColor" />
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <rect x="6" y="7" width="9" height="2" rx="0.5" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <rect x="6" y="11" width="9" height="2" rx="0.5" fill="currentColor" />
  </svg>
`;
    LABEL_ORDERED_LIST = `
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <text x="1" y="4" font-size="4" fill="currentColor">1.</text>
    <rect x="6" y="3" width="9" height="2" rx="0.5" fill="currentColor" />
    <text x="1" y="8" font-size="4" fill="currentColor">2.</text>
    <rect x="6" y="7" width="9" height="2" rx="0.5" fill="currentColor" />
    <text x="1" y="12" font-size="4" fill="currentColor">3.</text>
    <rect x="6" y="11" width="9" height="2" rx="0.5" fill="currentColor" />
  </svg>
`;
    LABEL_ALIGN_LEFT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="1" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
    LABEL_ALIGN_CENTER = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="3" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="3" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
    LABEL_ALIGN_RIGHT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="5" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="5" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
    FONT_OPTIONS = [
      { label: "Arial", value: "Arial" },
      { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
      { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
      { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
      { label: "Trebuchet MS", value: "Trebuchet MS, Helvetica, sans-serif" },
      { label: "Georgia", value: "Georgia, serif" },
      { label: "Times New Roman", value: "Times New Roman, Times, serif" },
      { label: "Palatino", value: "Palatino, 'Palatino Linotype', serif" },
      { label: "Garamond", value: "Garamond, serif" },
      { label: "Book Antiqua", value: "'Book Antiqua', Palatino, serif" },
      { label: "Courier New", value: "'Courier New', Courier, monospace" },
      { label: "Lucida Console", value: "'Lucida Console', Monaco, monospace" },
      { label: "Impact", value: "Impact, Charcoal, sans-serif" },
      { label: "Comic Sans MS", value: "'Comic Sans MS', 'Comic Sans', cursive" },
      { label: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, sans-serif" },
      {
        label: "Roboto",
        value: "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
      },
      { label: "Open Sans", value: "'Open Sans', Arial, sans-serif" },
      { label: "Lato", value: "Lato, 'Helvetica Neue', Arial, sans-serif" },
      { label: "Montserrat", value: "Montserrat, Arial, sans-serif" },
      { label: "Source Sans Pro", value: "'Source Sans Pro', Arial, sans-serif" },
      { label: "Fira Sans", value: "'Fira Sans', Arial, sans-serif" },
      { label: "Ubuntu", value: "Ubuntu, Arial, sans-serif" },
      { label: "Noto Sans", value: "'Noto Sans', Arial, sans-serif" },
      { label: "Droid Sans", value: "'Droid Sans', Arial, sans-serif" },
      {
        label: "Helvetica Neue",
        value: "'Helvetica Neue', Helvetica, Arial, sans-serif"
      },
      {
        label: "System UI",
        value: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }
    ];
    SIZE_OPTIONS = [
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "10", value: "10" },
      { label: "11", value: "11" },
      { label: "12", value: "12" },
      { label: "14", value: "14" },
      { label: "16", value: "16" },
      { label: "18", value: "18" },
      { label: "20", value: "20" },
      { label: "22", value: "22" },
      { label: "24", value: "24" },
      { label: "26", value: "26" },
      { label: "28", value: "28" },
      { label: "36", value: "36" },
      { label: "48", value: "48" },
      { label: "72", value: "72" }
    ];
    FORMAT_OPTIONS = [
      { label: "Heading 1", value: "h1" },
      { label: "Heading 2", value: "h2" },
      { label: "Heading 3", value: "h3" },
      { label: "Heading 4", value: "h4" },
      { label: "Heading 5", value: "h5" },
      { label: "Heading 6", value: "h6" }
    ];
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
      try {
        DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
          try {
            if (data && data.attrName && data.attrName.startsWith("data-")) {
              data.keepAttr = true;
            }
          } catch (e) {
          }
        });
      } catch (e) {
      }
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
          // Common semantic elements: preserve document structure so undo/redo
          // does not flatten header/section/nav into plain content.
          "header",
          "nav",
          "section",
          "main",
          "footer",
          "article",
          "aside",
          "figure",
          "figcaption",
          "time",
          // Interactive / form elements that may appear in content
          "button",
          "input",
          "label",
          "select",
          "option",
          "textarea",
          "details",
          "summary",
          // Allow <style> tags so user/content-provided CSS is preserved
          // when taking snapshots and during undo/redo operations.
          // DOMPurify will still sanitize the contents of style blocks.
          "style",
          // Preserve linked stylesheets so page/editor styling isn't lost
          "link",
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
        ALLOWED_ATTR: [
          "href",
          "title",
          "alt",
          "src",
          "class",
          "style",
          // Attributes used by <link> tags
          "rel",
          "type",
          "media"
        ],
        // Also allow `id` attributes so element ids survive sanitization.
        ADD_ATTR: ["id"]
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
  const clone = _doc.documentElement.cloneNode(true);
  const toolbarNode = clone.querySelector(`#${TOOLBAR_ID}`);
  if (toolbarNode && toolbarNode.parentNode)
    toolbarNode.parentNode.removeChild(toolbarNode);
  const styleNode = clone.querySelector(`#${STYLE_ID}`);
  if (styleNode && styleNode.parentNode)
    styleNode.parentNode.removeChild(styleNode);
  try {
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
  } catch (e) {
  }
  try {
    const scripts = Array.from(
      clone.querySelectorAll("script")
    );
    scripts.forEach((s) => {
      var _a;
      try {
        const code = s.textContent || "";
        const attrs = {};
        Array.from(s.attributes).forEach((a) => attrs[a.name] = a.value);
        const placeholder = clone.ownerDocument.createElement("span");
        try {
          const safe = typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(code))) : encodeURIComponent(code);
          placeholder.setAttribute("data-rhe-script", safe);
        } catch (e) {
          placeholder.setAttribute("data-rhe-script", encodeURIComponent(code));
        }
        if (Object.keys(attrs).length) {
          placeholder.setAttribute(
            "data-rhe-script-attrs",
            encodeURIComponent(JSON.stringify(attrs))
          );
        }
        const parentMarker = s.closest("[data-rhe-id]");
        if (parentMarker && parentMarker.getAttribute("data-rhe-id")) {
          placeholder.setAttribute(
            "data-rhe-script-parent",
            parentMarker.getAttribute("data-rhe-id")
          );
        } else {
          placeholder.setAttribute("data-rhe-script-parent", "head");
        }
        (_a = s.parentNode) == null ? void 0 : _a.replaceChild(placeholder, s);
      } catch (e) {
      }
    });
  } catch (e) {
  }
  const snapRaw = clone.outerHTML;
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
  /* Allow toolbar items to wrap onto multiple lines on narrow screens */
  flex-wrap: wrap;
  justify-content: flex-start;
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
#${TOOLBAR_ID} select{
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} input[type="color"]{
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} .color-input-label{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
}

/* Labeled color inputs (e.g. "Text Color <input type=color>") */
#${TOOLBAR_ID} .color-label{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
}
#${TOOLBAR_ID} .color-input-label .color-icon{
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
#${TOOLBAR_ID} .text-color-icon{
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 3px solid currentColor;
  transform-origin: center;
}
#${TOOLBAR_ID} .highlight-icon{
  width: 16px;
  height: 16px;
  display: inline-block;
}
#${TOOLBAR_ID} .color-icon svg{
  width: 16px;
  height: 16px;
  display: block;
}
/* Text color wrapper: A with a small swatch on the right */
#${TOOLBAR_ID} .text-color-wrapper{
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .text-color-wrapper .text-A{
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}
#${TOOLBAR_ID} .text-color-wrapper .color-swatch{
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.12);
  box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset;
  background: currentColor;
}

/* Highlight wrapper: small colored bar under/behind the A to mimic highlighter */
#${TOOLBAR_ID} .highlight-wrapper{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
}
#${TOOLBAR_ID} .highlight-wrapper .highlight-bar{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 8px;
  border-radius: 3px;
  background: #ffeb3b; /* default yellow */
  z-index: 0;
}
#${TOOLBAR_ID} .highlight-wrapper .text-A{
  position: relative;
  z-index: 1;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  padding: 0 4px;
}
#${TOOLBAR_ID} span{
  color: ${INFO_COLOR};
  font-size: 90%;
}

/* Grouping and separators */
#${TOOLBAR_ID} .toolbar-group{
  display: flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .toolbar-group{
  /* groups may wrap internally to avoid overflow on narrow screens */
  flex-wrap: wrap;
}
/* Overflow button + menu styling */
#${TOOLBAR_ID} .toolbar-overflow-btn{
  display: none;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: ${BUTTON_BG};
  color: ${BUTTON_COLOR};
  font-weight: 600;
}
#${TOOLBAR_ID} .toolbar-overflow-menu{
  position: absolute;
  top: calc(100% + 6px);
  right: 12px;
  min-width: 160px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 12px 40px rgba(2,6,23,0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10000;
}
#${TOOLBAR_ID} .toolbar-overflow-menu[hidden]{
  display: none;
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
  /* Default icon appearance */
  fill: none;
}

/* Active/pressed: switch to filled appearance */
#${TOOLBAR_ID} button[aria-pressed="true"] svg{
  fill: currentColor;
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
/* Responsive tweaks: reduce spacing and allow horizontal scroll on very small screens */
@media (max-width: 720px){
  #${TOOLBAR_ID}{
    padding: 6px 8px;
    gap: 6px;
  }
  #${TOOLBAR_ID} button,
  #${TOOLBAR_ID} select,
  #${TOOLBAR_ID} input[type="color"]{
    padding: 4px 6px;
    border-radius: 6px;
  }
  /* Hide visual separators to save horizontal space */
  #${TOOLBAR_ID} .toolbar-sep{
    display: none;
  }
  /* Collapse labeled color text visually but preserve accessibility on the input */
  #${TOOLBAR_ID} .color-label{
    font-size: 0;
  }
  #${TOOLBAR_ID} .color-label input{
    font-size: initial;
  }
}
@media (max-width: 420px){
  /* On very small screens prefer a single-line scrollable toolbar */
  #${TOOLBAR_ID}{
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  #${TOOLBAR_ID} .toolbar-group{
    flex: 0 0 auto;
  }
  #${TOOLBAR_ID} button{ margin-right: 6px; }
  /* Show overflow button and hide the groups marked for collapse */
  #${TOOLBAR_ID} .toolbar-overflow-btn{
    display: inline-flex;
  }
  #${TOOLBAR_ID} .collapse-on-small{
    display: none;
  }
}
`;
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = styleId;
    doc.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

// src/toolbar/render.ts
init_constants();

// src/toolbar/color.ts
function makeColorInput(doc, options, title, command, initialColor) {
  const input = doc.createElement("input");
  input.type = "color";
  input.className = "toolbar-color-input";
  const wrapper = doc.createElement("label");
  wrapper.className = "color-label";
  wrapper.appendChild(doc.createTextNode(title + " "));
  wrapper.appendChild(input);
  let savedRange = null;
  input.addEventListener("pointerdown", () => {
    const s = doc.getSelection();
    if (s && s.rangeCount) savedRange = s.getRangeAt(0).cloneRange();
  });
  input.onchange = (e) => {
    try {
      const s = doc.getSelection();
      if (savedRange && s) {
        s.removeAllRanges();
        s.addRange(savedRange);
      }
    } catch (err) {
    }
    options.onCommand(command, e.target.value);
    savedRange = null;
  };
  function rgbToHex(input2) {
    if (!input2) return null;
    const v = input2.trim();
    if (v.startsWith("#")) {
      if (v.length === 4) {
        return ("#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toLowerCase();
      }
      return v.toLowerCase();
    }
    const rgbMatch = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
      const r = Number(rgbMatch[1]);
      const g = Number(rgbMatch[2]);
      const b = Number(rgbMatch[3]);
      const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toLowerCase();
      return hex;
    }
    return null;
  }
  const setColor = (val) => {
    if (!val) return;
    const hex = rgbToHex(val) || val;
    try {
      if (hex && hex.startsWith("#") && input.value !== hex) {
        input.value = hex;
      }
    } catch (e) {
    }
  };
  if (initialColor) setColor(initialColor);
  input.addEventListener("input", (e) => {
    const val = e.target.value;
    setColor(val);
  });
  input.title = title;
  input.setAttribute("aria-label", title);
  return wrapper;
}

// src/toolbar/overflow.ts
function setupOverflow(doc, toolbar, options, format, helpers) {
  const overflowBtn = doc.createElement("button");
  overflowBtn.type = "button";
  overflowBtn.className = "toolbar-overflow-btn";
  overflowBtn.title = "More";
  overflowBtn.setAttribute("aria-label", "More toolbar actions");
  overflowBtn.setAttribute("aria-haspopup", "true");
  overflowBtn.setAttribute("aria-expanded", "false");
  overflowBtn.tabIndex = 0;
  overflowBtn.innerHTML = "\u22EF";
  const overflowMenu = doc.createElement("div");
  overflowMenu.className = "toolbar-overflow-menu";
  overflowMenu.setAttribute("role", "menu");
  overflowMenu.hidden = true;
  function openOverflow() {
    overflowMenu.hidden = false;
    overflowBtn.setAttribute("aria-expanded", "true");
    const first = overflowMenu.querySelector(
      "button, select, input"
    );
    first == null ? void 0 : first.focus();
  }
  function closeOverflow() {
    overflowMenu.hidden = true;
    overflowBtn.setAttribute("aria-expanded", "false");
    overflowBtn.focus();
  }
  overflowBtn.addEventListener("click", () => {
    if (overflowMenu.hidden) openOverflow();
    else closeOverflow();
  });
  overflowBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (overflowMenu.hidden) openOverflow();
      else closeOverflow();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (overflowMenu.hidden) openOverflow();
    }
  });
  overflowMenu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeOverflow();
    }
  });
  doc.addEventListener("pointerdown", (ev) => {
    if (!overflowMenu.hidden && !overflowMenu.contains(ev.target) && ev.target !== overflowBtn) {
      closeOverflow();
    }
  });
  overflowMenu.appendChild(
    helpers.makeSelect(
      "Format",
      "formatBlock",
      window.RHE_FORMAT_OPTIONS || [],
      format.formatBlock
    )
  );
  overflowMenu.appendChild(
    helpers.makeSelect(
      "Font",
      "fontName",
      window.RHE_FONT_OPTIONS || [],
      format.fontName
    )
  );
  overflowMenu.appendChild(
    helpers.makeSelect(
      "Size",
      "fontSize",
      window.RHE_SIZE_OPTIONS || [],
      format.fontSize
    )
  );
  overflowMenu.appendChild(
    helpers.makeColorInput("Text color", "foreColor", format.foreColor)
  );
  overflowMenu.appendChild(
    helpers.makeColorInput(
      "Highlight color",
      "hiliteColor",
      format.hiliteColor
    )
  );
  overflowMenu.appendChild(helpers.makeButton("Link", "Insert link", "link"));
  const overflowWrap = helpers.makeGroup();
  overflowWrap.className = "toolbar-group toolbar-overflow-wrap";
  overflowWrap.appendChild(overflowBtn);
  overflowWrap.appendChild(overflowMenu);
  toolbar.appendChild(overflowWrap);
}

// src/toolbar/buttons.ts
function makeButton(doc, options, label, title, command, value, isActive, disabled) {
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
function makeGroup(doc) {
  const g = doc.createElement("div");
  g.className = "toolbar-group";
  return g;
}
function makeSep(doc) {
  const s = doc.createElement("div");
  s.className = "toolbar-sep";
  return s;
}

// src/toolbar/selects.ts
function makeSelect(doc, options, title, command, optionsList, initialValue) {
  const select = doc.createElement("select");
  select.title = title;
  select.setAttribute("aria-label", title);
  select.appendChild(new Option(title, "", true, true));
  for (const opt of optionsList) {
    select.appendChild(new Option(opt.label, opt.value));
  }
  try {
    if (initialValue) select.value = initialValue;
  } catch (e) {
  }
  select.onchange = (e) => {
    const val = e.target.value;
    options.onCommand(command, val);
    select.selectedIndex = 0;
  };
  return select;
}

// src/toolbar/navigation.ts
function setupNavigation(toolbar) {
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
}

// src/toolbar/render.ts
function injectToolbar(doc, options) {
  const existing = doc.getElementById(TOOLBAR_ID);
  if (existing) existing.remove();
  const toolbar = doc.createElement("div");
  toolbar.id = TOOLBAR_ID;
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Rich text editor toolbar");
  const makeButton2 = (label, title, command, value, isActive, disabled) => makeButton(
    doc,
    { onCommand: options.onCommand },
    label,
    title,
    command,
    value,
    isActive,
    disabled
  );
  const makeSelect2 = (title, command, optionsList, initialValue) => makeSelect(
    doc,
    { onCommand: options.onCommand },
    title,
    command,
    optionsList,
    initialValue
  );
  const format = options.getFormatState();
  const makeGroup2 = () => makeGroup(doc);
  const makeSep2 = () => makeSep(doc);
  const undoBtn = makeButton2(
    LABEL_UNDO,
    "Undo",
    "undo",
    void 0,
    false,
    !options.canUndo()
  );
  undoBtn.onclick = () => options.onUndo();
  const redoBtn = makeButton2(
    LABEL_REDO,
    "Redo",
    "redo",
    void 0,
    false,
    !options.canRedo()
  );
  redoBtn.onclick = () => options.onRedo();
  const grp1 = makeGroup2();
  grp1.appendChild(undoBtn);
  grp1.appendChild(redoBtn);
  toolbar.appendChild(grp1);
  toolbar.appendChild(makeSep2());
  const grp2 = makeGroup2();
  grp2.className = "toolbar-group collapse-on-small";
  grp2.appendChild(
    makeSelect2(
      "Format",
      "formatBlock",
      FORMAT_OPTIONS,
      format.formatBlock
    )
  );
  grp2.appendChild(
    makeSelect2("Font", "fontName", FONT_OPTIONS, format.fontName)
  );
  grp2.appendChild(
    makeSelect2("Size", "fontSize", SIZE_OPTIONS, format.fontSize)
  );
  toolbar.appendChild(grp2);
  toolbar.appendChild(makeSep2());
  const grp3 = makeGroup2();
  grp3.appendChild(
    makeButton2(LABEL_BOLD, "Bold", "bold", void 0, format.bold)
  );
  grp3.appendChild(
    makeButton2(LABEL_ITALIC, "Italic", "italic", void 0, format.italic)
  );
  grp3.appendChild(
    makeButton2(
      LABEL_UNDERLINE,
      "Underline",
      "underline",
      void 0,
      format.underline
    )
  );
  grp3.appendChild(makeButton2(LABEL_STRIKETHROUGH, "Strikethrough", "strike"));
  grp3.appendChild(
    makeButton2(
      LABEL_UNORDERED_LIST,
      "Unordered list",
      "unorderedList",
      void 0,
      format.listType === "ul"
    )
  );
  grp3.appendChild(
    makeButton2(
      LABEL_ORDERED_LIST,
      "Ordered list",
      "orderedList",
      void 0,
      format.listType === "ol"
    )
  );
  toolbar.appendChild(grp3);
  toolbar.appendChild(makeSep2());
  const grp4 = makeGroup2();
  grp4.appendChild(makeButton2(LABEL_ALIGN_LEFT, "Align left", "align", "left"));
  grp4.appendChild(
    makeButton2(LABEL_ALIGN_CENTER, "Align center", "align", "center")
  );
  grp4.appendChild(
    makeButton2(LABEL_ALIGN_RIGHT, "Align right", "align", "right")
  );
  toolbar.appendChild(grp4);
  toolbar.appendChild(makeSep2());
  const grp5 = makeGroup2();
  grp5.className = "toolbar-group collapse-on-small";
  grp5.appendChild(
    makeColorInput(
      doc,
      options,
      "Text color",
      "foreColor",
      format.foreColor
    )
  );
  grp5.appendChild(
    makeColorInput(
      doc,
      options,
      "Highlight color",
      "hiliteColor",
      format.hiliteColor
    )
  );
  toolbar.appendChild(grp5);
  toolbar.appendChild(makeSep2());
  const grp6 = makeGroup2();
  grp6.className = "toolbar-group collapse-on-small";
  grp6.appendChild(makeButton2(LABEL_LINK, "Insert link", "link"));
  toolbar.appendChild(grp6);
  setupOverflow(doc, toolbar, options, format, {
    makeSelect: makeSelect2,
    makeColorInput: (title, command, initial) => makeColorInput(doc, options, title, command, initial),
    makeButton: makeButton2,
    makeGroup: makeGroup2
  });
  setupNavigation(toolbar);
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
  var _a, _b;
  try {
    const s = doc.getSelection();
    let el = null;
    if (s && s.anchorNode)
      el = s.anchorNode.nodeType === Node.ELEMENT_NODE ? s.anchorNode : s.anchorNode.parentElement;
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
        listType: null
      };
    const computed = (_a = doc.defaultView) == null ? void 0 : _a.getComputedStyle(el);
    const bold = !!(el.closest("strong, b") || computed && (computed.fontWeight === "700" || Number(computed.fontWeight) >= 700));
    const italic = !!(el.closest("em, i") || computed && computed.fontStyle === "italic");
    const underline = !!(el.closest("u") || computed && (computed.textDecorationLine || "").includes("underline"));
    const foreColor = ((_b = el.closest("font[color]")) == null ? void 0 : _b.getAttribute(
      "color"
    )) || computed && computed.color || null;
    const mark = el.closest("mark");
    const hiliteColor = mark && (mark.getAttribute("style") || "") || (computed && computed.backgroundColor && computed.backgroundColor !== "rgba(0, 0, 0, 0)" ? computed.backgroundColor : null);
    const fontName = computed && computed.fontFamily || null;
    const fontSize = computed && computed.fontSize || null;
    let blockEl = el;
    while (blockEl && blockEl.parentElement) {
      const tag = blockEl.tagName;
      if ([
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
      ].includes(tag)) {
        break;
      }
      blockEl = blockEl.parentElement;
    }
    const formatBlock = blockEl ? blockEl.tagName.toLowerCase() : null;
    let listType = null;
    try {
      if (blockEl && blockEl.tagName === "LI") {
        const list = blockEl.closest("ul,ol");
        if (list) listType = list.tagName.toLowerCase();
      } else {
        const possible = el.closest("ul,ol");
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
      listType
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
      listType: null
    };
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
    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(safe, "text/html");
      if (parsed && parsed.body && doc.body) {
        const parsedEls = parsed.body.querySelectorAll("[data-rhe-id]");
        if (parsedEls && parsedEls.length) {
          const loadPromises = [];
          parsedEls.forEach((pe) => {
            const id = pe.getAttribute("data-rhe-id");
            if (!id) return;
            const local = doc.body.querySelector(`[data-rhe-id="${id}"]`);
            if (!local) return;
            try {
              Array.from(local.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id") local.removeAttribute(a.name);
              });
              Array.from(pe.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id")
                  local.setAttribute(a.name, a.value);
              });
            } catch (err) {
            }
            try {
              local.innerHTML = pe.innerHTML;
            } catch (err) {
            }
            try {
              const placeholders = pe.querySelectorAll("[data-rhe-script]");
              placeholders.forEach((ph) => {
                const encoded = ph.getAttribute("data-rhe-script") || "";
                let code = "";
                try {
                  code = typeof atob !== "undefined" ? decodeURIComponent(escape(atob(encoded))) : decodeURIComponent(encoded);
                } catch (e) {
                  try {
                    code = decodeURIComponent(encoded);
                  } catch (er) {
                    code = "";
                  }
                }
                const attrsRaw = ph.getAttribute("data-rhe-script-attrs");
                let attrs = {};
                if (attrsRaw) {
                  try {
                    attrs = JSON.parse(decodeURIComponent(attrsRaw));
                  } catch (e) {
                    attrs = {};
                  }
                }
                const parentId = ph.getAttribute("data-rhe-script-parent");
                try {
                  const s = doc.createElement("script");
                  try {
                    s.type = "text/javascript";
                    s.async = false;
                  } catch (err) {
                  }
                  Object.keys(attrs).forEach(
                    (k) => s.setAttribute(k, attrs[k])
                  );
                  if (attrs.src) {
                    const p = new Promise((resolve) => {
                      s.addEventListener("load", () => resolve());
                      s.addEventListener("error", () => resolve());
                    });
                    loadPromises.push(p);
                    s.src = attrs.src;
                  } else {
                    s.textContent = code;
                  }
                  if (parentId === "head") {
                    doc.head.appendChild(s);
                  } else {
                    const target = doc.body.querySelector(
                      `[data-rhe-id="${parentId}"]`
                    );
                    if (target) target.appendChild(s);
                    else doc.body.appendChild(s);
                  }
                } catch (e) {
                }
              });
            } catch (e) {
            }
          });
          try {
            if (loadPromises.length) {
              const waiter = Promise.allSettled ? Promise.allSettled(loadPromises) : Promise.all(
                loadPromises.map((p) => p.catch(() => void 0))
              );
              waiter.then(() => {
                try {
                  doc.dispatchEvent(new Event("rhe:scripts-restored"));
                } catch (e) {
                }
              });
            } else {
              try {
                doc.dispatchEvent(new Event("rhe:scripts-restored"));
              } catch (e) {
              }
            }
          } catch (e) {
          }
        } else {
          doc.body.innerHTML = parsed.body.innerHTML;
        }
      } else {
        doc.documentElement.innerHTML = safe;
      }
    } catch (err) {
      doc.documentElement.innerHTML = safe;
    }
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
    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(safeNext, "text/html");
      if (parsed && parsed.body && doc.body) {
        const parsedEls = parsed.body.querySelectorAll("[data-rhe-id]");
        if (parsedEls && parsedEls.length) {
          const loadPromises = [];
          parsedEls.forEach((pe) => {
            const id = pe.getAttribute("data-rhe-id");
            if (!id) return;
            const local = doc.body.querySelector(`[data-rhe-id="${id}"]`);
            if (!local) return;
            try {
              Array.from(local.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id") local.removeAttribute(a.name);
              });
              Array.from(pe.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id")
                  local.setAttribute(a.name, a.value);
              });
            } catch (err) {
            }
            try {
              local.innerHTML = pe.innerHTML;
            } catch (err) {
            }
            try {
              const placeholders = pe.querySelectorAll("[data-rhe-script]");
              placeholders.forEach((ph) => {
                const encoded = ph.getAttribute("data-rhe-script") || "";
                let code = "";
                try {
                  code = typeof atob !== "undefined" ? decodeURIComponent(escape(atob(encoded))) : decodeURIComponent(encoded);
                } catch (e) {
                  try {
                    code = decodeURIComponent(encoded);
                  } catch (er) {
                    code = "";
                  }
                }
                const attrsRaw = ph.getAttribute("data-rhe-script-attrs");
                let attrs = {};
                if (attrsRaw) {
                  try {
                    attrs = JSON.parse(decodeURIComponent(attrsRaw));
                  } catch (e) {
                    attrs = {};
                  }
                }
                const parentId = ph.getAttribute("data-rhe-script-parent");
                try {
                  const s = doc.createElement("script");
                  try {
                    s.type = "text/javascript";
                    s.async = false;
                  } catch (err) {
                  }
                  Object.keys(attrs).forEach(
                    (k) => s.setAttribute(k, attrs[k])
                  );
                  if (attrs.src) {
                    const p = new Promise((resolve) => {
                      s.addEventListener("load", () => resolve());
                      s.addEventListener("error", () => resolve());
                    });
                    loadPromises.push(p);
                    s.src = attrs.src;
                  } else {
                    s.textContent = code;
                  }
                  if (parentId === "head") {
                    doc.head.appendChild(s);
                  } else {
                    const target = doc.body.querySelector(
                      `[data-rhe-id="${parentId}"]`
                    );
                    if (target) target.appendChild(s);
                    else doc.body.appendChild(s);
                  }
                } catch (e) {
                }
              });
            } catch (e) {
            }
          });
          try {
            if (loadPromises.length) {
              const waiter = Promise.allSettled ? Promise.allSettled(loadPromises) : Promise.all(
                loadPromises.map((p) => p.catch(() => void 0))
              );
              waiter.then(() => {
                try {
                  doc.dispatchEvent(new Event("rhe:scripts-restored"));
                } catch (e) {
                }
              });
            } else {
              try {
                doc.dispatchEvent(new Event("rhe:scripts-restored"));
              } catch (e) {
              }
            }
          } catch (e) {
          }
        } else {
          doc.body.innerHTML = parsed.body.innerHTML;
        }
      } else {
        doc.documentElement.innerHTML = safeNext;
      }
    } catch (err) {
      doc.documentElement.innerHTML = safeNext;
    }
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
function toggleList(doc, listTag) {
  var _a, _b;
  const sel = doc.getSelection();
  if (!sel || !sel.rangeCount) return;
  const node = sel.anchorNode || null;
  const block = findBlockAncestor(node);
  if (block && block.tagName === "LI" && block.parentElement) {
    const parentList = block.parentElement;
    const parentTag = parentList.tagName.toLowerCase();
    if (parentTag === listTag) {
      const frag = doc.createDocumentFragment();
      Array.from(parentList.children).forEach((li2) => {
        const p = doc.createElement("p");
        while (li2.firstChild) p.appendChild(li2.firstChild);
        frag.appendChild(p);
      });
      (_a = parentList.parentElement) == null ? void 0 : _a.replaceChild(frag, parentList);
      return;
    } else {
      const newList = doc.createElement(listTag);
      while (parentList.firstChild) newList.appendChild(parentList.firstChild);
      (_b = parentList.parentElement) == null ? void 0 : _b.replaceChild(newList, parentList);
      return;
    }
  }
  const range = sel.getRangeAt(0);
  if (range.collapsed) {
    const list2 = doc.createElement(listTag);
    const li2 = doc.createElement("li");
    const zw = doc.createTextNode("\u200B");
    li2.appendChild(zw);
    list2.appendChild(li2);
    range.insertNode(list2);
    const newRange2 = doc.createRange();
    newRange2.setStart(zw, 1);
    newRange2.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange2);
    return;
  }
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
  try {
    const selector = [
      "p",
      "div",
      "section",
      "article",
      "header",
      "footer",
      "aside",
      "nav",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "figure",
      "figcaption",
      "blockquote",
      "pre",
      "code"
    ].join(",");
    const candidates = Array.from(
      doc.querySelectorAll(selector)
    ).filter((el) => isEditableCandidate(el));
    candidates.forEach((target) => {
      if (!target.hasAttribute("data-rhe-id")) {
        const uid = `rhe-init-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        try {
          target.setAttribute("data-rhe-id", uid);
        } catch (err) {
        }
      }
    });
  } catch (err) {
  }
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
      if (!target.hasAttribute("data-rhe-id")) {
        const uid = `rhe-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        try {
          target.setAttribute("data-rhe-id", uid);
        } catch (err) {
        }
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
  doc.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Enter") return;
      if (e.shiftKey) return;
      const sel = doc.getSelection();
      if (!sel || !sel.rangeCount) return;
      const node = sel.anchorNode;
      const el = node && node.nodeType === Node.ELEMENT_NODE ? node : node && node.parentElement || null;
      if (!el) return;
      const li = el.closest("li");
      if (!li || !li.parentElement) return;
      e.preventDefault();
      const list = li.parentElement;
      const newLi = doc.createElement("li");
      const zw = doc.createTextNode("\u200B");
      newLi.appendChild(zw);
      if (li.nextSibling) list.insertBefore(newLi, li.nextSibling);
      else list.appendChild(newLi);
      const range = doc.createRange();
      range.setStart(zw, 1);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    },
    true
  );
}

// src/core/editor.ts
init_constants();
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
    const clone = doc.documentElement.cloneNode(true);
    const toolbarNode = clone.querySelector(`#${TOOLBAR_ID}`);
    if (toolbarNode && toolbarNode.parentNode)
      toolbarNode.parentNode.removeChild(toolbarNode);
    const styleNode = clone.querySelector(`#${STYLE_ID}`);
    if (styleNode && styleNode.parentNode)
      styleNode.parentNode.removeChild(styleNode);
    try {
      const cleanElement = (el) => {
        try {
          if (el.hasAttribute("contenteditable"))
            el.removeAttribute("contenteditable");
          if (el.hasAttribute("tabindex")) el.removeAttribute("tabindex");
        } catch (e) {
        }
        try {
          const attrs = Array.from(el.attributes || []);
          attrs.forEach((a) => {
            const rawName = a.name;
            const name = rawName.toLowerCase();
            if (name.startsWith("on")) {
              try {
                el.removeAttribute(rawName);
              } catch (e) {
              }
              return;
            }
            if (name === "data-rhe-id" || name.startsWith("data-rhe-") || name === "data-rhe") {
              try {
                el.removeAttribute(rawName);
              } catch (e) {
              }
              return;
            }
          });
        } catch (e) {
        }
        try {
          if (el.id) {
            const id = el.id;
            if (id === TOOLBAR_ID || id === STYLE_ID || id.startsWith("editor-") || id.startsWith("rhe-")) {
              el.removeAttribute("id");
            }
          }
        } catch (e) {
        }
        try {
          const cls = Array.from(el.classList || []);
          cls.forEach((c) => {
            if (c === CLASS_EDITABLE || c === CLASS_ACTIVE || c.startsWith("editor-") || c.startsWith("rhe-")) {
              try {
                el.classList.remove(c);
              } catch (e) {
              }
            }
          });
          if (el.hasAttribute("class") && (el.getAttribute("class") || "").trim() === "") {
            try {
              el.removeAttribute("class");
            } catch (e) {
            }
          }
        } catch (e) {
        }
        try {
          const children = Array.from(el.children || []);
          children.forEach((child) => cleanElement(child));
        } catch (e) {
        }
      };
      if (clone.nodeType === Node.ELEMENT_NODE) {
        cleanElement(clone);
      }
    } catch (e) {
    }
    return "<!doctype html>\n" + clone.outerHTML;
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