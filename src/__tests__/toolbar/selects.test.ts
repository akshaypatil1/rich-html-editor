import { describe, it, beforeEach, expect, vi } from "vitest";
import { makeSelect } from "../../toolbar/selects";

describe("toolbar.selects makeSelect", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a select with options and default placeholder", () => {
    const onCommand = vi.fn();
    const optionsList = [
      { label: "One", value: "1" },
      { label: "Two", value: "2" },
    ];
    const sel = makeSelect(
      document,
      { onCommand },
      "Size",
      "fontSize",
      optionsList,
    );
    document.body.appendChild(sel);

    expect(sel.title).toBe("Size");
    expect(sel.getAttribute("aria-label")).toBe("Size");
    // first option is placeholder
    expect(sel.options[0].text).toBe("Size");
    expect(sel.options.length).toBe(3);
  });

  it("sets initial value when valid", () => {
    const onCommand = vi.fn();
    const optionsList = [
      { label: "Small", value: "12" },
      { label: "Large", value: "24" },
    ];
    const sel = makeSelect(
      document,
      { onCommand },
      "Size",
      "fontSize",
      optionsList,
      "24",
    );
    document.body.appendChild(sel);
    expect((sel as HTMLSelectElement).value).toBe("24");
  });

  it("calls onCommand with selected value and resets to placeholder", () => {
    const onCommand = vi.fn();
    const optionsList = [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ];
    const sel = makeSelect(
      document,
      { onCommand },
      "Fmt",
      "formatBlock",
      optionsList,
    );
    document.body.appendChild(sel);

    // simulate user selecting second option
    (sel as HTMLSelectElement).value = "b";
    sel.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onCommand).toHaveBeenCalledWith("formatBlock", "b");
    // after change the select resets to placeholder (index 0)
    expect((sel as HTMLSelectElement).selectedIndex).toBe(0);
  });
});
