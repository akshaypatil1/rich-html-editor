import { describe, it, expect, beforeEach, vi } from "vitest";
import { injectToolbar } from "../../toolbar/toolbar";
import { _setDoc } from "../../core/state";

describe("toolbar.render injectToolbar", () => {
  beforeEach(() => {
    // ensure global document used
    _setDoc(document as any);
    document.body.innerHTML = "";
  });

  it("inserts toolbar and wires undo/redo handlers", () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    const onCommand = vi.fn();

    injectToolbar(document, {
      onCommand: onCommand as any,
      canUndo: () => true,
      canRedo: () => true,
      onUndo,
      onRedo,
      getFormatState: () => ({ bold: false, italic: false, underline: false }),
      getSelectedElementInfo: () => null,
    });

    const toolbar = document.getElementById("editor-toolbar");
    expect(toolbar).not.toBeNull();

    const undoBtn =
      toolbar!.querySelector<HTMLButtonElement>("button[title=Undo]");
    const redoBtn =
      toolbar!.querySelector<HTMLButtonElement>("button[title=Redo]");

    expect(undoBtn).not.toBeNull();
    expect(redoBtn).not.toBeNull();

    // click undo should call onUndo
    undoBtn!.click();
    expect(onUndo).toHaveBeenCalled();

    // redo is disabled via canRedo false, but clicking still triggers onRedo
    redoBtn!.click();
    expect(onRedo).toHaveBeenCalled();
  });

  it("buttons call onCommand and selects trigger commands", () => {
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

    const toolbar = document.getElementById("editor-toolbar")!;

    // Bold button
    const boldBtn =
      toolbar.querySelector<HTMLButtonElement>("button[title=Bold]");
    expect(boldBtn).not.toBeNull();
    boldBtn!.click();
    expect(onCommand).toHaveBeenCalledWith("bold", undefined);

    // Size select -> trigger onchange
    const sizeSelect =
      toolbar.querySelector<HTMLSelectElement>("select[title=Size]");
    expect(sizeSelect).not.toBeNull();
    // choose a value (second option)
    sizeSelect!.value = "16";
    sizeSelect!.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onCommand).toHaveBeenCalledWith("fontSize", "16");

    // Color input change triggers onCommand via onchange
    const colorInput = toolbar.querySelector<HTMLInputElement>(
      "input[title='Text color']"
    );
    if (colorInput) {
      colorInput.value = "#ff0000";
      colorInput.dispatchEvent(new Event("change", { bubbles: true }));
      expect(onCommand).toHaveBeenCalledWith("foreColor", "#ff0000");
    }
  });
});
