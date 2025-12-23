import { describe, it, expect, beforeEach } from "vitest";
import {
  _setDoc,
  pushStandaloneSnapshot,
  _getUndoStack,
} from "../../core/state";

describe("Sanitization", () => {
  beforeEach(() => {
    // setup a simple document
    const doc = document.implementation.createHTMLDocument("test");
    _setDoc(doc as any);
  });

  it("should strip script tags and on* attributes from snapshots", () => {
    const doc = document as unknown as Document;
    doc.body.innerHTML =
      '<div><img src="x" onerror="alert(1)"></div><script>window.hacked = true;</script>';
    pushStandaloneSnapshot();
    const snap = _getUndoStack()[_getUndoStack().length - 1];
    expect(snap).not.toContain("<script>");
    expect(snap).not.toContain("onerror=");
  });
});
