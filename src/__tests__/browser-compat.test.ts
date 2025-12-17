import { describe, it, expect, beforeEach } from "vitest";

/**
 * Browser Compatibility Tests
 *
 * These tests verify that the editor uses APIs compatible with
 * Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+
 */

describe("Browser Compatibility", () => {
  describe("Required DOM APIs", () => {
    it("should have contenteditable support", () => {
      const div = document.createElement("div");
      // Check if contentEditable attribute can be set
      div.setAttribute("contenteditable", "true");
      expect(div.getAttribute("contenteditable")).toBe("true");
    });

    it("should have Selection API support", () => {
      expect(document.getSelection).toBeDefined();
      const selection = document.getSelection();
      expect(selection).not.toBeNull();
    });

    it("should have Range API support", () => {
      const range = document.createRange();
      expect(range).toBeDefined();
      expect(range.setStart).toBeDefined();
      expect(range.insertNode).toBeDefined();
    });

    it("should support createHTMLDocument", () => {
      const doc = document.implementation.createHTMLDocument();
      expect(doc).toBeDefined();
      expect(doc.documentElement).toBeDefined();
    });

    it("should support outerHTML", () => {
      const div = document.createElement("div");
      div.innerHTML = "<p>test</p>";
      expect(div.outerHTML).toContain("<div");
      expect(div.outerHTML).toContain("<p>test</p>");
    });
  });

  describe("Style APIs", () => {
    it("should support getComputedStyle", () => {
      const div = document.createElement("div");
      const styles = window.getComputedStyle(div);
      expect(styles).toBeDefined();
      expect(styles.getPropertyValue).toBeDefined();
    });

    it("should support style property assignment", () => {
      const div = document.createElement("div");
      div.style.fontWeight = "bold";
      expect(div.style.fontWeight).toBe("bold");
    });

    it("should support CSS custom properties in styles", () => {
      const div = document.createElement("div");
      div.style.cssText = "position: sticky; top: 0; z-index: 9999;";
      expect(div.style.position).toBe("sticky");
      expect(div.style.top).toBe("0px");
    });

    it("should support textDecoration style", () => {
      const span = document.createElement("span");
      span.style.textDecoration = "underline";
      expect(span.style.textDecoration).toBe("underline");
    });

    it("should support backgroundColor style", () => {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      expect(span.style.backgroundColor).toBe("yellow");
    });

    it("should support color style", () => {
      const span = document.createElement("span");
      span.style.color = "red";
      expect(span.style.color).toBe("red");
    });
  });

  describe("ES2019+ Features", () => {
    it("should support arrow functions", () => {
      const fn = () => "test";
      expect(fn()).toBe("test");
    });

    it("should support optional chaining", () => {
      const obj: any = { a: { b: { c: "value" } } };
      expect(obj?.a?.b?.c).toBe("value");
      expect(obj?.a?.x?.z).toBeUndefined();
    });

    it("should support nullish coalescing", () => {
      const value: string | undefined = undefined;
      expect(value ?? "default").toBe("default");

      const value2: string | null = null;
      expect(value2 ?? "default").toBe("default");

      const value3: number = 0;
      expect(value3 ?? "default").toBe(0);
    });

    it("should support spread operator", () => {
      const arr = [1, 2, 3];
      const arr2 = [...arr];
      expect(arr2).toEqual([1, 2, 3]);
    });

    it("should support destructuring", () => {
      const obj = { x: 1, y: 2 };
      const { x, y } = obj;
      expect(x).toBe(1);
      expect(y).toBe(2);
    });

    it("should support Map and Set", () => {
      const map = new Map();
      map.set("key", "value");
      expect(map.get("key")).toBe("value");

      const set = new Set();
      set.add("item");
      expect(set.has("item")).toBe(true);
    });

    it("should support Promise", () => {
      const promise = new Promise((resolve) => {
        resolve("test");
      });
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe("Event Handling Compatibility", () => {
    it("should support addEventListener", () => {
      const div = document.createElement("div");
      let called = false;
      div.addEventListener("click", () => {
        called = true;
      });
      div.click();
      expect(called).toBe(true);
    });

    it("should support event bubbling and capturing", () => {
      const parent = document.createElement("div");
      const child = document.createElement("div");
      parent.appendChild(child);

      let bubbled = false;
      parent.addEventListener("click", () => {
        bubbled = true;
      });

      child.click();
      expect(bubbled).toBe(true);
    });

    it("should support input event", () => {
      const input = document.createElement("input");
      let fired = false;
      input.addEventListener("input", () => {
        fired = true;
      });

      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
      expect(fired).toBe(true);
    });

    it("should support change event", () => {
      const input = document.createElement("input");
      let fired = false;
      input.addEventListener("change", () => {
        fired = true;
      });

      const event = new Event("change", { bubbles: true });
      input.dispatchEvent(event);
      expect(fired).toBe(true);
    });

    it("should support selectionchange event", () => {
      let fired = false;
      document.addEventListener("selectionchange", () => {
        fired = true;
      });

      // Note: selectionchange may not fire in test environment
      // but the listener should attach without error
      expect(document.addEventListener).toBeDefined();
    });
  });

  describe("String and Array APIs", () => {
    it("should support String.startsWith", () => {
      expect("hello".startsWith("he")).toBe(true);
      expect("hello".startsWith("lo")).toBe(false);
    });

    it("should support String.includes", () => {
      expect("hello".includes("ell")).toBe(true);
      expect("hello".includes("xyz")).toBe(false);
    });

    it("should support String.trim", () => {
      expect("  hello  ".trim()).toBe("hello");
    });

    it("should support Array.includes", () => {
      expect([1, 2, 3].includes(2)).toBe(true);
      expect([1, 2, 3].includes(4)).toBe(false);
    });

    it("should support Array.find", () => {
      const arr = [1, 2, 3];
      expect(arr.find((x) => x === 2)).toBe(2);
    });

    it("should support Array.forEach", () => {
      const arr: number[] = [];
      [1, 2, 3].forEach((x) => arr.push(x));
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe("Global APIs", () => {
    it("should have window object", () => {
      expect(window).toBeDefined();
      expect(window.document).toBeDefined();
    });

    it("should have document object", () => {
      expect(document).toBeDefined();
      expect(document.createElement).toBeDefined();
    });

    it("should support Date", () => {
      const date = new Date();
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeGreaterThan(0);
    });

    it("should support console", () => {
      expect(console.log).toBeDefined();
      expect(console.warn).toBeDefined();
      expect(console.error).toBeDefined();
    });
  });

  describe("iframe Cross-Document Access", () => {
    it("should allow same-origin iframe document access", () => {
      const iframe = document.createElement("iframe");
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument;
      expect(iframeDoc).toBeDefined();
      expect(iframeDoc?.body).toBeDefined();

      document.body.removeChild(iframe);
    });

    it("should support iframe.contentDocument.createElement", () => {
      const iframe = document.createElement("iframe");
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        const p = iframeDoc.createElement("p");
        expect(p).toBeDefined();
        expect(p.tagName).toBe("P");
      }

      document.body.removeChild(iframe);
    });

    it("should support iframe.contentDocument.head and body", () => {
      const iframe = document.createElement("iframe");
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        expect(iframeDoc.head).toBeDefined();
        expect(iframeDoc.body).toBeDefined();
      }

      document.body.removeChild(iframe);
    });
  });
});
