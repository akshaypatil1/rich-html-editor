import { describe, it, expect, beforeEach } from "vitest";
import { _setDoc, _setUndoStack, _getUndoStack } from "../../core/state";
import {
  applyStandaloneCommand,
  handleToolbarCommand,
} from "../../core/formatActions";

describe("formatActions", () => {
  beforeEach(() => {
    // use the test runner's global document so selection APIs are available
    _setDoc(document as any);
    _setUndoStack([]);
    document.body.innerHTML = "";
  });

  it("wraps selected text with strong for bold", () => {
    document.body.innerHTML = "<p>hello world</p>";
    const text = document.body.querySelector("p")!.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 5);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("bold");

    const strong = document.body.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong!.textContent).toBe("hello");
  });

  it("applies numeric fontSize as px", () => {
    document.body.innerHTML = "<p>size me</p>";
    const text = document.body.querySelector("p")!.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 4);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("fontSize", "16");

    const span = document.body.querySelector("span");
    expect(span).not.toBeNull();
    expect((span as HTMLElement).style.fontSize).toBe("16px");
  });

  it("creates an anchor for link command and sanitizes URL", () => {
    document.body.innerHTML = "<p>click</p>";
    const text = document.body.querySelector("p")!.firstChild as Text;
    const range = document.createRange();
    range.selectNodeContents(text);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("link", "example.com");

    const a = document.body.querySelector("a")!;
    expect(a).not.toBeNull();
    expect(a.getAttribute("href")).toBe("https://example.com");
    expect(a.textContent).toBe("click");
  });

  it("align sets textAlign on block ancestor", () => {
    document.body.innerHTML = "<p id=para>aligned text</p>";
    const p = document.getElementById("para")!;
    const text = p.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 1);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("align", "center");

    expect((p as HTMLElement).style.textAlign).toBe("center");
  });

  it("formatBlock replaces block with requested tag", () => {
    document.body.innerHTML = "<p id=blk>title</p>";
    const p = document.getElementById("blk")!;
    const text = p.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 1);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("formatBlock", "h2");

    const h2 = document.body.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2!.textContent).toBe("title");
  });

  it("unorderedList wraps collapsed selection into a ul>li", () => {
    document.body.innerHTML = "<div></div>";
    const div = document.body.querySelector("div")!;
    const range = document.createRange();
    range.setStart(div, 0);
    range.collapse(true);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("unorderedList");

    const ul = document.body.querySelector("ul");
    expect(ul).not.toBeNull();
    expect(ul!.querySelector("li")).not.toBeNull();
  });

  it("toggleList unwraps existing list when same type", () => {
    // create a ul with one li
    document.body.innerHTML = "<ul><li id=li>item</li></ul>";
    const li = document.getElementById("li")!;
    const text = li.firstChild as Text;
    const range = document.createRange();
    range.selectNodeContents(text);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    applyStandaloneCommand("unorderedList");

    // should be unwrapped to paragraphs
    expect(document.body.querySelector("ul")).toBeNull();
    expect(document.body.querySelector("p")).not.toBeNull();
  });

  it("handleToolbarCommand prompts for link and applies sanitized link", () => {
    // mock prompt
    const orig = (window as any).prompt;
    (window as any).prompt = () => "example.com";

    document.body.innerHTML = "<p>linkme</p>";
    const text = document.body.querySelector("p")!.firstChild as Text;
    const range = document.createRange();
    range.selectNodeContents(text);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    handleToolbarCommand("link");

    const a = document.body.querySelector("a")!;
    expect(a).not.toBeNull();
    expect(a.getAttribute("href")).toBe("https://example.com");

    // restore
    (window as any).prompt = orig;
  });
});
