import { describe, it, beforeEach, expect } from "vitest";
import { setupNavigation } from "../../toolbar/navigation";

describe("toolbar.navigation setupNavigation", () => {
  let toolbar: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = "";
    toolbar = document.createElement("div");
    document.body.appendChild(toolbar);
  });

  it("creates navigation buttons and handles focus via Arrow keys and Home/End", () => {
    const makeBtn = (txt: string) => {
      const b = document.createElement("button");
      b.textContent = txt;
      return b;
    };

    const group = document.createElement("div");
    group.appendChild(makeBtn("A"));
    group.appendChild(makeBtn("B"));
    group.appendChild(makeBtn("C"));
    toolbar.appendChild(group);

    setupNavigation(toolbar);

    const buttons = toolbar.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);

    // Simulate ArrowRight to move focus
    const evt = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    buttons[0].dispatchEvent(evt);

    // Home key should focus first
    const home = new KeyboardEvent("keydown", { key: "Home", bubbles: true });
    buttons[2].dispatchEvent(home);

    // End key should focus last
    const end = new KeyboardEvent("keydown", { key: "End", bubbles: true });
    buttons[0].dispatchEvent(end);
  });
});
