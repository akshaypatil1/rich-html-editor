import { describe, it, expect } from "vitest";
import {
  _setDoc,
  _setUndoStack,
  pushStandaloneSnapshot,
  setMaxStackSize,
  _getUndoStack,
} from "../../core/state";

describe("State additional behaviours", () => {
  it("respects custom max stack size", () => {
    const mockDoc = document.implementation.createHTMLDocument();
    _setDoc(mockDoc);
    setMaxStackSize(20);
    _setUndoStack([]);

    for (let i = 0; i < 100; i++) {
      mockDoc.body.innerHTML = `<p>${i}</p>`;
      pushStandaloneSnapshot();
    }

    expect(_getUndoStack().length).toBeLessThanOrEqual(20);
  });

  it("does not grow unbounded with many edits", () => {
    const mockDoc = document.implementation.createHTMLDocument();
    _setDoc(mockDoc);
    setMaxStackSize(60);
    _setUndoStack([]);

    // Simulate 500 edits
    for (let i = 0; i < 500; i++) {
      mockDoc.body.innerHTML = `<p>Edit ${i}</p>`;
      pushStandaloneSnapshot();
    }

    const stack = _getUndoStack();
    // Should stay within limit
    expect(stack.length).toBeLessThanOrEqual(60);
  });
});
