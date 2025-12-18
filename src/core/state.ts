import { editorEventEmitter } from "./events";
import {
  DEFAULT_MAX_STACK,
  TOOLBAR_ID,
  STYLE_ID,
  CLASS_EDITABLE,
  CLASS_ACTIVE,
} from "./constants";
import { sanitizeHtml } from "../utils/sanitize";

let _doc: Document | null = null;
let _undoStack: string[] = [];
let _redoStack: string[] = [];
let _currentEditable: HTMLElement | null = null;
let _maxStackSize = DEFAULT_MAX_STACK;

export function _setDoc(doc: Document | null) {
  _doc = doc;
}
export function _getDoc() {
  return _doc;
}
export function _setUndoStack(stack: string[]) {
  _undoStack = stack;
  editorEventEmitter.emit({
    type: "undoStateChanged",
    timestamp: Date.now(),
    data: { canUndo: _undoStack.length > 1 },
  });
}
export function _getUndoStack() {
  return _undoStack;
}
export function _setRedoStack(stack: string[]) {
  _redoStack = stack;
  editorEventEmitter.emit({
    type: "redoStateChanged",
    timestamp: Date.now(),
    data: { canRedo: _redoStack.length > 0 },
  });
}
export function _getRedoStack() {
  return _redoStack;
}
export function _setCurrentEditable(el: HTMLElement | null) {
  _currentEditable = el;
  editorEventEmitter.emit({
    type: "selectionChanged",
    timestamp: Date.now(),
    data: { element: el?.tagName },
  });
}
export function _getCurrentEditable() {
  return _currentEditable;
}
export function pushStandaloneSnapshot(clearRedo = true) {
  if (!_doc) return;
  // Clone the documentElement and remove injected UI (toolbar/style)
  // so snapshots capture only the user's content.
  const clone = _doc.documentElement.cloneNode(true) as HTMLElement;
  const toolbarNode = clone.querySelector(`#${TOOLBAR_ID}`);
  if (toolbarNode && toolbarNode.parentNode)
    toolbarNode.parentNode.removeChild(toolbarNode);
  const styleNode = clone.querySelector(`#${STYLE_ID}`);
  if (styleNode && styleNode.parentNode)
    styleNode.parentNode.removeChild(styleNode);
  // Remove editor-specific attributes/classes so snapshots don't persist
  // transient editing state (contenteditable, toolbar classes, tabindex).
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
        /* ignore */
      }
    });
  } catch (e) {
    /* ignore */
  }
  // Preserve scripts by replacing them with a harmless placeholder
  // that contains the encoded script source/attributes. This allows the
  // sanitizer to run (which strips <script> tags) while keeping the
  // script content available to re-insert and execute on restore.
  try {
    const scripts = Array.from(
      clone.querySelectorAll<HTMLScriptElement>("script")
    );
    scripts.forEach((s) => {
      try {
        const code = s.textContent || "";
        const attrs: Record<string, string> = {};
        Array.from(s.attributes).forEach((a) => (attrs[a.name] = a.value));
        const placeholder = clone.ownerDocument!.createElement("span");
        // encode script body in base64 to survive sanitization
        try {
          // btoa may throw on Unicode; encodeURIComponent first
          const safe =
            typeof btoa !== "undefined"
              ? btoa(unescape(encodeURIComponent(code)))
              : encodeURIComponent(code);
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
        // mark parent editable region if present so we can reinsert in-place
        const parentMarker = s.closest("[data-rhe-id]") as HTMLElement | null;
        if (parentMarker && parentMarker.getAttribute("data-rhe-id")) {
          placeholder.setAttribute(
            "data-rhe-script-parent",
            parentMarker.getAttribute("data-rhe-id")!
          );
        } else {
          placeholder.setAttribute("data-rhe-script-parent", "head");
        }
        s.parentNode?.replaceChild(placeholder, s);
      } catch (e) {
        /* ignore per-script errors */
      }
    });
  } catch (e) {
    /* ignore script extraction errors */
  }
  const snapRaw = clone.outerHTML;
  const snap = sanitizeHtml(snapRaw, _doc);
  if (!_undoStack.length || _undoStack[_undoStack.length - 1] !== snap) {
    _undoStack.push(snap);
    if (_undoStack.length > _maxStackSize) _undoStack.shift();
    editorEventEmitter.emit({
      type: "contentChanged",
      timestamp: Date.now(),
      data: { htmlLength: snap.length },
    });
  }
  if (clearRedo) {
    _redoStack = [];
    editorEventEmitter.emit({
      type: "redoStateChanged",
      timestamp: Date.now(),
      data: { canRedo: false },
    });
  }
}
export function setMaxStackSize(size: number) {
  _maxStackSize = Math.max(1, size);
}
