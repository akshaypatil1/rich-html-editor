export function setupOverflow(
  doc: Document,
  toolbar: HTMLElement,
  options: {
    onCommand: (command: string, value?: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
  },
  format: any,
  helpers: {
    makeSelect: (
      title: string,
      command: string,
      optionsList: { label: string; value: string }[],
      initialValue?: string | null
    ) => HTMLElement;
    makeColorInput: (
      title: string,
      command: string,
      initialColor?: string
    ) => HTMLElement;
    makeButton: (
      label: string,
      title: string,
      command: string,
      value?: string,
      isActive?: boolean,
      disabled?: boolean
    ) => HTMLElement;
    makeGroup: () => HTMLElement;
  }
) {
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

  overflowBtn.addEventListener("click", () => {
    if (overflowMenu.hidden) openOverflow();
    else closeOverflow();
  });
  overflowBtn.addEventListener("keydown", (e: KeyboardEvent) => {
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

  overflowMenu.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeOverflow();
    }
  });
  doc.addEventListener("pointerdown", (ev: PointerEvent) => {
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
    helpers.makeSelect(
      "Format",
      "formatBlock",
      (window as any).RHE_FORMAT_OPTIONS || [],
      (format as any).formatBlock
    )
  );
  overflowMenu.appendChild(
    helpers.makeSelect(
      "Font",
      "fontName",
      (window as any).RHE_FONT_OPTIONS || [],
      (format as any).fontName
    )
  );
  overflowMenu.appendChild(
    helpers.makeSelect(
      "Size",
      "fontSize",
      (window as any).RHE_SIZE_OPTIONS || [],
      (format as any).fontSize
    )
  );
  overflowMenu.appendChild(
    helpers.makeColorInput("Text color", "foreColor", (format as any).foreColor)
  );
  overflowMenu.appendChild(
    helpers.makeColorInput(
      "Highlight color",
      "hiliteColor",
      (format as any).hiliteColor
    )
  );
  overflowMenu.appendChild(helpers.makeButton("Link", "Insert link", "link"));

  const overflowWrap = helpers.makeGroup();
  overflowWrap.className = "toolbar-group toolbar-overflow-wrap";
  overflowWrap.appendChild(overflowBtn);
  overflowWrap.appendChild(overflowMenu);
  toolbar.appendChild(overflowWrap);
}
