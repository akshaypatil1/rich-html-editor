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
  LABEL_UNORDERED_LIST,
  LABEL_ORDERED_LIST,
  LABEL_UNDO,
  LABEL_REDO,
  LABEL_LINK,
  LABEL_ALIGN_LEFT,
  LABEL_ALIGN_CENTER,
  LABEL_ALIGN_RIGHT,
  FONT_OPTIONS,
  SIZE_OPTIONS,
  FORMAT_OPTIONS,
} from "../core/constants";
import { makeColorInput } from "./color";
import { setupOverflow } from "./overflow";
import {
  makeButton as _makeButton,
  makeGroup as _makeGroup,
  makeSep as _makeSep,
} from "./buttons";
import { makeSelect as _makeSelect } from "./selects";
import { setupNavigation } from "./navigation";

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

  const makeButton = (
    label: string,
    title: string,
    command: string,
    value?: string,
    isActive?: boolean,
    disabled?: boolean
  ) =>
    _makeButton(
      doc,
      { onCommand: options.onCommand },
      label,
      title,
      command,
      value,
      isActive,
      disabled
    );

  const makeSelect = (
    title: string,
    command: string,
    optionsList: { label: string; value: string }[],
    initialValue?: string | null
  ) =>
    _makeSelect(
      doc,
      { onCommand: options.onCommand },
      title,
      command,
      optionsList,
      initialValue
    );

  // Color input helper moved to ./color.ts

  const format = options.getFormatState();
  // Helpers: group wrapper and separator element
  const makeGroup = () => _makeGroup(doc);
  const makeSep = () => _makeSep(doc);

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
  grp3.appendChild(
    makeButton(
      LABEL_UNORDERED_LIST,
      "Unordered list",
      "unorderedList",
      undefined,
      (format as any).listType === "ul"
    )
  );
  grp3.appendChild(
    makeButton(
      LABEL_ORDERED_LIST,
      "Ordered list",
      "orderedList",
      undefined,
      (format as any).listType === "ol"
    )
  );
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
    makeColorInput(
      doc,
      options,
      "Text color",
      "foreColor",
      (format as any).foreColor
    )
  );
  grp5.appendChild(
    makeColorInput(
      doc,
      options,
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

  // Overflow UI extracted to ./overflow.ts — set up with helper functions
  setupOverflow(doc, toolbar, options, format, {
    makeSelect,
    makeColorInput: (title: string, command: string, initial?: string) =>
      makeColorInput(doc, options, title, command, initial),
    makeButton,
    makeGroup,
  });

  // const info = doc.createElement("span");
  // // Info styles moved to stylesheet
  // info.textContent = options.getSelectedElementInfo()
  //   ? `Selected: ${options.getSelectedElementInfo()}`
  //   : "Click any highlighted element to edit";
  // toolbar.appendChild(info);

  // Keyboard navigation for toolbar
  setupNavigation(toolbar);

  doc.body.insertBefore(toolbar, doc.body.firstChild);
}
