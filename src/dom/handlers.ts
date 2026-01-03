import {
  _getCurrentEditable,
  _setCurrentEditable,
  pushStandaloneSnapshot,
  _getUndoStack,
  _getRedoStack,
} from "../core/state";
import { isEditableCandidate } from "./candidates";
import { openImageEditor } from "./imageEditor";
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
      doc.querySelectorAll<HTMLElement>(selector),
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
      // If an image was clicked, open the image editor modal
      if (target && target.tagName === "IMG") {
        try {
          openImageEditor(doc, target as HTMLImageElement);
        } catch (err) {
          /* ignore */
        }
        e.preventDefault();
        e.stopPropagation();
        return;
      }
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
    true,
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
    true,
  );

  // Ensure Enter in lists creates a new list item (consistent across browsers)
  doc.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Enter") return;
      // Let Shift+Enter behave as a soft-break
      if (e.shiftKey) return;
      const sel = doc.getSelection();
      if (!sel || !sel.rangeCount) return;
      const node = sel.anchorNode;
      const el =
        node && node.nodeType === Node.ELEMENT_NODE
          ? (node as HTMLElement)
          : (node && (node as Node).parentElement) || null;
      if (!el) return;
      const li = el.closest("li") as HTMLElement | null;
      if (!li || !li.parentElement) return;
      // Prevent default behavior and insert a new empty <li>
      e.preventDefault();
      const list = li.parentElement;
      const newLi = doc.createElement("li");
      const zw = doc.createTextNode("\u200B");
      newLi.appendChild(zw);
      if (li.nextSibling) list.insertBefore(newLi, li.nextSibling);
      else list.appendChild(newLi);
      // place caret inside the new li
      const range = doc.createRange();
      range.setStart(zw, 1);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      // push snapshot will be triggered by input event after typing
    },
    true,
  );
}
