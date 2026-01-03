export function makeColorInput(
  doc: Document,
  options: { onCommand: (command: string, value?: string) => void },
  title: string,
  command: string,
  initialColor?: string,
) {
  const input = doc.createElement("input");
  input.type = "color";
  input.className = "toolbar-color-input";
  const wrapper = doc.createElement("label");
  wrapper.className = "color-label";
  wrapper.appendChild(doc.createTextNode(title + " "));
  wrapper.appendChild(input);
  let savedRange: Range | null = null;
  input.addEventListener("pointerdown", () => {
    const s = doc.getSelection();
    if (s && s.rangeCount) savedRange = s.getRangeAt(0).cloneRange();
  });
  input.onchange = (e: Event) => {
    try {
      const s = doc.getSelection();
      if (savedRange && s) {
        s.removeAllRanges();
        s.addRange(savedRange);
      }
    } catch (err) {
      /* ignore */
    }
    options.onCommand(command, (e.target as HTMLInputElement).value);
    savedRange = null;
  };

  function rgbToHex(input?: string | null): string | null {
    if (!input) return null;
    const v = input.trim();
    if (v.startsWith("#")) {
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
    try {
      if (
        hex &&
        hex.startsWith("#") &&
        (input as HTMLInputElement).value !== hex
      ) {
        (input as HTMLInputElement).value = hex;
      }
    } catch (e) {
      /* ignore */
    }
  };

  if (initialColor) setColor(initialColor);
  input.addEventListener("input", (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    setColor(val);
  });
  input.title = title;
  input.setAttribute("aria-label", title);
  return wrapper;
}
