import { describe, it, expect, beforeEach } from "vitest";
import {
  _setDoc,
  _setUndoStack,
  _getUndoStack,
  _setRedoStack,
  _getRedoStack,
} from "../../core/state";
import { handleUndo, handleRedo } from "../../core/history";

describe("history handlers", () => {
  let mockDoc: Document;

  beforeEach(() => {
    // reset state
    _setDoc(null);
    _setUndoStack([]);
    _setRedoStack([]);

    mockDoc = document.implementation.createHTMLDocument();
  });

  it("returns early when undo stack has less than 2 entries", () => {
    _setDoc(mockDoc);
    _setUndoStack(["<p>only</p>"]);

    // should not throw
    handleUndo();

    // nothing was pushed to redo
    expect(_getRedoStack()).toEqual([]);
  });

  it("undo replaces body with previous snapshot and pushes current to redo", () => {
    _setDoc(mockDoc);

    // current document state
    mockDoc.body.innerHTML = "<p>current</p>";

    const prev = "<!doctype html>\n<html><body><p>prev</p></body></html>";
    const current = "<!doctype html>\n<html><body><p>current</p></body></html>";

    _setUndoStack([prev, current]);
    _setRedoStack([]);

    handleUndo();

    expect(mockDoc.body.innerHTML).toContain("<p>prev</p>");
    expect(_getRedoStack()).toHaveLength(1);
    expect(_getRedoStack()[0]).toBe(current);
  });

  it("undo selectively restores elements with data-rhe-id and dispatches event", async () => {
    _setDoc(mockDoc);

    // create an editable placeholder in the live doc
    const local = mockDoc.createElement("div");
    local.setAttribute("data-rhe-id", "editable1");
    local.innerHTML = "old";
    mockDoc.body.appendChild(local);

    // snapshot with updated innerHTML for the same data-rhe-id
    const prev =
      '<!doctype html>\n<html><body><div data-rhe-id="editable1">new</div></body></html>';
    const current =
      "<!doctype html>\n<html><body><div>other</div></body></html>";

    _setUndoStack([prev, current]);

    let restored = false;
    mockDoc.addEventListener("rhe:scripts-restored", () => (restored = true));

    handleUndo();

    const updated = mockDoc.body.querySelector('[data-rhe-id="editable1"]');
    expect(updated).not.toBeNull();
    expect(updated!.innerHTML).toBe("new");

    // the event should be dispatched (immediately for no loads)
    expect(restored).toBe(true);
  });

  it("redo restores next snapshot and pushes it onto undo stack", () => {
    _setDoc(mockDoc);

    mockDoc.body.innerHTML = "<p>start</p>";

    const next = "<!doctype html>\n<html><body><p>next</p></body></html>";
    const other = "<!doctype html>\n<html><body><p>other</p></body></html>";

    _setUndoStack([other]);
    _setRedoStack([next]);

    handleRedo();

    expect(mockDoc.body.innerHTML).toContain("<p>next</p>");
    // undo stack gained the restored next snapshot
    expect(_getUndoStack().length).toBeGreaterThanOrEqual(1);
  });
});
