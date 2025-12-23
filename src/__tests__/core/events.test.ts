import { describe, it, expect, beforeEach } from "vitest";
import { EditorEventEmitter } from "../../core/events";
import type { EditorEventType } from "../../core/types";

describe("EditorEventEmitter", () => {
  let emitter: EditorEventEmitter;

  beforeEach(() => {
    emitter = new EditorEventEmitter();
  });

  describe("Event Subscription", () => {
    it("should subscribe to events", () => {
      const handler = () => {};
      emitter.on("contentChanged", handler);
      expect(emitter.listenerCount("contentChanged")).toBe(1);
    });

    it("should return unsubscribe function", () => {
      const handler = () => {};
      const unsubscribe = emitter.on("contentChanged", handler);

      expect(emitter.listenerCount("contentChanged")).toBe(1);
      unsubscribe();
      expect(emitter.listenerCount("contentChanged")).toBe(0);
    });

    it("should allow multiple listeners for same event", () => {
      emitter.on("contentChanged", () => {});
      emitter.on("contentChanged", () => {});
      expect(emitter.listenerCount("contentChanged")).toBe(2);
    });

    it("should subscribe with once", () => {
      const handler = () => {};
      emitter.once("contentChanged", handler);
      expect(emitter.listenerCount("contentChanged")).toBe(1);

      emitter.emit({
        type: "contentChanged",
        timestamp: Date.now(),
      });

      expect(emitter.listenerCount("contentChanged")).toBe(0);
    });
  });

  describe("Event Emission", () => {
    it("should emit events to listeners", () => {
      let called = false;
      emitter.on("contentChanged", () => {
        called = true;
      });

      emitter.emit({
        type: "contentChanged",
        timestamp: Date.now(),
      });

      expect(called).toBe(true);
    });

    it("should pass event data to listeners", () => {
      let receivedData: any = null;
      emitter.on("contentChanged", (event) => {
        receivedData = event.data;
      });

      emitter.emit({
        type: "contentChanged",
        timestamp: Date.now(),
        data: { htmlLength: 100 },
      });

      expect(receivedData).toEqual({ htmlLength: 100 });
    });

    it("should emit to all listeners", () => {
      let count = 0;
      emitter.on("contentChanged", () => count++);
      emitter.on("contentChanged", () => count++);
      emitter.on("contentChanged", () => count++);

      emitter.emit({
        type: "contentChanged",
        timestamp: Date.now(),
      });

      expect(count).toBe(3);
    });

    it("should not emit to unsubscribed listeners", () => {
      let count = 0;
      const handler = () => count++;

      const unsubscribe = emitter.on("contentChanged", handler);
      unsubscribe();

      emitter.emit({
        type: "contentChanged",
        timestamp: Date.now(),
      });

      expect(count).toBe(0);
    });

    it("should not emit to wrong event type", () => {
      let called = false;
      emitter.on("contentChanged", () => {
        called = true;
      });

      emitter.emit({
        type: "selectionChanged",
        timestamp: Date.now(),
      });

      expect(called).toBe(false);
    });
  });

  describe("Event Unsubscription", () => {
    it("should unsubscribe from events", () => {
      const handler = () => {};
      emitter.on("contentChanged", handler);
      emitter.off("contentChanged", handler);
      expect(emitter.listenerCount("contentChanged")).toBe(0);
    });

    it("should only unsubscribe specific handler", () => {
      const handler1 = () => {};
      const handler2 = () => {};
      emitter.on("contentChanged", handler1);
      emitter.on("contentChanged", handler2);

      emitter.off("contentChanged", handler1);
      expect(emitter.listenerCount("contentChanged")).toBe(1);
    });

    it("should remove all listeners for event type", () => {
      emitter.on("contentChanged", () => {});
      emitter.on("contentChanged", () => {});
      emitter.on("undoStateChanged", () => {});

      emitter.removeAllListeners("contentChanged");

      expect(emitter.listenerCount("contentChanged")).toBe(0);
      expect(emitter.listenerCount("undoStateChanged")).toBe(1);
    });

    it("should remove all listeners globally", () => {
      emitter.on("contentChanged", () => {});
      emitter.on("undoStateChanged", () => {});
      emitter.on("redoStateChanged", () => {});

      emitter.removeAllListeners();

      expect(emitter.listenerCount("contentChanged")).toBe(0);
      expect(emitter.listenerCount("undoStateChanged")).toBe(0);
      expect(emitter.listenerCount("redoStateChanged")).toBe(0);
    });
  });

  describe("Error Handling", () => {
    it("should handle handler errors gracefully", () => {
      const errorHandler = () => {
        throw new Error("Handler error");
      };
      const successHandler = () => {};

      emitter.on("contentChanged", errorHandler);
      emitter.on("contentChanged", successHandler);

      let successCalled = false;
      emitter.on("contentChanged", () => {
        successCalled = true;
      });

      expect(() => {
        emitter.emit({
          type: "contentChanged",
          timestamp: Date.now(),
        });
      }).not.toThrow();

      expect(successCalled).toBe(true);
    });
  });

  describe("Listener Count", () => {
    it("should report correct listener count", () => {
      expect(emitter.listenerCount("contentChanged")).toBe(0);

      emitter.on("contentChanged", () => {});
      expect(emitter.listenerCount("contentChanged")).toBe(1);

      emitter.on("contentChanged", () => {});
      expect(emitter.listenerCount("contentChanged")).toBe(2);
    });

    it("should report zero for events with no listeners", () => {
      const eventType: EditorEventType = "contentChanged";
      expect(emitter.listenerCount(eventType)).toBe(0);
    });
  });

  describe("Multiple Event Types", () => {
    it("should handle multiple event types independently", () => {
      let contentCount = 0;
      let undoCount = 0;

      emitter.on("contentChanged", () => contentCount++);
      emitter.on("undoStateChanged", () => undoCount++);

      emitter.emit({ type: "contentChanged", timestamp: Date.now() });
      emitter.emit({ type: "undoStateChanged", timestamp: Date.now() });

      expect(contentCount).toBe(1);
      expect(undoCount).toBe(1);
    });
  });
});
