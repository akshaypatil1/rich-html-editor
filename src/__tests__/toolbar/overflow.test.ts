import { describe, it, beforeEach, expect } from "vitest";
import { setupOverflow } from "../../toolbar/overflow";

describe("toolbar.overflow setupOverflow", () => {
  let toolbar: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = "";
    toolbar = document.createElement("div");
    document.body.appendChild(toolbar);
  });

  it("creates overflow button and menu, toggles via click and keydown, and closes on Escape and outside click", async () => {
    const helpers = {
      makeSelect: (title: string) => {
        const s = document.createElement("select");
        s.appendChild(new Option(title));
        return s;
      },
      makeColorInput: () => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "color";
        label.appendChild(input);
        return label;
      },
      makeButton: (labelText: string) => {
        const b = document.createElement("button");
        b.textContent = labelText;
        return b;
      },
      makeGroup: () => document.createElement("div"),
    } as any;

    const options = {
      onCommand: () => undefined,
      onUndo: () => undefined,
      onRedo: () => undefined,
      canUndo: () => false,
      canRedo: () => false,
    } as any;

    const format = {
      formatBlock: null,
      fontName: null,
      fontSize: null,
      foreColor: null,
      hiliteColor: null,
    };

    setupOverflow(document, toolbar, options, format, helpers as any);

    const overflowBtn = toolbar.querySelector(
      ".toolbar-overflow-btn",
    ) as HTMLButtonElement;
    const overflowMenu = toolbar.querySelector(
      ".toolbar-overflow-menu",
    ) as HTMLDivElement;
    expect(overflowBtn).not.toBeNull();
    expect(overflowMenu).not.toBeNull();

    // initially hidden
    expect(overflowMenu.hidden).toBe(true);

    // click opens
    overflowBtn.click();
    expect(overflowMenu.hidden).toBe(false);
    expect(overflowBtn.getAttribute("aria-expanded")).toBe("true");

    // click again closes
    overflowBtn.click();
    expect(overflowMenu.hidden).toBe(true);
    expect(overflowBtn.getAttribute("aria-expanded")).toBe("false");

    // keydown Enter opens
    const enterEvt = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    overflowBtn.dispatchEvent(enterEvt);
    expect(overflowMenu.hidden).toBe(false);

    // Escape on menu closes
    const esc = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    overflowMenu.dispatchEvent(esc);
    expect(overflowMenu.hidden).toBe(true);

    // ArrowDown opens
    const arrow = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });
    overflowBtn.dispatchEvent(arrow);
    expect(overflowMenu.hidden).toBe(false);

    // pointerdown outside closes
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    );
    expect(overflowMenu.hidden).toBe(true);

    // menu should contain selects and inputs added by helpers
    const wrap = toolbar.querySelector(".toolbar-overflow-wrap")!;
    const menu = wrap.querySelector(".toolbar-overflow-menu")!;
    // helpers appended at least one select and one input element
    expect(menu.querySelector("select")).not.toBeNull();
    expect(
      menu.querySelector("input[type=color]") || menu.querySelector("button"),
    ).not.toBeNull();
  });
});
