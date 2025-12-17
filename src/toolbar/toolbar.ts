/**
 * Inject and render the formatting toolbar into the document
 *
 * Creates a sticky toolbar with:
 * - Text formatting buttons (Bold, Italic, Underline)
 * - Font and size selectors
 * - Undo/Redo buttons
 * - Link insertion button
 * - Color pickers (text and highlight)
 * - Text alignment buttons
 * - Selected element info display
 *
 * The toolbar is re-injected on every selection change to update state
 * (this is optimized for small toolbar size and few state changes)
 *
 * @param doc - Document to inject toolbar into
 * @param options - Toolbar configuration and callbacks
 */
import {
  TOOLBAR_ID,
  TOOLBAR_BG,
  TOOLBAR_BORDER,
  BUTTON_BORDER,
  BUTTON_ACTIVE_BG,
  BUTTON_BG,
  BUTTON_COLOR,
  INFO_COLOR,
} from "../core/constants";

export function injectToolbar(
  doc: Document,
  options: {
    onCommand: (command: string, value?: string) => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    onUndo: () => void;
    onRedo: () => void;
    getFormatState: () => {
      bold: boolean;
      italic: boolean;
      underline: boolean;
    };
    getSelectedElementInfo: () => string | null;
  }
) {
  const existing = doc.getElementById(TOOLBAR_ID);
  if (existing) existing.remove();

  const toolbar = doc.createElement("div");
  toolbar.id = TOOLBAR_ID;
  // Accessibility: expose as a toolbar region and provide a readable label
  toolbar.setAttribute("role", "toolbar");
  toolbar.setAttribute("aria-label", "Rich text editor toolbar");

  // Styling moved to injected stylesheet (see src/dom/styles.ts)

  function makeButton(
    label: string,
    title: string,
    command: string,
    value?: string,
    isActive?: boolean,
    disabled?: boolean
  ) {
    const btn = doc.createElement("button");
    btn.type = "button";
    // If caller provided inline SVG in `label`, it will be rendered as HTML.
    // We still require callers to set an accessible `title`/`aria-label`.
    if (label && label.trim().startsWith("<svg")) {
      btn.innerHTML = label;
    } else {
      btn.textContent = label;
    }
    btn.title = title;
    // Accessibility: aria-label + keyboard focusability + pressed state
    btn.setAttribute("aria-label", title);
    if (typeof isActive !== "undefined")
      btn.setAttribute("aria-pressed", String(!!isActive));
    btn.tabIndex = 0;
    // Visual appearance handled by stylesheet; use ARIA pressed for active state
    if (disabled) btn.disabled = true;
    btn.onclick = () => options.onCommand(command, value);
    // Keyboard activation: Enter or Space should trigger
    btn.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        btn.click();
      }
    });
    return btn;
  }

  function makeSelect(
    title: string,
    command: string,
    optionsList: { label: string; value: string }[]
  ) {
    const select = doc.createElement("select");
    select.title = title;
    select.setAttribute("aria-label", title);
    // Select styling handled in stylesheet
    select.appendChild(new Option(title, "", true, true));
    for (const opt of optionsList) {
      select.appendChild(new Option(opt.label, opt.value));
    }
    select.onchange = (e) => {
      const val = (e.target as HTMLSelectElement).value;
      options.onCommand(command, val);
      select.selectedIndex = 0;
    };
    return select;
  }

  function makeColorInput(title: string, command: string) {
    const label = doc.createElement("label");
    label.title = title;
    label.setAttribute("aria-label", title);
    const input = doc.createElement("input");
    input.type = "color";
    input.onchange = (e) => {
      options.onCommand(command, (e.target as HTMLInputElement).value);
    };
    label.appendChild(input);
    return label;
  }

  const format = options.getFormatState();

  // Inline SVG icons (use `currentColor` so icons match `BUTTON_COLOR`)
  const ICON_BOLD =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 6h5a3 3 0 0 1 0 6H7V6z" fill="currentColor"/><path d="M7 12h6a3 3 0 0 1 0 6H7v-6z" fill="currentColor" opacity="0.95"/></svg>';
  const ICON_ITALIC =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 4h8v2h-3.5l-4.5 12H16v2H6v-2h3.5l4.5-12H10V4z" fill="currentColor"/></svg>';
  const ICON_UNDERLINE =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4h-2v6a4 4 0 0 1-8 0V4H6z" fill="currentColor"/><path d="M6 20h12v2H6v-2z" fill="currentColor"/></svg>';
  const ICON_UNDO =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9 7L4 12l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M20 12a8 8 0 0 0-8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const ICON_REDO =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15 7l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 12a8 8 0 0 0 8 8h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const ICON_LINK =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 14a3 3 0 0 1 0-4l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M14 10a3 3 0 0 1 0 4l-1 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  const ICON_ALIGN_LEFT =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="4" y="5" width="14" height="2" rx="1" fill="currentColor"/><rect x="4" y="9" width="10" height="2" rx="1" fill="currentColor"/><rect x="4" y="13" width="14" height="2" rx="1" fill="currentColor"/><rect x="4" y="17" width="10" height="2" rx="1" fill="currentColor"/></svg>';
  const ICON_ALIGN_CENTER =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="5" y="5" width="14" height="2" rx="1" fill="currentColor"/><rect x="7" y="9" width="10" height="2" rx="1" fill="currentColor"/><rect x="5" y="13" width="14" height="2" rx="1" fill="currentColor"/><rect x="7" y="17" width="10" height="2" rx="1" fill="currentColor"/></svg>';
  const ICON_ALIGN_RIGHT =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="6" y="5" width="14" height="2" rx="1" fill="currentColor"/><rect x="8" y="9" width="10" height="2" rx="1" fill="currentColor"/><rect x="6" y="13" width="14" height="2" rx="1" fill="currentColor"/><rect x="8" y="17" width="10" height="2" rx="1" fill="currentColor"/></svg>';

  toolbar.appendChild(
    makeButton(ICON_BOLD, "Bold", "bold", undefined, format.bold)
  );
  toolbar.appendChild(
    makeButton(ICON_ITALIC, "Italic", "italic", undefined, format.italic)
  );
  toolbar.appendChild(
    makeButton(
      ICON_UNDERLINE,
      "Underline",
      "underline",
      undefined,
      format.underline
    )
  );

  toolbar.appendChild(
    makeSelect("Font", "fontName", [
      { label: "Arial", value: "Arial" },
      { label: "Georgia", value: "Georgia" },
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Courier New", value: "Courier New" },
      { label: "Tahoma", value: "Tahoma" },
    ])
  );
  toolbar.appendChild(
    makeSelect("Size", "fontSize", [
      { label: "Small", value: "2" },
      { label: "Normal", value: "3" },
      { label: "Medium", value: "4" },
      { label: "Large", value: "5" },
      { label: "XL", value: "6" },
    ])
  );

  toolbar.appendChild(
    makeButton(ICON_UNDO, "Undo", "undo", undefined, false, !options.canUndo())
  );
  toolbar.appendChild(
    makeButton(ICON_REDO, "Redo", "redo", undefined, false, !options.canRedo())
  );

  toolbar.appendChild(makeButton(ICON_LINK, "Insert link", "link"));
  toolbar.appendChild(makeColorInput("Text color", "foreColor"));
  toolbar.appendChild(makeColorInput("Highlight color", "hiliteColor"));

  toolbar.appendChild(
    makeButton(ICON_ALIGN_LEFT, "Align left", "align", "left")
  );
  toolbar.appendChild(
    makeButton(ICON_ALIGN_CENTER, "Align center", "align", "center")
  );
  toolbar.appendChild(
    makeButton(ICON_ALIGN_RIGHT, "Align right", "align", "right")
  );

  const info = doc.createElement("span");
  // Info styles moved to stylesheet
  info.textContent = options.getSelectedElementInfo()
    ? `Selected: ${options.getSelectedElementInfo()}`
    : "Click any highlighted element to edit";
  toolbar.appendChild(info);

  // Keyboard navigation for toolbar (ArrowLeft/ArrowRight/Home/End)
  toolbar.addEventListener("keydown", (e) => {
    const focusable = Array.from(
      toolbar.querySelectorAll<HTMLElement>("button, select, input, [tabindex]")
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!focusable.length) return;
    const idx = focusable.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next =
        focusable[Math.min(focusable.length - 1, Math.max(0, idx + 1))];
      next?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = focusable[Math.max(0, idx - 1)] || focusable[0];
      prev?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      focusable[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      focusable[focusable.length - 1].focus();
    }
  });

  doc.body.insertBefore(toolbar, doc.body.firstChild);
}
