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
  TEXT_COLOR_ICON_HTML,
  HIGHLIGHT_ICON_HTML,
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
      foreColor?: string | null;
      hiliteColor?: string | null;
      fontName?: string | null;
      fontSize?: string | null;
      formatBlock?: string | null;
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
    optionsList: { label: string; value: string }[],
    initialValue?: string | null
  ) {
    const select = doc.createElement("select");
    select.title = title;
    select.setAttribute("aria-label", title);
    // Select styling handled in stylesheet
    select.appendChild(new Option(title, "", true, true));
    for (const opt of optionsList) {
      select.appendChild(new Option(opt.label, opt.value));
    }
    // set initial value if provided
    try {
      if (initialValue) select.value = initialValue;
    } catch (e) {
      /* ignore invalid value */
    }

    select.onchange = (e) => {
      const val = (e.target as HTMLSelectElement).value;
      options.onCommand(command, val);
      select.selectedIndex = 0;
    };
    return select;
  }

  function makeColorInput(
    title: string,
    command: string,
    initialColor?: string
  ) {
    /*
    const label = doc.createElement("label");
    label.title = title;
    label.setAttribute("aria-label", title);
    label.className = "color-input-label";
    // Icon element shown before the native color input. Use MS Word-like icons
    const iconWrap = doc.createElement("span");
    iconWrap.className = "color-icon";
    iconWrap.setAttribute("aria-hidden", "true");
    if (command === "foreColor") {
      iconWrap.innerHTML = TEXT_COLOR_ICON_HTML;
    } else if (command === "hiliteColor") {
      iconWrap.innerHTML = HIGHLIGHT_ICON_HTML;
    } else {
      iconWrap.innerHTML = PALETTE_SVG;
    }
    */

    const input = doc.createElement("input");
    input.type = "color";
    input.className = "toolbar-color-input";
    // Wrap the native color input with a visible label so users can see
    // which control is for text color vs highlight.
    const wrapper = doc.createElement("label");
    wrapper.className = "color-label";
    // Use the provided title as the label text (e.g. "Text Color")
    wrapper.appendChild(doc.createTextNode(title + " "));
    wrapper.appendChild(input);
    // Preserve the user's selection when the color picker opens (input steals focus)
    let savedRange: Range | null = null;
    input.addEventListener("pointerdown", () => {
      const s = doc.getSelection();
      if (s && s.rangeCount) savedRange = s.getRangeAt(0).cloneRange();
    });
    input.onchange = (e) => {
      // Restore selection before applying the command
      try {
        const s = doc.getSelection();
        if (savedRange && s) {
          s.removeAllRanges();
          s.addRange(savedRange);
        }
      } catch (err) {
        // ignore restore errors
      }
      options.onCommand(command, (e.target as HTMLInputElement).value);
      // clear saved range after applying
      savedRange = null;
    };
    // Note: iconWrap/label are currently commented out above; operate on the
    // native color `input` only and set its value to match detected colors.
    function rgbToHex(input?: string | null): string | null {
      if (!input) return null;
      const v = input.trim();
      if (v.startsWith("#")) {
        // Normalize short hex #abc -> #aabbcc
        if (v.length === 4) {
          return ("#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toLowerCase();
        }
        return v.toLowerCase();
      }
      const rgbMatch = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (rgbMatch) {
        const r = Number(rgbMatch[1]);
        const g = Number(rgbMatch[2]);
        const b = Number(rgbMatch[3]);
        const hex =
          "#" +
          [r, g, b]
            .map((n) => n.toString(16).padStart(2, "0"))
            .join("")
            .toLowerCase();
        return hex;
      }
      return null;
    }

    const setColor = (val?: string) => {
      if (!val) return;
      const hex = rgbToHex(val) || val;
      // set native input value if we have a hex color
      try {
        if (
          hex &&
          hex.startsWith("#") &&
          (input as HTMLInputElement).value !== hex
        ) {
          (input as HTMLInputElement).value = hex;
        }
      } catch (e) {
        // ignore invalid value assignment
      }
    };
    // initialize from provided initialColor when available
    if (initialColor) setColor(initialColor);
    input.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      setColor(val);
    });
    // Instead of using a label+icon, return the native input directly.
    // Forward title and ARIA to the input so accessibility is preserved.
    input.title = title;
    input.setAttribute("aria-label", title);
    return wrapper;
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
  grp2.className = "toolbar-group collapse-on-small";
  grp2.appendChild(
    makeSelect(
      "Format",
      "formatBlock",
      FORMAT_OPTIONS,
      (format as any).formatBlock
    )
  );
  grp2.appendChild(
    makeSelect("Font", "fontName", FONT_OPTIONS, (format as any).fontName)
  );
  grp2.appendChild(
    makeSelect("Size", "fontSize", SIZE_OPTIONS, (format as any).fontSize)
  );
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
  grp5.className = "toolbar-group collapse-on-small";
  grp5.appendChild(
    makeColorInput("Text color", "foreColor", (format as any).foreColor)
  );
  grp5.appendChild(
    makeColorInput(
      "Highlight color",
      "hiliteColor",
      (format as any).hiliteColor
    )
  );
  toolbar.appendChild(grp5);
  toolbar.appendChild(makeSep());

  // Section 6: Link
  const grp6 = makeGroup();
  grp6.className = "toolbar-group collapse-on-small";
  grp6.appendChild(makeButton(LABEL_LINK, "Insert link", "link"));
  toolbar.appendChild(grp6);

  // Overflow menu button and floating menu for small screens
  const overflowBtn = doc.createElement("button");
  overflowBtn.type = "button";
  overflowBtn.className = "toolbar-overflow-btn";
  overflowBtn.title = "More";
  overflowBtn.setAttribute("aria-label", "More toolbar actions");
  overflowBtn.setAttribute("aria-haspopup", "true");
  overflowBtn.setAttribute("aria-expanded", "false");
  overflowBtn.tabIndex = 0;
  overflowBtn.innerHTML = "⋯";

  const overflowMenu = doc.createElement("div");
  overflowMenu.className = "toolbar-overflow-menu";
  overflowMenu.setAttribute("role", "menu");
  overflowMenu.hidden = true;

  function openOverflow() {
    overflowMenu.hidden = false;
    overflowBtn.setAttribute("aria-expanded", "true");
    const first = overflowMenu.querySelector<HTMLElement>(
      "button, select, input"
    );
    first?.focus();
  }
  function closeOverflow() {
    overflowMenu.hidden = true;
    overflowBtn.setAttribute("aria-expanded", "false");
    overflowBtn.focus();
  }

  overflowBtn.addEventListener("click", (e) => {
    if (overflowMenu.hidden) openOverflow();
    else closeOverflow();
  });
  overflowBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (overflowMenu.hidden) openOverflow();
      else closeOverflow();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (overflowMenu.hidden) openOverflow();
    }
  });

  overflowMenu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeOverflow();
    }
  });
  doc.addEventListener("pointerdown", (ev) => {
    if (
      !overflowMenu.hidden &&
      !overflowMenu.contains(ev.target as Node) &&
      ev.target !== overflowBtn
    ) {
      closeOverflow();
    }
  });

  // Populate overflow menu with duplicates of the collapsed controls
  overflowMenu.appendChild(
    makeSelect(
      "Format",
      "formatBlock",
      FORMAT_OPTIONS,
      (format as any).formatBlock
    )
  );
  overflowMenu.appendChild(
    makeSelect("Font", "fontName", FONT_OPTIONS, (format as any).fontName)
  );
  overflowMenu.appendChild(
    makeSelect("Size", "fontSize", SIZE_OPTIONS, (format as any).fontSize)
  );
  overflowMenu.appendChild(
    makeColorInput("Text color", "foreColor", (format as any).foreColor)
  );
  overflowMenu.appendChild(
    makeColorInput(
      "Highlight color",
      "hiliteColor",
      (format as any).hiliteColor
    )
  );
  overflowMenu.appendChild(makeButton(LABEL_LINK, "Insert link", "link"));

  const overflowWrap = makeGroup();
  overflowWrap.className = "toolbar-group toolbar-overflow-wrap";
  overflowWrap.appendChild(overflowBtn);
  overflowWrap.appendChild(overflowMenu);
  toolbar.appendChild(overflowWrap);

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
