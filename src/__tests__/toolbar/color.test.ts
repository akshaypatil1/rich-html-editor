import { describe, it, beforeEach, expect, vi } from "vitest";
import { makeColorInput } from "../../toolbar/color";

describe("toolbar.color makeColorInput", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a labeled color input with proper attributes", () => {
    const onCommand = vi.fn();
    const wrapper = makeColorInput(
      document,
      { onCommand },
      "Text color",
      "foreColor",
    );
    document.body.appendChild(wrapper);

    const input = wrapper.querySelector(
      "input[type=color]",
    ) as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.title).toBe("Text color");
    expect(input.getAttribute("aria-label")).toBe("Text color");
  });

  it("accepts short hex and expands to full hex", () => {
    const onCommand = vi.fn();
    const wrapper = makeColorInput(document, { onCommand }, "C", "cmd", "#f00");
    document.body.appendChild(wrapper);
    const input = wrapper.querySelector(
      "input[type=color]",
    ) as HTMLInputElement;
    // short #f00 should become #ff0000
    expect(input.value).toBe("#ff0000");
  });

  it("accepts rgb(...) string and converts to hex", () => {
    const onCommand = vi.fn();
    const wrapper = makeColorInput(
      document,
      { onCommand },
      "C",
      "cmd",
      "rgb(255,0,0)",
    );
    document.body.appendChild(wrapper);
    const input = wrapper.querySelector(
      "input[type=color]",
    ) as HTMLInputElement;
    expect(input.value).toBe("#ff0000");
  });

  it("restores selection on change and calls onCommand", () => {
    const onCommand = vi.fn();
    const wrapper = makeColorInput(
      document,
      { onCommand },
      "Color",
      "foreColor",
    );
    document.body.appendChild(wrapper);
    const input = wrapper.querySelector(
      "input[type=color]",
    ) as HTMLInputElement;

    // create a paragraph and selection
    const p = document.createElement("p");
    const tn = document.createTextNode("hello world");
    p.appendChild(tn);
    document.body.appendChild(p);
    const range = document.createRange();
    range.setStart(tn, 1);
    range.collapse(true);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    // pointerdown should save the range
    input.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    // change the value and dispatch change event
    input.value = "#00ff00";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onCommand).toHaveBeenCalledWith("foreColor", "#00ff00");
    // selection should have been restored to the original anchor node
    const selAfter = document.getSelection()!;
    expect(selAfter.anchorNode).toBe(tn);
  });
});
