import { describe, it, expect } from "vitest";
import {
  initRichEditor,
  getCleanHTML,
  editorEventEmitter,
  getEditorEventEmitter,
} from "../../";

describe("exports: index entry", () => {
  it("exports editor API and event emitter", () => {
    expect(typeof initRichEditor).toBe("function");
    expect(typeof getCleanHTML).toBe("function");
    expect(typeof editorEventEmitter).toBe("object");
    expect(typeof getEditorEventEmitter).toBe("function");
  });
});
