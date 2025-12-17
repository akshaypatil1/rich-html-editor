import {
  _setDoc,
  _getDoc,
  _setUndoStack,
  _getUndoStack,
  _setRedoStack,
  _getRedoStack,
  _setCurrentEditable,
  _getCurrentEditable,
  pushStandaloneSnapshot,
} from "./state";
import { injectStyles } from "../dom/styles";
import { injectToolbar } from "../toolbar/toolbar";
import { attachStandaloneHandlers } from "../dom/handlers";
import { computeFormatState, getElementLabel } from "../dom/format";
import { handleUndo, handleRedo, handleToolbarCommand } from "./commands";
import type { EditorConfig } from "./types";
import { sanitizeHtml } from "../utils/sanitize";
import {
  TOOLBAR_ID,
  STYLE_ID,
  CLASS_EDITABLE,
  CLASS_ACTIVE,
} from "./constants";

/**
 * Initialize the rich HTML editor on an iframe element
 *
 * Sets up:
 * - State management (undo/redo stacks, current editable element)
 * - DOM styles for editable element highlighting
 * - Event handlers for click, selection change, and input events
 * - Toolbar UI with formatting buttons
 *
 * @param iframe - The target iframe element to enable editing on
 * @throws {Error} If iframe is invalid or contentDocument is not accessible
 *
 * @example
 * ```typescript
 * const iframe = document.querySelector('iframe');
 * initRichEditor(iframe);
 * ```
 */
export function initRichEditor(
  iframe: HTMLIFrameElement,
  config?: EditorConfig
) {
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
    if (config?.maxStackSize) {
      // lazy set max stack size if provided (non-blocking)
      import("./state")
        .then((m) => m.setMaxStackSize(config.maxStackSize!))
        .catch(() => {
          /* ignore */
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
      getSelectedElementInfo: () => getElementLabel(_getCurrentEditable()),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to initialize editor:", message);
    throw error;
  }
}

/**
 * Get the cleaned HTML content from the edited document
 *
 * Returns the full HTML document with proper DOCTYPE declaration
 *
 * @returns HTML string with DOCTYPE, or empty string if editor not initialized
 * @throws {Error} If document is not properly initialized
 *
 * @example
 * ```typescript
 * const html = getCleanHTML();
 * console.log(html); // <!doctype html>\n<html>...</html>
 * ```
 */
export function getCleanHTML(): string {
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
    // Clone the document element and strip injected UI and editing attributes
    const clone = doc.documentElement.cloneNode(true) as HTMLElement;

    // Remove injected toolbar and style elements if present
    const toolbarNode = clone.querySelector(`#${TOOLBAR_ID}`);
    if (toolbarNode && toolbarNode.parentNode)
      toolbarNode.parentNode.removeChild(toolbarNode);
    const styleNode = clone.querySelector(`#${STYLE_ID}`);
    if (styleNode && styleNode.parentNode)
      styleNode.parentNode.removeChild(styleNode);

    // Remove editor-specific attributes/classes from cloned nodes so the
    // resulting HTML is static (no contenteditable, no active/editable classes)
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
        // ignore any removal errors on read-only or unexpected nodes
      }
    });

    return "<!doctype html>\n" + clone.outerHTML;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to get clean HTML:", message);
    throw error;
  }
}

/**
 * Get a sanitized HTML string suitable for exporting to untrusted contexts.
 * This will run the same sanitizer used for snapshots/restores.
 */
export function getSanitizedHTML(): string {
  try {
    const doc = _getDoc();
    if (!doc) return "";
    if (!doc.documentElement)
      throw new Error("Document is missing documentElement");
    const raw = "<!doctype html>\n" + doc.documentElement.outerHTML;
    return sanitizeHtml(raw, doc);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to get sanitized HTML:", message);
    throw error;
  }
}
