import {
  _getCurrentEditable,
  _setCurrentEditable,
  pushStandaloneSnapshot,
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
  // Assign stable data-rhe-id markers to likely editable candidates so
  // snapshots include identifiers for selective restoration. Limit the
  // selector to common content containers to avoid a full DOM walk.
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
      "code",
    ].join(",");
    const candidates = Array.from(
      doc.querySelectorAll<HTMLElement>(selector)
    ).filter((el) => isEditableCandidate(el));
    candidates.forEach((target) => {
      if (!target.hasAttribute("data-rhe-id")) {
        const uid = `rhe-init-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`;
        try {
          target.setAttribute("data-rhe-id", uid);
        } catch (err) {
          /* ignore */
        }
      }
    });
  } catch (err) {
    /* ignore initialization errors */
  }

  doc.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement;
      if (!isEditableCandidate(target)) return;
      if (_getCurrentEditable() && _getCurrentEditable() !== target) {
        _getCurrentEditable()?.removeAttribute("contenteditable");
        _getCurrentEditable()?.classList.remove(CLASS_ACTIVE);
      }
      // Ensure the editable element has a stable identifier so snapshots
      // can restore only the editable region without touching the rest
      // of the page (header, nav, scripts, etc.). Use a data attribute
      // to avoid clashing with page ids.
      if (!target.hasAttribute("data-rhe-id")) {
        const uid = `rhe-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`;
        try {
          target.setAttribute("data-rhe-id", uid);
        } catch (err) {
          /* ignore attribute set errors */
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
