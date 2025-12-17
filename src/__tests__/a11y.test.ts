import { describe, it, expect } from "vitest";
import axe from "axe-core";
import { initRichEditor } from "../core/editor";

describe("Accessibility (a11y) checks", () => {
  it("toolbar should have no critical a11y violations", async () => {
    // Create an iframe and a same-origin document for testing
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);

    const mockDoc = document.implementation.createHTMLDocument("A11y Doc");
    // Provide minimal document metadata required by axe
    mockDoc.title = "A11y Doc";
    if (mockDoc.documentElement)
      mockDoc.documentElement.setAttribute("lang", "en");
    // Ensure a real <title> element exists in head (axe checks for this)
    const titleEl = mockDoc.createElement("title");
    titleEl.textContent = "A11y Doc";
    mockDoc.head.appendChild(titleEl);
    mockDoc.body.innerHTML = '<div class="editable">Edit me</div>';

    Object.defineProperty(iframe, "contentDocument", {
      value: mockDoc,
      writable: true,
    });

    // Initialize editor which injects toolbar and styles
    initRichEditor(iframe as any);

    // Run axe on the iframe body only to focus on toolbar and UI elements
    const results: any = await new Promise((resolve, reject) => {
      (axe as any).run(
        iframe.contentDocument!.body,
        {},
        (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        }
      );
    });

    // Fail test if any violations with impact 'critical' or 'serious'
    const bad = results.violations.filter((v: any) => {
      return (
        v.impact === "critical" ||
        v.impact === "serious" ||
        v.nodes.some((n: any) => n.impact === "critical")
      );
    });

    if (bad.length) {
      // For debugging, print violations
      // eslint-disable-next-line no-console
      console.error("A11y violations:", JSON.stringify(bad, null, 2));
    }

    expect(bad.length).toBe(0);

    document.body.removeChild(iframe);
  });
});
