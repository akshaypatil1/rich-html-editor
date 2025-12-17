import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initRichEditor, getCleanHTML } from "../core/editor";
import { _setDoc, _getDoc, _setUndoStack, _setRedoStack } from "../core/state";

describe("Rich Editor Core", () => {
  let mockIframe: HTMLIFrameElement;
  let mockDoc: Document;

  beforeEach(() => {
    // Reset state
    _setDoc(null);
    _setUndoStack([]);
    _setRedoStack([]);

    // Create mock iframe with content document
    mockDoc = document.implementation.createHTMLDocument("Test Document");
    mockDoc.body.innerHTML = "<p>Test content</p>";

    // Create mock iframe
    mockIframe = document.createElement("iframe");
    Object.defineProperty(mockIframe, "contentDocument", {
      value: mockDoc,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up
    _setDoc(null);
    vi.clearAllMocks();
  });

  describe("initRichEditor", () => {
    it("should initialize editor with valid iframe", () => {
      expect(() => initRichEditor(mockIframe)).not.toThrow();
      expect(_getDoc()).toBe(mockDoc);
    });

    it("should throw on invalid iframe", () => {
      const invalidIframe = document.createElement("div") as any;
      expect(() => initRichEditor(invalidIframe)).toThrow();
    });

    it("should throw when contentDocument is inaccessible", () => {
      const iframeWithoutDoc = document.createElement("iframe");
      Object.defineProperty(iframeWithoutDoc, "contentDocument", {
        value: null,
      });

      expect(() => initRichEditor(iframeWithoutDoc)).toThrow();
    });

    it("should initialize undo/redo stacks", () => {
      initRichEditor(mockIframe);
      expect(_getDoc()).toBeDefined();
    });

    it("should inject toolbar into document", () => {
      initRichEditor(mockIframe);
      const toolbar = mockDoc.getElementById("editor-toolbar");
      expect(toolbar).toBeDefined();
    });

    it("should inject styles into document", () => {
      initRichEditor(mockIframe);
      const styles = mockDoc.getElementById("editor-styles");
      expect(styles).toBeDefined();
    });

    it("should setup event handlers", () => {
      const addEventListenerSpy = vi.spyOn(mockDoc, "addEventListener");
      initRichEditor(mockIframe);
      expect(addEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe("getCleanHTML", () => {
    it("should return empty string before initialization", () => {
      _setDoc(null);
      expect(getCleanHTML()).toBe("");
    });

    it("should return HTML with DOCTYPE after initialization", () => {
      initRichEditor(mockIframe);
      const html = getCleanHTML();
      expect(html).toMatch(/^<!doctype html>\n/i);
    });

    it("should include document content", () => {
      mockDoc.body.innerHTML = "<p>Hello World</p>";
      initRichEditor(mockIframe);
      const html = getCleanHTML();
      expect(html).toContain("Hello World");
    });

    it("should throw on document without documentElement", () => {
      const brokenDoc = document.implementation.createHTMLDocument();
      Object.defineProperty(brokenDoc, "documentElement", { value: null });
      _setDoc(brokenDoc as any);

      expect(() => getCleanHTML()).toThrow();
    });

    it("should preserve HTML structure", () => {
      mockDoc.body.innerHTML = "<div><p>Test</p><span>Content</span></div>";
      initRichEditor(mockIframe);
      const html = getCleanHTML();
      expect(html).toContain("<div>");
      expect(html).toContain("<p>Test</p>");
      expect(html).toContain("<span>Content</span>");
    });
  });

  describe("Error Handling", () => {
    it("should catch and log initialization errors", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const brokenIframe = document.createElement("iframe");
      Object.defineProperty(brokenIframe, "contentDocument", {
        value: null,
      });

      try {
        initRichEditor(brokenIframe);
      } catch (e) {
        // Expected
      }

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it("should warn when getCleanHTML called before init", () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      _setDoc(null);
      getCleanHTML();
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe("Integration", () => {
    it("should initialize and then export HTML", () => {
      initRichEditor(mockIframe);
      mockDoc.body.innerHTML = "<p>Exported content</p>";

      const html = getCleanHTML();
      expect(html).toContain("Exported content");
      expect(html).toMatch(/^<!doctype html>\n/i);
    });

    it("should handle multiple initialization attempts", () => {
      const iframe2 = document.createElement("iframe");
      const doc2 = document.implementation.createHTMLDocument("Doc 2");
      Object.defineProperty(iframe2, "contentDocument", { value: doc2 });

      initRichEditor(mockIframe);
      initRichEditor(iframe2);

      // Should be switched to second document
      expect(_getDoc()).toBe(doc2);
    });
  });
});
