// src/core/events.ts
var EditorEventEmitter = class {
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
var editorEventEmitter = new EditorEventEmitter();
function getEditorEventEmitter() {
  return editorEventEmitter;
}

// src/core/constants.ts
var TOOLBAR_ID = "editor-toolbar";
var STYLE_ID = "editor-styles";
var CLASS_EDITABLE = "editor-editable-element";
var CLASS_ACTIVE = "editor-active-element";
var DEFAULT_MAX_STACK = 60;
var TOOLBAR_BG = "#f8fafc";
var TOOLBAR_BORDER = "#e5e7eb";
var BUTTON_BORDER = "#d1d5db";
var BUTTON_ACTIVE_BG = "#e0e7ff";
var BUTTON_BG = "#fff";
var BUTTON_COLOR = "#222";
var INFO_COLOR = "#888";
var HOVER_OUTLINE = "#2563eb";
var ACTIVE_OUTLINE = "#16a34a";
var LABEL_BOLD = "<b>B</b>";
var LABEL_ITALIC = "<i>I</i>";
var LABEL_UNDERLINE = "<u>U</u>";
var LABEL_STRIKETHROUGH = "<s>S</s>";
var LABEL_UNDO = "\u21BA";
var LABEL_REDO = "\u21BB";
var LABEL_LINK = "\u{1F517}";
var LABEL_UNORDERED_LIST = `
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="3" cy="4" r="1" fill="currentColor" />
    <rect x="6" y="3" width="9" height="2" rx="0.5" fill="currentColor" />
    <circle cx="3" cy="8" r="1" fill="currentColor" />
    <rect x="6" y="7" width="9" height="2" rx="0.5" fill="currentColor" />
    <circle cx="3" cy="12" r="1" fill="currentColor" />
    <rect x="6" y="11" width="9" height="2" rx="0.5" fill="currentColor" />
  </svg>
`;
var LABEL_ORDERED_LIST = `
  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <text x="1" y="4" font-size="4" fill="currentColor">1.</text>
    <rect x="6" y="3" width="9" height="2" rx="0.5" fill="currentColor" />
    <text x="1" y="8" font-size="4" fill="currentColor">2.</text>
    <rect x="6" y="7" width="9" height="2" rx="0.5" fill="currentColor" />
    <text x="1" y="12" font-size="4" fill="currentColor">3.</text>
    <rect x="6" y="11" width="9" height="2" rx="0.5" fill="currentColor" />
  </svg>
`;
var LABEL_ALIGN_LEFT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="1" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
var LABEL_ALIGN_CENTER = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="3" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="3" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
var LABEL_ALIGN_RIGHT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="5" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="5" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
var FONT_OPTIONS = [
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
var SIZE_OPTIONS = [
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
var FORMAT_OPTIONS = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" }
];
var LABEL_CLEAR_FORMAT = "\u{1F9F9} Clear";
var MAX_FILE_SIZE = 1024 * 1024;

// src/utils/sanitize.ts
import createDOMPurify from "dompurify";
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
      const DOMPurify = createDOMPurify(win);
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

// src/core/state.ts
var _doc = null;
var _undoStack = [];
var _redoStack = [];
var _currentEditable = null;
var _savedRange = null;
var _maxStackSize = DEFAULT_MAX_STACK;
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
function _saveSelection() {
  try {
    if (!_doc) return;
    const sel = _doc.getSelection();
    if (!sel) return;
    if (!sel.rangeCount) return;
    _savedRange = sel.getRangeAt(0).cloneRange();
  } catch (e) {
  }
}
function _restoreSelection() {
  try {
    if (!_doc) return;
    const sel = _doc.getSelection();
    if (!sel) return;
    if (_savedRange) {
      sel.removeAllRanges();
      sel.addRange(_savedRange);
      _savedRange = null;
    }
  } catch (e) {
  }
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

export {
  editorEventEmitter,
  getEditorEventEmitter,
  TOOLBAR_ID,
  STYLE_ID,
  CLASS_EDITABLE,
  CLASS_ACTIVE,
  TOOLBAR_BG,
  TOOLBAR_BORDER,
  BUTTON_BORDER,
  BUTTON_ACTIVE_BG,
  BUTTON_BG,
  BUTTON_COLOR,
  INFO_COLOR,
  HOVER_OUTLINE,
  ACTIVE_OUTLINE,
  LABEL_BOLD,
  LABEL_ITALIC,
  LABEL_UNDERLINE,
  LABEL_STRIKETHROUGH,
  LABEL_UNDO,
  LABEL_REDO,
  LABEL_LINK,
  LABEL_UNORDERED_LIST,
  LABEL_ORDERED_LIST,
  LABEL_ALIGN_LEFT,
  LABEL_ALIGN_CENTER,
  LABEL_ALIGN_RIGHT,
  FONT_OPTIONS,
  SIZE_OPTIONS,
  FORMAT_OPTIONS,
  LABEL_CLEAR_FORMAT,
  MAX_FILE_SIZE,
  sanitizeHtml,
  _setDoc,
  _getDoc,
  _setUndoStack,
  _getUndoStack,
  _setRedoStack,
  _getRedoStack,
  _setCurrentEditable,
  _getCurrentEditable,
  _saveSelection,
  _restoreSelection,
  pushStandaloneSnapshot,
  setMaxStackSize
};
//# sourceMappingURL=chunk-RTJONDEC.mjs.map