import { describe, it, expect, vi, beforeEach } from "vitest";
import { injectToolbar } from "../../toolbar/render";
import { TOOLBAR_ID } from "../../core/constants";

describe("toolbar.render injectToolbar (render.ts)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("creates toolbar container with role and aria-label and inserts at body start", () => {
    const onCommand = vi.fn();
    injectToolbar(document, {
      onCommand: onCommand as any,
      canUndo: () => false,
      canRedo: () => false,
      onUndo: () => undefined,
      onRedo: () => undefined,
      getFormatState: () => ({ bold: false, italic: false, underline: false }),
      getSelectedElementInfo: () => null,
    });

    const toolbar = document.getElementById(TOOLBAR_ID);
    expect(toolbar).not.toBeNull();
    expect(toolbar!.getAttribute("role")).toBe("toolbar");
    expect(toolbar!.getAttribute("aria-label")).toBe(
      "Rich text editor toolbar",
    );
    // ensure inserted as first child of either body or the editor root
    const root = document.getElementById("rhe-editor-root");
    const firstChildIsToolbar =
      document.body.firstChild === toolbar ||
      (root && root.firstChild === toolbar);
    expect(firstChildIsToolbar).toBe(true);
  });
});
