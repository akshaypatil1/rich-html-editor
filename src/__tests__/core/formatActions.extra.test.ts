import { describe, it, expect, beforeEach } from "vitest";
import { _setDoc, _setUndoStack } from "../../core/state";
import {
  applyStandaloneCommand,
  handleToolbarCommand,
} from "../../core/formatActions";

describe("formatActions extra branches", () => {
  beforeEach(() => {
    _setDoc(document as any);
    _setUndoStack([]);
    document.body.innerHTML = "";
  });

  it("applies fontName as font-family on span", () => {
    document.body.innerHTML = "<p>font test</p>";
    const text = document.querySelector("p")!.firstChild as Text;
    const r = document.createRange();
    r.setStart(text, 0);
    r.setEnd(text, 4);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("fontName", "Courier New");

    const span = document.body.querySelector("span") as HTMLElement;
    expect(span).not.toBeNull();
    // JSDOM may quote the font family string; normalize quotes for assertion
    expect(span.style.fontFamily.replace(/['\"]/g, "")).toBe("Courier New");
  });

  it("accepts non-numeric fontSize values unchanged", () => {
    document.body.innerHTML = "<p>size me</p>";
    const text = document.querySelector("p")!.firstChild as Text;
    const r = document.createRange();
    r.setStart(text, 0);
    r.setEnd(text, 4);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("fontSize", "larger");

    const span = document.body.querySelector("span") as HTMLElement;
    expect(span).not.toBeNull();
    expect(span.style.fontSize).toBe("larger");
  });

  it("align wraps selection when no block ancestor exists", () => {
    document.body.innerHTML = "<span id=s>text</span>";
    const text = document.getElementById("s")!.firstChild as Text;
    const r = document.createRange();
    r.selectNodeContents(text);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("align", "right");

    const div = document.body.querySelector("div") as HTMLElement;
    expect(div).not.toBeNull();
    expect(div.style.textAlign).toBe("right");
  });

  it("formatBlock wraps selection when no block ancestor (creates heading)", () => {
    document.body.innerHTML = "<span>Heading</span>";
    const text = document.querySelector("span")!.firstChild as Text;
    const r = document.createRange();
    r.selectNodeContents(text);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("formatBlock", "h3");

    const h3 = document.body.querySelector("h3");
    expect(h3).not.toBeNull();
    expect(h3!.textContent).toBe("Heading");
  });

  it("unorderedList wraps non-collapsed selection into a ul>li", () => {
    document.body.innerHTML = "<p>one</p>";
    const text = document.querySelector("p")!.firstChild as Text;
    const r = document.createRange();
    r.selectNodeContents(text);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("unorderedList");

    const ul = document.body.querySelector("ul");
    expect(ul).not.toBeNull();
    expect(ul!.querySelector("li")).not.toBeNull();
    expect(ul!.textContent).toBe("one");
  });

  it("applyStandaloneCommand is safe when no document is set", () => {
    // remove document
    _setDoc(null);
    expect(() => applyStandaloneCommand("bold")).not.toThrow();
    // restore
    _setDoc(document as any);
  });

  it("handleToolbarCommand no-ops for undo/redo", () => {
    expect(() => handleToolbarCommand("undo")).not.toThrow();
    expect(() => handleToolbarCommand("redo")).not.toThrow();
  });

  it("wrapSelectionWithElement on collapsed selection creates element", () => {
    document.body.innerHTML = "<div id=slot></div>";
    const slot = document.getElementById("slot")!;
    const r = document.createRange();
    r.setStart(slot, 0);
    r.collapse(true);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("bold");

    const strong = document.body.querySelector("strong");
    expect(strong).not.toBeNull();
  });
});
