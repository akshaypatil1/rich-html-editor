/**
 * Inject CSS styles into the document for editor UI
 *
 * Adds styling for:
 * - `.editor-editable-element`: Dashed outline for hoverable elements
 * - `.editor-active-element`: Solid green outline for active editing element
 *
 * Uses a style ID to prevent duplicate injections
 *
 * @param doc - Document to inject styles into
 */
import {
  STYLE_ID,
  CLASS_EDITABLE,
  CLASS_ACTIVE,
  HOVER_OUTLINE,
  ACTIVE_OUTLINE,
  TOOLBAR_ID,
  TOOLBAR_BG,
  TOOLBAR_BORDER,
  BUTTON_BORDER,
  BUTTON_ACTIVE_BG,
  BUTTON_BG,
  BUTTON_COLOR,
  INFO_COLOR,
} from "../core/constants";

export function injectStyles(doc: Document): void {
  const styleId = STYLE_ID;
  let styleEl = doc.getElementById(styleId) as HTMLStyleElement | null;
  const css = `
.${CLASS_EDITABLE}{outline:2px dashed ${HOVER_OUTLINE};cursor:text}
.${CLASS_ACTIVE}{outline:2px solid ${ACTIVE_OUTLINE};cursor:text}
#${TOOLBAR_ID}{
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${TOOLBAR_BG};
  border-bottom: 1px solid ${TOOLBAR_BORDER};
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(2,6,23,0.08);
  backdrop-filter: blur(6px);
}
#${TOOLBAR_ID} button{
  padding: 6px 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: ${BUTTON_BG};
  color: ${BUTTON_COLOR};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
  outline: none;
  margin-right: 2px;
}
#${TOOLBAR_ID} button[aria-pressed="true"]{
  background: ${BUTTON_ACTIVE_BG};
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(99,102,241,0.12);
}
#${TOOLBAR_ID} button:hover:not(:disabled){
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(2,6,23,0.08);
}
#${TOOLBAR_ID} select, #${TOOLBAR_ID} input[type="color"]{
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} span{
  margin-left: 16px;
  color: ${INFO_COLOR};
  font-size: 90%;
}

/* Grouping and separators */
#${TOOLBAR_ID} .toolbar-group{
  display: flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .toolbar-sep{
  width: 1px;
  height: 28px;
  background: rgba(15,23,42,0.06);
  margin: 0 8px;
  border-radius: 1px;
}
#${TOOLBAR_ID} .toolbar-spacer{
  flex: 1 1 auto;
}
#${TOOLBAR_ID} button svg{
  width: 16px;
  height: 16px;
  display: block;
}
`;
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = styleId;
    doc.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}
