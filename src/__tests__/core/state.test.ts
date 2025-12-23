import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  _setDoc,
  _getDoc,
  _setUndoStack,
  _getUndoStack,
  _setRedoStack,
  _getRedoStack,
  _setCurrentEditable,
  _getCurrentEditable,
  pushStandaloneSnapshot,
  setMaxStackSize,
} from "../../core/state";

describe("State Management", () => {
  let mockDoc: Document;

  beforeEach(() => {
    // Reset state
    _setDoc(null);
    _setUndoStack([]);
    _setRedoStack([]);
    _setCurrentEditable(null);

    // Create mock document
    mockDoc = document.implementation.createHTMLDocument();
  });

  describe("Document Management", () => {
    it("should set and get document", () => {
      _setDoc(mockDoc);
      expect(_getDoc()).toBe(mockDoc);
    });

    it("should handle null document", () => {
      _setDoc(null);
      expect(_getDoc()).toBeNull();
    });
  });

  describe("Undo Stack Management", () => {
    it("should set and get undo stack", () => {
      const stack = ["<p>test</p>"];
      _setUndoStack(stack);
      expect(_getUndoStack()).toEqual(stack);
    });

    it("should start with empty undo stack", () => {
      expect(_getUndoStack()).toEqual([]);
    });

    it("should handle multiple snapshots in undo stack", () => {
      const stack = ["<p>test1</p>", "<p>test2</p>", "<p>test3</p>"];
      _setUndoStack(stack);
      expect(_getUndoStack()).toHaveLength(3);
    });
  });

  describe("Redo Stack Management", () => {
    it("should set and get redo stack", () => {
      const stack = ["<p>redo1</p>"];
      _setRedoStack(stack);
      expect(_getRedoStack()).toEqual(stack);
    });

    it("should start with empty redo stack", () => {
      expect(_getRedoStack()).toEqual([]);
    });
  });

  describe("Current Editable Element", () => {
    it("should set and get current editable element", () => {
      const element = document.createElement("p");
      _setCurrentEditable(element);
      expect(_getCurrentEditable()).toBe(element);
    });

    it("should handle null editable element", () => {
      _setCurrentEditable(null);
      expect(_getCurrentEditable()).toBeNull();
    });

    it("should update editable element", () => {
      const el1 = document.createElement("p");
      const el2 = document.createElement("div");

      _setCurrentEditable(el1);
      expect(_getCurrentEditable()).toBe(el1);

      _setCurrentEditable(el2);
      expect(_getCurrentEditable()).toBe(el2);
    });
  });

  describe("Snapshot Management", () => {
    it("should push snapshot to undo stack", () => {
      _setDoc(mockDoc);
      mockDoc.body.innerHTML = "<p>test</p>";

      _setUndoStack([]);
      pushStandaloneSnapshot();

      expect(_getUndoStack().length).toBeGreaterThan(0);
    });

    it("should not push duplicate snapshots", () => {
      _setDoc(mockDoc);
      mockDoc.body.innerHTML = "<p>test</p>";

      _setUndoStack([]);
      pushStandaloneSnapshot();
      const firstLength = _getUndoStack().length;

      pushStandaloneSnapshot();
      expect(_getUndoStack().length).toBe(firstLength);
    });

    it("should clear redo stack when pushing new snapshot", () => {
      _setDoc(mockDoc);
      _setRedoStack(["<p>old</p>"]);

      mockDoc.body.innerHTML = "<p>new</p>";
      pushStandaloneSnapshot();

      expect(_getRedoStack()).toEqual([]);
    });

    it("should not clear redo stack when clearRedo is false", () => {
      _setDoc(mockDoc);
      _setRedoStack(["<p>old</p>"]);

      mockDoc.body.innerHTML = "<p>new</p>";
      pushStandaloneSnapshot(false);

      expect(_getRedoStack()).toEqual(["<p>old</p>"]);
    });

    it("should respect max stack size", () => {
      _setDoc(mockDoc);
      setMaxStackSize(5);

      _setUndoStack([]);
      for (let i = 0; i < 10; i++) {
        mockDoc.body.innerHTML = `<p>test${i}</p>`;
        pushStandaloneSnapshot();
      }

      expect(_getUndoStack().length).toBeLessThanOrEqual(5);
    });
  });

  describe("Max Stack Size", () => {
    it("should set max stack size", () => {
      setMaxStackSize(30);
      _setDoc(mockDoc);
      _setUndoStack([]);

      for (let i = 0; i < 50; i++) {
        mockDoc.body.innerHTML = `<p>${i}</p>`;
        pushStandaloneSnapshot();
      }

      expect(_getUndoStack().length).toBeLessThanOrEqual(30);
    });

    it("should handle minimum stack size of 1", () => {
      setMaxStackSize(0);
      _setDoc(mockDoc);
      _setUndoStack([]);

      mockDoc.body.innerHTML = "<p>test</p>";
      pushStandaloneSnapshot();

      expect(_getUndoStack().length).toBeGreaterThanOrEqual(1);
    });
  });
});
