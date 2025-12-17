import { editorEventEmitter } from "./events";
import { DEFAULT_MAX_STACK, TOOLBAR_ID, STYLE_ID } from "./constants";
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
