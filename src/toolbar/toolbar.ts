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
  LABEL_BOLD,
  LABEL_ITALIC,
  LABEL_UNDERLINE,
  LABEL_STRIKETHROUGH,
  LABEL_UNDO,
  LABEL_REDO,
  LABEL_LINK,
  LABEL_ALIGN_LEFT,
  LABEL_ALIGN_CENTER,
  LABEL_ALIGN_RIGHT,
  FONT_OPTIONS,
  SIZE_OPTIONS,
  FORMAT_OPTIONS,
  PALETTE_SVG,
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
    // If caller provided an HTML label (e.g. "<i>I</i>"), render it as HTML.
    // Otherwise set textContent for safety.
    if (label && label.trim().startsWith("<")) {
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
    label.className = "color-input-label";
    // Palette icon (inline SVG) placed before the native color input
    // const icon = doc.createElement("span");
    // icon.className = "color-palette-icon";
    // icon.innerHTML = PALETTE_SVG;
    const input = doc.createElement("input");
    input.type = "color";
    input.className = "toolbar-color-input";
    input.onchange = (e) => {
      options.onCommand(command, (e.target as HTMLInputElement).value);
    };
    // label.appendChild(icon);
    label.appendChild(input);
    return label;
  }

  const format = options.getFormatState();
  // Helpers: group wrapper and separator element
  function makeGroup() {
    const g = doc.createElement("div");
    g.className = "toolbar-group";
    return g;
  }

  function makeSep() {
    const s = doc.createElement("div");
    s.className = "toolbar-sep";
    return s;
  }

  // Section 1: Undo / Redo
  const undoBtn = makeButton(
    LABEL_UNDO,
    "Undo",
    "undo",
    undefined,
    false,
    !options.canUndo()
  );
  // Undo/Redo are handled by the history module — call handlers directly
  undoBtn.onclick = () => options.onUndo();

  const redoBtn = makeButton(
    LABEL_REDO,
    "Redo",
    "redo",
    undefined,
    false,
    !options.canRedo()
  );
  redoBtn.onclick = () => options.onRedo();

  const grp1 = makeGroup();
  grp1.appendChild(undoBtn);
  grp1.appendChild(redoBtn);
  toolbar.appendChild(grp1);
  toolbar.appendChild(makeSep());

  // Section 2: Format, Font & Size
  const grp2 = makeGroup();
  grp2.appendChild(makeSelect("Format", "formatBlock", FORMAT_OPTIONS));
  grp2.appendChild(makeSelect("Font", "fontName", FONT_OPTIONS));
  grp2.appendChild(makeSelect("Size", "fontSize", SIZE_OPTIONS));
  toolbar.appendChild(grp2);
  toolbar.appendChild(makeSep());

  // Section 3: Bold, Italic, Underline, Strikethrough
  const grp3 = makeGroup();
  grp3.appendChild(
    makeButton(LABEL_BOLD, "Bold", "bold", undefined, format.bold)
  );
  grp3.appendChild(
    makeButton(LABEL_ITALIC, "Italic", "italic", undefined, format.italic)
  );
  grp3.appendChild(
    makeButton(
      LABEL_UNDERLINE,
      "Underline",
      "underline",
      undefined,
      format.underline
    )
  );
  grp3.appendChild(makeButton(LABEL_STRIKETHROUGH, "Strikethrough", "strike"));
  toolbar.appendChild(grp3);
  toolbar.appendChild(makeSep());

  // Section 4: Alignment
  const grp4 = makeGroup();
  grp4.appendChild(makeButton(LABEL_ALIGN_LEFT, "Align left", "align", "left"));
  grp4.appendChild(
    makeButton(LABEL_ALIGN_CENTER, "Align center", "align", "center")
  );
  grp4.appendChild(
    makeButton(LABEL_ALIGN_RIGHT, "Align right", "align", "right")
  );
  toolbar.appendChild(grp4);
  toolbar.appendChild(makeSep());

  // Section 5: Colors
  const grp5 = makeGroup();
  grp5.appendChild(makeColorInput("Text color", "foreColor"));
  grp5.appendChild(makeColorInput("Highlight color", "hiliteColor"));
  toolbar.appendChild(grp5);
  toolbar.appendChild(makeSep());

  // Section 6: Link
  const grp6 = makeGroup();
  grp6.appendChild(makeButton(LABEL_LINK, "Insert link", "link"));
  toolbar.appendChild(grp6);

  // const info = doc.createElement("span");
  // // Info styles moved to stylesheet
  // info.textContent = options.getSelectedElementInfo()
  //   ? `Selected: ${options.getSelectedElementInfo()}`
  //   : "Click any highlighted element to edit";
  // toolbar.appendChild(info);

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
