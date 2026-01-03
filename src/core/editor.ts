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
 */
export function initRichEditor(
  iframe: HTMLIFrameElement,
  config?: EditorConfig,
) {
  try {
    if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
      throw new Error("Invalid iframe element provided to initRichEditor");
    }

    const doc = iframe.contentDocument;
    if (!doc) {
      throw new Error(
        "Unable to access iframe contentDocument. Ensure iframe src is same-origin.",
      );
    }

    _setDoc(doc);
    injectStyles(doc);
    _setUndoStack([]);
    _setRedoStack([]);
    _setCurrentEditable(null);
    if (config?.maxStackSize) {
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

export function getCleanHTML(): string {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] getCleanHTML called before editor initialization",
      );
      return "";
    }
    if (!doc.documentElement) {
      throw new Error("Document is missing documentElement");
    }

    const clone = doc.documentElement.cloneNode(true) as HTMLElement;

    // Remove injected toolbar and style elements if present
    const toolbarNode = clone.querySelector(`#${TOOLBAR_ID}`);
    if (toolbarNode && toolbarNode.parentNode)
      toolbarNode.parentNode.removeChild(toolbarNode);
    const styleNode = clone.querySelector(`#${STYLE_ID}`);
    if (styleNode && styleNode.parentNode)
      styleNode.parentNode.removeChild(styleNode);

    // Recursively clean root and descendants
    try {
      const cleanElement = (el: Element) => {
        try {
          // remove boolean/content attributes explicitly
          if (el.hasAttribute("contenteditable"))
            el.removeAttribute("contenteditable");
          if (el.hasAttribute("tabindex")) el.removeAttribute("tabindex");
        } catch (e) {
          /* ignore */
        }

        try {
          const attrs = Array.from(el.attributes || []);
          attrs.forEach((a) => {
            const rawName = a.name;
            const name = rawName.toLowerCase();

            // remove inline event handlers
            if (name.startsWith("on")) {
              try {
                el.removeAttribute(rawName);
              } catch (e) {
                /* ignore */
              }
              return;
            }

            // remove any data-rhe-* attributes (including data-rhe-id)
            if (
              name === "data-rhe-id" ||
              name.startsWith("data-rhe-") ||
              name === "data-rhe"
            ) {
              try {
                el.removeAttribute(rawName);
              } catch (e) {
                /* ignore */
              }
              return;
            }
          });
        } catch (e) {
          /* ignore */
        }

        try {
          if (el.id) {
            const id = el.id;
            if (
              id === TOOLBAR_ID ||
              id === STYLE_ID ||
              id.startsWith("editor-") ||
              id.startsWith("rhe-")
            ) {
              el.removeAttribute("id");
            }
          }
        } catch (e) {
          /* ignore */
        }

        try {
          const cls = Array.from(el.classList || []);
          cls.forEach((c) => {
            if (
              c === CLASS_EDITABLE ||
              c === CLASS_ACTIVE ||
              c.startsWith("editor-") ||
              c.startsWith("rhe-")
            ) {
              try {
                el.classList.remove(c);
              } catch (e) {
                /* ignore */
              }
            }
          });

          // remove empty class attributes left behind
          if (
            el.hasAttribute("class") &&
            (el.getAttribute("class") || "").trim() === ""
          ) {
            try {
              el.removeAttribute("class");
            } catch (e) {
              /* ignore */
            }
          }
        } catch (e) {
          /* ignore */
        }

        try {
          const children = Array.from(el.children || []);
          children.forEach((child) => cleanElement(child as Element));
        } catch (e) {
          /* ignore */
        }
      };

      // `instanceof Element` can fail across window/iframe boundaries
      // because each iframe has its own global `Element` constructor.
      // Use a cross-realm-safe check instead.
      if ((clone as Node).nodeType === Node.ELEMENT_NODE) {
        cleanElement(clone as Element);
      }
    } catch (e) {
      /* ignore traversal errors */
    }

    // Preserve original scripts intentionally.
    return "<!doctype html>\n" + clone.outerHTML;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Failed to get clean HTML:", message);
    throw error;
  }
}

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
