import {
  _getCurrentEditable,
  _setCurrentEditable,
  pushStandaloneSnapshot,
  _getDoc,
  _getUndoStack,
  _getRedoStack,
} from "../core/state";
import { isEditableCandidate } from "./candidates";
import { injectToolbar } from "../toolbar/toolbar";
import { computeFormatState, getElementLabel } from "./format";
import { handleToolbarCommand, handleUndo, handleRedo } from "../core/commands";
import { CLASS_ACTIVE } from "../core/constants";

/**
 * Attach DOM event handlers to the document
 *
 * Handles:
 * - Click: Enables editing on valid elements
 * - Selection change: Updates toolbar state
 * - Input: Creates undo/redo snapshots
 *
 * @param doc - Document to attach handlers to
 */
export function attachStandaloneHandlers(doc: Document) {
  doc.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement;
      if (!isEditableCandidate(target)) return;
      if (_getCurrentEditable() && _getCurrentEditable() !== target) {
        _getCurrentEditable()?.removeAttribute("contenteditable");
        _getCurrentEditable()?.classList.remove(CLASS_ACTIVE);
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
      getSelectedElementInfo: () => getElementLabel(_getCurrentEditable()),
    });
  });
  doc.addEventListener("input", () => pushStandaloneSnapshot(), true);

  // Keyboard shortcuts for common formatting and undo/redo
  doc.addEventListener(
    "keydown",
    (e) => {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      // Bold: Ctrl/Cmd+B
      if (key === "b") {
        e.preventDefault();
        handleToolbarCommand("bold");
        return;
      }
      // Italic: Ctrl/Cmd+I
      if (key === "i") {
        e.preventDefault();
        handleToolbarCommand("italic");
        return;
      }
      // Underline: Ctrl/Cmd+U
      if (key === "u") {
        e.preventDefault();
        handleToolbarCommand("underline");
        return;
      }
      // Undo: Ctrl/Cmd+Z
      if (key === "z") {
        e.preventDefault();
        // If Shift is pressed, treat as redo
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      // Redo: Ctrl/Cmd+Y
      if (key === "y") {
        e.preventDefault();
        handleRedo();
        return;
      }
    },
    true
  );
}
