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

// src/core/state.ts
var _doc = null;
var _undoStack = [];
var _redoStack = [];
var _currentEditable = null;
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
  sanitizeHtml,
  _setDoc,
  _getDoc,
  _setUndoStack,
  _getUndoStack,
  _setRedoStack,
  _getRedoStack,
  _setCurrentEditable,
  _getCurrentEditable,
  pushStandaloneSnapshot,
  setMaxStackSize
};
//# sourceMappingURL=chunk-NW6WSZFA.mjs.map