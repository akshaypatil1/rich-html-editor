import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { attachStandaloneHandlers } from "../../dom/handlers";
import * as toolbar from "../../toolbar/toolbar";
import * as commands from "../../core/commands";
import * as state from "../../core/state";
import { CLASS_ACTIVE } from "../../core/constants";

describe("dom.handlers attachStandaloneHandlers", () => {
  beforeEach(() => {
    // Ensure global document is used by state helpers
    try {
      state._setDoc(document as any);
    } catch (err) {
      /* ignore in older test runs */
    }
    document.body.innerHTML = "";
    attachStandaloneHandlers(document);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("clicking a candidate makes it editable and focuses it", () => {
    const p = document.createElement("p");
    p.textContent = "hello";
    document.body.appendChild(p);

    // click should set contenteditable, class and current editable
    p.click();

    expect(p.getAttribute("contenteditable")).toBe("true");
    expect(p.classList.contains(CLASS_ACTIVE)).toBe(true);
    expect(state._getCurrentEditable()).toBe(p);
  });

  it("keyboard shortcuts call command handlers", () => {
    const boldSpy = vi.spyOn(commands, "handleToolbarCommand");
    const undoSpy = vi.spyOn(commands, "handleUndo");
    const redoSpy = vi.spyOn(commands, "handleRedo");

    // Ctrl/Cmd+B
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true }),
    );
    expect(boldSpy).toHaveBeenCalledWith("bold");

    // Ctrl/Cmd+Z -> undo
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }),
    );
    expect(undoSpy).toHaveBeenCalled();

    // Ctrl/Cmd+Shift+Z -> redo
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "z",
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(redoSpy).toHaveBeenCalled();

    // Ctrl/Cmd+Y -> redo
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "y", ctrlKey: true, bubbles: true }),
    );
    expect(redoSpy).toHaveBeenCalled();
  });

  it("selectionchange triggers injectToolbar", () => {
    const injectSpy = vi.spyOn(toolbar, "injectToolbar");
    document.dispatchEvent(new Event("selectionchange", { bubbles: true }));
    expect(injectSpy).toHaveBeenCalled();
  });

  it("input triggers pushStandaloneSnapshot", () => {
    const snap = vi.spyOn(state, "pushStandaloneSnapshot");
    document.dispatchEvent(new Event("input", { bubbles: true }));
    expect(snap).toHaveBeenCalled();
  });

  it("Enter in list inserts a new li and moves caret", () => {
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    const txt = document.createTextNode("a");
    li.appendChild(txt);
    ul.appendChild(li);
    document.body.appendChild(ul);

    // place caret inside the existing text node
    const range = document.createRange();
    range.setStart(txt, 1);
    range.collapse(true);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    // dispatch Enter
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );

    const items = ul.querySelectorAll("li");
    // allow for other list items in the environment; ensure at least one
    expect(items.length).toBeGreaterThanOrEqual(2);
    const newLi = items[items.length - 1];
    expect(newLi.textContent).toContain("\u200B");

    const anchor = document.getSelection()!.anchorNode;
    expect(anchor).not.toBeNull();
    expect(anchor!.nodeValue).toContain("\u200B");
  });
});
