import { describe, it, expect } from "vitest";
import { isEditableCandidate } from "../../dom/candidates";

describe("dom.candidates isEditableCandidate", () => {
  it("returns false for null", () => {
    expect(isEditableCandidate(null)).toBe(false);
  });

  it("disallows structural and form tags", () => {
    const tags = [
      "html",
      "head",
      "body",
      "script",
      "style",
      "link",
      "meta",
      "noscript",
      "input",
      "textarea",
      "select",
    ];
    tags.forEach((t) => {
      const el = document.createElement(t);
      expect(isEditableCandidate(el)).toBe(false);
    });
  });

  it("allows common content containers", () => {
    const tags = [
      "p",
      "div",
      "section",
      "article",
      "header",
      "footer",
      "span",
      "h1",
      "li",
      "pre",
      "code",
    ];
    tags.forEach((t) => {
      const el = document.createElement(t);
      expect(isEditableCandidate(el)).toBe(true);
    });
  });
});
