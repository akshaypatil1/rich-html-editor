import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  _setDoc,
  _getDoc,
  _setUndoStack,
  _getUndoStack,
  _setRedoStack,
  _getRedoStack,
  pushStandaloneSnapshot,
  setMaxStackSize,
} from "../../core/state";

/**
 * Performance Tests
 *
 * These tests verify that the editor performs well with:
 * - Large HTML documents
 * - Many undo/redo operations
 * - Large snapshots
 * - Memory efficiency
 */

describe("Performance Tests", () => {
  let mockDoc: Document;

  beforeEach(() => {
    // Reset state
    _setDoc(null);
    _setUndoStack([]);
    _setRedoStack([]);
    setMaxStackSize(60);

    // Create mock document
    mockDoc = document.implementation.createHTMLDocument();
  });

  afterEach(() => {
    _setDoc(null);
  });

  describe("Large Document Handling", () => {
    it("should initialize editor with large document efficiently", () => {
      _setDoc(mockDoc);

      // Create 10KB of HTML content
      let html = "<div>";
      for (let i = 0; i < 100; i++) {
        html += `<p>Paragraph ${i}: This is a test paragraph with some content</p>`;
      }
      html += "</div>";

      mockDoc.body.innerHTML = html;

      const start = performance.now();
      pushStandaloneSnapshot();
      const duration = performance.now() - start;

      // Relaxed timing threshold to avoid CI flakiness
      expect(duration).toBeLessThan(200); // Should complete in under 200ms
      expect(_getDoc()).toBe(mockDoc);
    });

    it("should handle very large documents (100KB+)", () => {
      _setDoc(mockDoc);

      // Create 100KB+ of HTML content
      let html = "<div>";
      for (let i = 0; i < 1000; i++) {
        html += `<p>Paragraph ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`;
      }
      html += "</div>";

      mockDoc.body.innerHTML = html;

      const start = performance.now();
      pushStandaloneSnapshot();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500); // Should complete in under 500ms
      expect(_getDoc()).toBeDefined();
    });

    it("should extract HTML from large document efficiently", () => {
      _setDoc(mockDoc);

      // Create large document
      let html = "<div>";
      for (let i = 0; i < 500; i++) {
        html += `<p>Content ${i}</p>`;
      }
      html += "</div>";

      mockDoc.body.innerHTML = html;

      const start = performance.now();
      const _ = mockDoc.documentElement.outerHTML;
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200);
    });
  });

  describe("Undo/Redo Performance", () => {
    it("should handle many undo operations efficiently", () => {
      _setDoc(mockDoc);
      _setUndoStack([]);

      // Create 60 snapshots
      for (let i = 0; i < 60; i++) {
        mockDoc.body.innerHTML = `<p>${i}</p>`;
        pushStandaloneSnapshot();
      }

      expect(_getUndoStack().length).toBeLessThanOrEqual(60);

      // Measure undo operation speed
      const start = performance.now();
      for (let i = 0; i < 10; i++) {
        const stack = _getUndoStack();
        const _ = stack[stack.length - 1];
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100); // 10 operations should be < 100ms
    });

    it("should maintain memory efficiency with stack size limit", () => {
      _setDoc(mockDoc);
      setMaxStackSize(60);
      _setUndoStack([]);

      // Create 200 snapshots (should only keep last 60)
      for (let i = 0; i < 200; i++) {
        mockDoc.body.innerHTML = `<p>Snapshot ${i}</p>`;
        pushStandaloneSnapshot();
      }

      const stack = _getUndoStack();
      expect(stack.length).toBeLessThanOrEqual(60);

      // Verify stack contains recent snapshots
      const lastSnapshot = stack[stack.length - 1];
      expect(lastSnapshot).toContain("199");
    });

    it("should efficiently clear redo stack on new edit", () => {
      _setDoc(mockDoc);
      _setUndoStack(["<p>1</p>", "<p>2</p>", "<p>3</p>"]);
      _setRedoStack(["<p>4</p>", "<p>5</p>", "<p>6</p>"]);

      const start = performance.now();
      mockDoc.body.innerHTML = "<p>new</p>";
      pushStandaloneSnapshot();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
      expect(_getRedoStack().length).toBe(0);
    });
  });

  describe("Snapshot Comparison Performance", () => {
    it("should avoid duplicate snapshots efficiently", () => {
      _setDoc(mockDoc);
      _setUndoStack([]);

      mockDoc.body.innerHTML = "<p>Same content</p>";
      const start = performance.now();

      // Push same snapshot multiple times
      for (let i = 0; i < 10; i++) {
        pushStandaloneSnapshot();
      }

      const duration = performance.now() - start;

      // Should only have 1 snapshot (duplicates filtered)
      expect(_getUndoStack().length).toBe(1);
      // Relaxed timing threshold to avoid CI flakiness
      expect(duration).toBeLessThan(200);
    });

    it("should handle snapshot comparison with large documents", () => {
      _setDoc(mockDoc);
      _setUndoStack([]);

      // Create large document
      let html = "<div>";
      for (let i = 0; i < 100; i++) {
        html += `<p>Content ${i}</p>`;
      }
      html += "</div>";

      mockDoc.body.innerHTML = html;

      const start = performance.now();

      // Compare same large snapshot
      for (let i = 0; i < 5; i++) {
        pushStandaloneSnapshot();
      }

      const duration = performance.now() - start;

      expect(_getUndoStack().length).toBe(1);
      // Relaxed timing threshold to avoid CI flakiness
      expect(duration).toBeLessThan(200);
    });
  });

  describe("Memory Efficiency", () => {
    it("should not grow unbounded with many edits", () => {
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

      // Calculate approximate memory (rough estimate)
      // Each snapshot is roughly 25 bytes for content + overhead
      const totalMemory = stack.reduce((sum, snap) => sum + snap.length, 0);
      const estimatedKB = totalMemory / 1024;

      expect(estimatedKB).toBeLessThan(1000); // Less than 1MB for 60 snapshots
    });

    it("should respect custom max stack size", () => {
      _setDoc(mockDoc);
      setMaxStackSize(20);
      _setUndoStack([]);

      for (let i = 0; i < 100; i++) {
        mockDoc.body.innerHTML = `<p>${i}</p>`;
        pushStandaloneSnapshot();
      }

      expect(_getUndoStack().length).toBeLessThanOrEqual(20);
    });

    it("should handle large snapshots without excessive memory", () => {
      _setDoc(mockDoc);
      setMaxStackSize(10);
      _setUndoStack([]);

      // Create very large HTML documents
      for (let batch = 0; batch < 20; batch++) {
        let html = "<div>";
        for (let i = 0; i < 500; i++) {
          html += `<p>Item ${batch * 500 + i}: Lorem ipsum content</p>`;
        }
        html += "</div>";

        mockDoc.body.innerHTML = html;
        pushStandaloneSnapshot();
      }

      const stack = _getUndoStack();
      expect(stack.length).toBeLessThanOrEqual(10);

      // Each snapshot should still be processable
      expect(stack[stack.length - 1]).toContain("<p>");
    });
  });

  describe("Concurrent Operations", () => {
    beforeEach(() => {
      _setDoc(mockDoc);
      _setUndoStack([]);
    });

    it("should handle rapid succession of edits", () => {
      const start = performance.now();

      // Simulate rapid typing (50 edits in quick succession)
      for (let i = 0; i < 50; i++) {
        mockDoc.body.innerHTML = `<p>Type ${i}</p>`;
        pushStandaloneSnapshot();
      }

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500); // 50 operations in under 500ms
      expect(_getUndoStack().length).toBeGreaterThan(0);
    });

    it("should maintain consistency during heavy load", () => {
      // Mix of document changes and snapshot operations
      for (let i = 0; i < 100; i++) {
        mockDoc.body.innerHTML = `<div>${"<p>Content</p>".repeat(10)}</div>`;
        pushStandaloneSnapshot();

        // Every 10th operation, check stack integrity
        if (i % 10 === 0) {
          const stack = _getUndoStack();
          expect(stack.length).toBeGreaterThan(0);
          expect(stack[stack.length - 1]).toContain("<");
        }
      }

      expect(_getUndoStack().length).toBeGreaterThan(0);
    });
  });

  describe("Stress Tests", () => {
    beforeEach(() => {
      _setDoc(mockDoc);
      _setUndoStack([]);
    });

    it("should handle extreme document size", () => {
      // Create 1MB+ document
      let html = "<div>";
      for (let i = 0; i < 5000; i++) {
        html += `<p id="p${i}">Paragraph with id ${i} containing some text content</p>`;
      }
      html += "</div>";

      mockDoc.body.innerHTML = html;

      const start = performance.now();
      pushStandaloneSnapshot();
      const duration = performance.now() - start;

      // Relax threshold to account for slower CI/local environments
      expect(duration).toBeLessThan(2000); // Should complete in under ~2 seconds
      expect(_getUndoStack().length).toBe(1);
    });
  });

  describe("Benchmark Results", () => {
    it("should complete typical workflow in acceptable time", () => {
      _setDoc(mockDoc);
      _setUndoStack([]);

      const workflows = [
        // Create document with 50 paragraphs
        () => {
          let html = "<div>";
          for (let i = 0; i < 50; i++) {
            html += `<p>Paragraph ${i}</p>`;
          }
          html += "</div>";
          mockDoc.body.innerHTML = html;
          pushStandaloneSnapshot();
        },
        // Perform 10 edits
        () => {
          for (let i = 0; i < 10; i++) {
            mockDoc.body.innerHTML = `<p>Edit ${i}</p>`;
            pushStandaloneSnapshot();
          }
        },
      ];

      const start = performance.now();
      workflows.forEach((workflow) => workflow());
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(1000); // Typical workflow < 1 second
    });
  });
});
