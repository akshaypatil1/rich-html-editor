import {
  _getDoc,
  _getUndoStack,
  _getRedoStack,
  _setUndoStack,
  _setRedoStack,
} from "./state";

import { sanitizeHtml } from "../utils/sanitize";
import { injectStyles } from "../dom/styles";

export function handleUndo() {
  try {
    const doc = _getDoc();
    if (!doc) {
      console.warn(
        "[rich-html-editor] handleUndo called before initialization",
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
    // Sanitize the snapshot and extract only the body content so we
    // avoid overwriting head/link/style nodes that may contain page
    // or editor styles. Replacing only `document.body` preserves those
    // nodes while still restoring user content.
    const safe = sanitizeHtml(prev.replace(/^<!doctype html>\n?/i, ""), doc);
    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(safe, "text/html");
      if (parsed && parsed.body && doc.body) {
        // Prefer selective restoration: if the snapshot contains elements
        // marked with `data-rhe-id`, restore only those elements so we do
        // not clobber page-level UI (headers, tabs, carousel scripts).
        const parsedEls = parsed.body.querySelectorAll("[data-rhe-id]");
        if (parsedEls && parsedEls.length) {
          const loadPromises: Promise<void>[] = [];
          parsedEls.forEach((pe) => {
            const id = pe.getAttribute("data-rhe-id");
            if (!id) return;
            const local = doc.body.querySelector(`[data-rhe-id="${id}"]`);
            if (!local) return;
            // Copy non-identifying attributes from parsed element to local
            try {
              Array.from(local.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id") local.removeAttribute(a.name);
              });
              Array.from(pe.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id")
                  local.setAttribute(a.name, a.value);
              });
            } catch (err) {
              /* ignore attribute copy errors */
            }
            // Replace innerHTML of the editable region only
            try {
              local.innerHTML = pe.innerHTML;
            } catch (err) {
              /* ignore innerHTML set errors */
            }
            // Recreate preserved script placeholders inside the parsed element
            try {
              const placeholders = pe.querySelectorAll("[data-rhe-script]");
              placeholders.forEach((ph) => {
                const encoded = ph.getAttribute("data-rhe-script") || "";
                let code = "";
                try {
                  code =
                    typeof atob !== "undefined"
                      ? decodeURIComponent(escape(atob(encoded)))
                      : decodeURIComponent(encoded);
                } catch (e) {
                  try {
                    code = decodeURIComponent(encoded);
                  } catch (er) {
                    code = "";
                  }
                }
                const attrsRaw = ph.getAttribute("data-rhe-script-attrs");
                let attrs: Record<string, string> = {};
                if (attrsRaw) {
                  try {
                    attrs = JSON.parse(decodeURIComponent(attrsRaw));
                  } catch (e) {
                    attrs = {};
                  }
                }
                const parentId = ph.getAttribute("data-rhe-script-parent");
                try {
                  const s = doc.createElement("script");
                  try {
                    s.type = "text/javascript";
                    (s as any).async = false;
                  } catch (err) {
                    /* ignore */
                  }
                  Object.keys(attrs).forEach((k) =>
                    s.setAttribute(k, attrs[k]),
                  );
                  if (attrs.src) {
                    const p = new Promise<void>((resolve) => {
                      s.addEventListener("load", () => resolve());
                      s.addEventListener("error", () => resolve());
                    });
                    loadPromises.push(p);
                    s.src = attrs.src;
                  } else {
                    s.textContent = code;
                  }
                  if (parentId === "head") {
                    doc.head.appendChild(s);
                  } else {
                    const target = doc.body.querySelector(
                      `[data-rhe-id="${parentId}"]`,
                    );
                    if (target) target.appendChild(s);
                    else doc.body.appendChild(s);
                  }
                } catch (e) {
                  /* ignore script injection errors */
                }
              });
            } catch (e) {
              /* ignore placeholder processing errors */
            }
          });
          try {
            if (loadPromises.length) {
              const waiter = (Promise as any).allSettled
                ? (Promise as any).allSettled(loadPromises)
                : Promise.all(
                    loadPromises.map((p) => p.catch(() => undefined)),
                  );
              waiter.then(() => {
                try {
                  doc.dispatchEvent(new Event("rhe:scripts-restored"));
                } catch (e) {
                  /* ignore */
                }
              });
            } else {
              try {
                doc.dispatchEvent(new Event("rhe:scripts-restored"));
              } catch (e) {
                /* ignore */
              }
            }
          } catch (e) {
            /* ignore */
          }
        } else {
          // No markers present — fallback to previous behavior of replacing
          // the body contents. This preserves backward compatibility.
          doc.body.innerHTML = parsed.body.innerHTML;
        }
      } else {
        // Fallback to replacing the whole documentElement if body is missing
        doc.documentElement.innerHTML = safe;
      }
    } catch (err) {
      // On any parse error, fall back to previous behavior
      doc.documentElement.innerHTML = safe;
    }

    // Re-inject editor styles (toolbar/style) and notify listeners so the
    // toolbar is restored and selectionchange handlers run.
    injectStyles(doc);
    try {
      doc.dispatchEvent(new Event("selectionchange"));
    } catch (err) {
      /* ignore dispatch errors */
    }
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
        "[rich-html-editor] handleRedo called before initialization",
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
      doc,
    );
    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(safeNext, "text/html");
      if (parsed && parsed.body && doc.body) {
        const parsedEls = parsed.body.querySelectorAll("[data-rhe-id]");
        if (parsedEls && parsedEls.length) {
          const loadPromises: Promise<void>[] = [];
          parsedEls.forEach((pe) => {
            const id = pe.getAttribute("data-rhe-id");
            if (!id) return;
            const local = doc.body.querySelector(`[data-rhe-id="${id}"]`);
            if (!local) return;
            try {
              Array.from(local.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id") local.removeAttribute(a.name);
              });
              Array.from(pe.attributes).forEach((a) => {
                if (a.name !== "data-rhe-id")
                  local.setAttribute(a.name, a.value);
              });
            } catch (err) {
              /* ignore */
            }
            try {
              local.innerHTML = pe.innerHTML;
            } catch (err) {
              /* ignore */
            }
            try {
              const placeholders = pe.querySelectorAll("[data-rhe-script]");
              placeholders.forEach((ph) => {
                const encoded = ph.getAttribute("data-rhe-script") || "";
                let code = "";
                try {
                  code =
                    typeof atob !== "undefined"
                      ? decodeURIComponent(escape(atob(encoded)))
                      : decodeURIComponent(encoded);
                } catch (e) {
                  try {
                    code = decodeURIComponent(encoded);
                  } catch (er) {
                    code = "";
                  }
                }
                const attrsRaw = ph.getAttribute("data-rhe-script-attrs");
                let attrs: Record<string, string> = {};
                if (attrsRaw) {
                  try {
                    attrs = JSON.parse(decodeURIComponent(attrsRaw));
                  } catch (e) {
                    attrs = {};
                  }
                }
                const parentId = ph.getAttribute("data-rhe-script-parent");
                try {
                  const s = doc.createElement("script");
                  try {
                    s.type = "text/javascript";
                    (s as any).async = false;
                  } catch (err) {
                    /* ignore */
                  }
                  Object.keys(attrs).forEach((k) =>
                    s.setAttribute(k, attrs[k]),
                  );
                  if (attrs.src) {
                    const p = new Promise<void>((resolve) => {
                      s.addEventListener("load", () => resolve());
                      s.addEventListener("error", () => resolve());
                    });
                    loadPromises.push(p);
                    s.src = attrs.src;
                  } else {
                    s.textContent = code;
                  }
                  if (parentId === "head") {
                    doc.head.appendChild(s);
                  } else {
                    const target = doc.body.querySelector(
                      `[data-rhe-id="${parentId}"]`,
                    );
                    if (target) target.appendChild(s);
                    else doc.body.appendChild(s);
                  }
                } catch (e) {
                  /* ignore script injection errors */
                }
              });
            } catch (e) {
              /* ignore placeholder processing errors */
            }
          });
          try {
            if (loadPromises.length) {
              const waiter = (Promise as any).allSettled
                ? (Promise as any).allSettled(loadPromises)
                : Promise.all(
                    loadPromises.map((p) => p.catch(() => undefined)),
                  );
              waiter.then(() => {
                try {
                  doc.dispatchEvent(new Event("rhe:scripts-restored"));
                } catch (e) {
                  /* ignore */
                }
              });
            } else {
              try {
                doc.dispatchEvent(new Event("rhe:scripts-restored"));
              } catch (e) {
                /* ignore */
              }
            }
          } catch (e) {
            /* ignore */
          }
        } else {
          doc.body.innerHTML = parsed.body.innerHTML;
        }
      } else {
        doc.documentElement.innerHTML = safeNext;
      }
    } catch (err) {
      doc.documentElement.innerHTML = safeNext;
    }

    // Re-inject styles and notify listeners so toolbar/styles are restored
    injectStyles(doc);
    try {
      doc.dispatchEvent(new Event("selectionchange"));
    } catch (err) {
      /* ignore dispatch errors */
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rich-html-editor] Redo failed:", message);
  }
}
