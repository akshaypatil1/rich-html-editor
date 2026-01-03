export const EDITOR_ROOT_ID = "rhe-editor-root";

/**
 * Ensure an editor root container exists in the given document and return it.
 * If not present, create it and insert as the first child of body.
 */
export function getEditorRoot(doc: Document): HTMLElement {
  let root = doc.getElementById(EDITOR_ROOT_ID) as HTMLElement | null;
  if (root) return root;

  root = doc.createElement("div");
  root.id = EDITOR_ROOT_ID;
  // Safe defaults: allow the page to position/size the root; library CSS will scope under it
  root.setAttribute("data-rhe-root", "true");
  try {
    if (doc.body && doc.body.firstChild)
      doc.body.insertBefore(root, doc.body.firstChild);
    else if (doc.body) doc.body.appendChild(root);
    else doc.documentElement.appendChild(root);
  } catch (e) {
    // best-effort: if insertion fails, fallback to appending to documentElement
    try {
      doc.documentElement.appendChild(root);
    } catch (err) {
      /* ignore */
    }
  }
  return root;
}
