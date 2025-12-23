import { describe, it, expect, beforeEach } from "vitest";
import { computeFormatState, getElementLabel } from "../../dom/format";

describe("dom.format computeFormatState & getElementLabel", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns defaults when no selection", () => {
    const state = computeFormatState(document);
    expect(state.bold).toBe(false);
    expect(state.italic).toBe(false);
    expect(state.underline).toBe(false);
    expect(state.formatBlock).toBeNull();
  });

  it("detects bold/italic/underline by tags and list context", () => {
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.innerHTML = "<strong><em><u>text</u></em></strong>";
    ul.appendChild(li);
    document.body.appendChild(ul);

    // place selection inside the text node
    const tn = li.querySelector("u")!.firstChild as Node;
    const range = document.createRange();
    range.setStart(tn, 0);
    range.collapse(true);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    const state = computeFormatState(document);
    expect(state.bold).toBe(true);
    expect(state.italic).toBe(true);
    expect(state.underline).toBe(true);
    expect(state.listType).toBe("ul");
    expect(state.formatBlock).toBe("li");
  });

  it("detects font attributes via computed style and element label formatting", () => {
    const p = document.createElement("p");
    p.id = "intro";
    p.className = "highlight important";
    p.style.fontFamily = "Arial";
    p.style.fontSize = "16px";
    p.style.color = "rgb(10,20,30)";
    p.textContent = "hi";
    document.body.appendChild(p);

    // select inside p
    const tn = p.firstChild as Node;
    const range = document.createRange();
    range.setStart(tn, 0);
    range.collapse(true);
    const sel = document.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);

    const state = computeFormatState(document);
    expect(state.fontName).toContain("Arial");
    expect(state.fontSize).toContain("16px");
    expect(state.foreColor).not.toBeNull();

    const label = getElementLabel(p);
    expect(label).toBe("p#intro.highlight");
  });
});
