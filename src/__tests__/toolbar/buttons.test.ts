import { describe, it, expect, vi } from "vitest";
import { makeButton, makeGroup, makeSep } from "../../toolbar/buttons";

describe("toolbar.buttons helpers", () => {
  it("makeButton creates accessible button and invokes onCommand on click and Enter/Space keydown", () => {
    const doc = document as Document;
    const onCommand = vi.fn();
    const btn = makeButton(
      doc,
      { onCommand },
      "B",
      "Bold",
      "bold",
      undefined,
      true,
      false,
    );

    expect(btn.tagName).toBe("BUTTON");
    expect(btn.title).toBe("Bold");
    expect(btn.getAttribute("aria-label")).toBe("Bold");
    expect(btn.getAttribute("aria-pressed")).toBe("true");

    // click should call
    btn.click();
    expect(onCommand).toHaveBeenCalledWith("bold", undefined);

    // keydown Enter should trigger click
    onCommand.mockClear();
    const evEnter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    btn.dispatchEvent(evEnter);
    expect(onCommand).toHaveBeenCalled();

    // keydown Space should trigger click
    onCommand.mockClear();
    const evSpace = new KeyboardEvent("keydown", { key: " ", bubbles: true });
    btn.dispatchEvent(evSpace);
    expect(onCommand).toHaveBeenCalled();
  });

  it("makeGroup and makeSep create elements with expected classes", () => {
    const doc = document as Document;
    const grp = makeGroup(doc);
    const sep = makeSep(doc);

    expect(grp.tagName).toBe("DIV");
    expect(grp.className).toContain("toolbar-group");

    expect(sep.tagName).toBe("DIV");
    expect(sep.className).toBe("toolbar-sep");
  });
});
