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

  it("clearFormat removes editor-applied inline formatting and converts headings to paragraphs", () => {
    document.body.innerHTML = "<p id=blk>Clear Me</p>";
    const p = document.getElementById("blk")!;
    const text = p.firstChild as Text;

    // select all and apply multiple editor commands which mark elements
    const sel = document.getSelection()!;

    const range1 = document.createRange();
    range1.selectNodeContents(text);
    sel.removeAllRanges();
    sel.addRange(range1);
    applyStandaloneCommand("bold");

    // re-select and apply font size and color (creates spans)
    const range2 = document.createRange();
    range2.selectNodeContents(p);
    sel.removeAllRanges();
    sel.addRange(range2);
    applyStandaloneCommand("fontSize", "18");
    applyStandaloneCommand("foreColor", "#ff0000");

    // convert block to heading (will be marked)
    const range3 = document.createRange();
    range3.setStart(text, 0);
    range3.setEnd(text, text.length);
    sel.removeAllRanges();
    sel.addRange(range3);
    applyStandaloneCommand("formatBlock", "h2");

    // ensure heading and formatting nodes exist
    expect(document.body.querySelector("h2")).not.toBeNull();
    expect(document.body.querySelector("strong")).not.toBeNull();
    expect(document.body.querySelector("span")).not.toBeNull();

    // select heading contents and clear formatting
    const h = document.body.querySelector("h2")!;
    const r = document.createRange();
    r.selectNodeContents(h);
    sel.removeAllRanges();
    sel.addRange(r);

    applyStandaloneCommand("clearFormat");

    // after clearing, no strong/span/heading should remain; content should be a paragraph
    expect(document.body.querySelector("strong")).toBeNull();
    expect(document.body.querySelector("span")).toBeNull();
    expect(document.body.querySelector("h2")).toBeNull();
    const newP = document.body.querySelector("p");
    expect(newP).not.toBeNull();
    expect(newP!.textContent).toBe("Clear Me");
  });
});
