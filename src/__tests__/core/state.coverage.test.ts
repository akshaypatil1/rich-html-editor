import { describe, test, expect, beforeEach } from "vitest";
import {
  _setDoc,
  _getDoc,
  _getUndoStack,
  _getRedoStack,
  pushStandaloneSnapshot,
  setMaxStackSize,
  _setUndoStack,
  _setRedoStack,
} from "../../core/state";
import {
  TOOLBAR_ID,
  STYLE_ID,
  CLASS_EDITABLE,
  CLASS_ACTIVE,
} from "../../core/constants";

describe("core/state pushStandaloneSnapshot edge cases", () => {
  beforeEach(() => {
    // reset doc and stacks between tests
    _setDoc(null as any);
    _setUndoStack([]);
    _setRedoStack([]);
    setMaxStackSize(60);
  });

  test("no document set does nothing", () => {
    _setDoc(null as any);
    pushStandaloneSnapshot();
    expect(_getUndoStack()).toHaveLength(0);
    expect(_getRedoStack()).toHaveLength(0);
  });

  test("removes toolbar/style and strips editable attributes, preserves script placeholder", () => {
    // build a document with toolbar, style, editable element and a script
    const doc = document.implementation.createHTMLDocument("test");
    const toolbar = doc.createElement("div");
    toolbar.id = TOOLBAR_ID;
    doc.body.appendChild(toolbar);
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    doc.head.appendChild(style);

    const editable = doc.createElement("div");
    editable.setAttribute("contenteditable", "true");
    editable.setAttribute("tabindex", "0");
    editable.classList.add(CLASS_EDITABLE, CLASS_ACTIVE);
    editable.setAttribute("data-rhe-id", "editable-1");
    const script = doc.createElement("script");
    script.textContent = "console.log('hi')";
    editable.appendChild(script);
    doc.body.appendChild(editable);

    _setDoc(doc as any);
    // seed redo stack to ensure it gets cleared
    _setRedoStack(["x"]);
    pushStandaloneSnapshot();

    const undo = _getUndoStack();
    expect(undo.length).toBeGreaterThan(0);
    const snap = undo[undo.length - 1];
    // toolbar and style should not be present in the saved snapshot
    expect(snap).not.toContain(TOOLBAR_ID);
    expect(snap).not.toContain(STYLE_ID);
    // editable attributes/classes removed
    expect(snap).not.toContain("contenteditable");
    expect(snap).not.toContain("tabindex");
    expect(snap).not.toContain(CLASS_EDITABLE);
    expect(snap).not.toContain(CLASS_ACTIVE);
    // placeholder for script should exist (data-rhe-script)
    expect(snap).toContain("data-rhe-script");
    // redo should be cleared
    expect(_getRedoStack()).toHaveLength(0);
  });

  test("clearRedo=false preserves redo stack and identical snaps are deduped", () => {
    const doc = document.implementation.createHTMLDocument("dedupe");
    const p = doc.createElement("p");
    p.textContent = "hello";
    doc.body.appendChild(p);
    _setDoc(doc as any);
    _setRedoStack(["keep-me"]);
    _setUndoStack([]);

    pushStandaloneSnapshot(false);
    expect(_getRedoStack()).toEqual(["keep-me"]);
    const lenAfterFirst = _getUndoStack().length;
    // call again with identical content, should not increase undo stack
    pushStandaloneSnapshot(false);
    expect(_getUndoStack()).toHaveLength(lenAfterFirst);
  });

  test("max stack size trimming works", () => {
    setMaxStackSize(2);
    const doc = document.implementation.createHTMLDocument("trim");
    _setDoc(doc as any);
    _setUndoStack([]);
    // push three different bodies
    for (const txt of ["a", "b", "c"]) {
      doc.body.innerHTML = `<p>${txt}</p>`;
      pushStandaloneSnapshot();
    }
    const u = _getUndoStack();
    expect(u.length).toBeLessThanOrEqual(2);
    // newest snapshot should contain 'c'
    expect(u[u.length - 1]).toContain("c");
  });

  test("script encoding fallback when btoa missing", () => {
    const doc = document.implementation.createHTMLDocument("btoa");
    const script = doc.createElement("script");
    const unicode = "π — привет";
    script.textContent = unicode;
    doc.body.appendChild(script);
    _setDoc(doc as any);
    // temporarily remove global btoa to force fallback
    const origBtoa = (global as any).btoa;
    try {
      (global as any).btoa = undefined;
      pushStandaloneSnapshot();
      const last = _getUndoStack()[_getUndoStack().length - 1];
      // find the data-rhe-script value in the snapshot
      const m = last.match(/data-rhe-script="([^\"]+)"/);
      expect(m).toBeTruthy();
      const encoded = decodeURIComponent(m![1]);
      expect(encoded).toBe(unicode);
    } finally {
      (global as any).btoa = origBtoa;
    }
  });
});
