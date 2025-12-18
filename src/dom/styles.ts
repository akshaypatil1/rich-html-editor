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
  /* Allow toolbar items to wrap onto multiple lines on narrow screens */
  flex-wrap: wrap;
  justify-content: flex-start;
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
#${TOOLBAR_ID} select{
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} input[type="color"]{
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: #fff;
  font-family: inherit;
}
#${TOOLBAR_ID} .color-input-label{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
}

/* Labeled color inputs (e.g. "Text Color <input type=color>") */
#${TOOLBAR_ID} .color-label{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  border: none;
}
#${TOOLBAR_ID} .color-input-label .color-icon{
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
#${TOOLBAR_ID} .text-color-icon{
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 3px solid currentColor;
  transform-origin: center;
}
#${TOOLBAR_ID} .highlight-icon{
  width: 16px;
  height: 16px;
  display: inline-block;
}
#${TOOLBAR_ID} .color-icon svg{
  width: 16px;
  height: 16px;
  display: block;
}
/* Text color wrapper: A with a small swatch on the right */
#${TOOLBAR_ID} .text-color-wrapper{
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .text-color-wrapper .text-A{
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}
#${TOOLBAR_ID} .text-color-wrapper .color-swatch{
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.12);
  box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset;
  background: currentColor;
}

/* Highlight wrapper: small colored bar under/behind the A to mimic highlighter */
#${TOOLBAR_ID} .highlight-wrapper{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
}
#${TOOLBAR_ID} .highlight-wrapper .highlight-bar{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 8px;
  border-radius: 3px;
  background: #ffeb3b; /* default yellow */
  z-index: 0;
}
#${TOOLBAR_ID} .highlight-wrapper .text-A{
  position: relative;
  z-index: 1;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  padding: 0 4px;
}
#${TOOLBAR_ID} span{
  color: ${INFO_COLOR};
  font-size: 90%;
}

/* Grouping and separators */
#${TOOLBAR_ID} .toolbar-group{
  display: flex;
  align-items: center;
  gap: 6px;
}
#${TOOLBAR_ID} .toolbar-group{
  /* groups may wrap internally to avoid overflow on narrow screens */
  flex-wrap: wrap;
}
/* Overflow button + menu styling */
#${TOOLBAR_ID} .toolbar-overflow-btn{
  display: none;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid ${BUTTON_BORDER};
  background: ${BUTTON_BG};
  color: ${BUTTON_COLOR};
  font-weight: 600;
}
#${TOOLBAR_ID} .toolbar-overflow-menu{
  position: absolute;
  top: calc(100% + 6px);
  right: 12px;
  min-width: 160px;
  background: #fff;
  border: 1px solid rgba(15,23,42,0.06);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 12px 40px rgba(2,6,23,0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10000;
}
#${TOOLBAR_ID} .toolbar-overflow-menu[hidden]{
  display: none;
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
  /* Default icon appearance */
  fill: none;
}

/* Active/pressed: switch to filled appearance */
#${TOOLBAR_ID} button[aria-pressed="true"] svg{
  fill: currentColor;
}

/* Focus and accessibility */
#${TOOLBAR_ID} button:focus{
  outline: none;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
}

/* Disabled state */
#${TOOLBAR_ID} button:disabled{
  opacity: 0.48;
  cursor: not-allowed;
}
/* Responsive tweaks: reduce spacing and allow horizontal scroll on very small screens */
@media (max-width: 720px){
  #${TOOLBAR_ID}{
    padding: 6px 8px;
    gap: 6px;
  }
  #${TOOLBAR_ID} button,
  #${TOOLBAR_ID} select,
  #${TOOLBAR_ID} input[type="color"]{
    padding: 4px 6px;
    border-radius: 6px;
  }
  /* Hide visual separators to save horizontal space */
  #${TOOLBAR_ID} .toolbar-sep{
    display: none;
  }
  /* Collapse labeled color text visually but preserve accessibility on the input */
  #${TOOLBAR_ID} .color-label{
    font-size: 0;
  }
  #${TOOLBAR_ID} .color-label input{
    font-size: initial;
  }
}
@media (max-width: 420px){
  /* On very small screens prefer a single-line scrollable toolbar */
  #${TOOLBAR_ID}{
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  #${TOOLBAR_ID} .toolbar-group{
    flex: 0 0 auto;
  }
  #${TOOLBAR_ID} button{ margin-right: 6px; }
  /* Show overflow button and hide the groups marked for collapse */
  #${TOOLBAR_ID} .toolbar-overflow-btn{
    display: inline-flex;
  }
  #${TOOLBAR_ID} .collapse-on-small{
    display: none;
  }
}
`;
  if (!styleEl) {
    styleEl = doc.createElement("style");
    styleEl.id = styleId;
    doc.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}
