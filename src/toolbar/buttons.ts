export function makeButton(
  doc: Document,
  options: { onCommand: (command: string, value?: string) => void },
  label: string,
  title: string,
  command: string,
  value?: string,
  isActive?: boolean,
  disabled?: boolean
) {
  const btn = doc.createElement("button");
  btn.type = "button";
  if (label && label.trim().startsWith("<")) {
    btn.innerHTML = label;
  } else {
    btn.textContent = label;
  }
  btn.title = title;
  btn.setAttribute("aria-label", title);
  if (typeof isActive !== "undefined")
    btn.setAttribute("aria-pressed", String(!!isActive));
  btn.tabIndex = 0;
  if (disabled) btn.disabled = true;
  btn.onclick = () => options.onCommand(command, value);
  btn.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      btn.click();
    }
  });
  return btn;
}

export function makeGroup(doc: Document) {
  const g = doc.createElement("div");
  g.className = "toolbar-group";
  return g;
}

export function makeSep(doc: Document) {
  const s = doc.createElement("div");
  s.className = "toolbar-sep";
  return s;
}
