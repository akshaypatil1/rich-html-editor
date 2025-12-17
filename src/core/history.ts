import {
  _getDoc,
  _getUndoStack,
  _getRedoStack,
  _setUndoStack,
  _setRedoStack,
} from "./state";
import { sanitizeHtml } from "../utils/sanitize";

export function handleUndo() {
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
    const current = undoStack.pop()!;
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

export function handleRedo() {
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
    const next = redoStack.pop()!;
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
