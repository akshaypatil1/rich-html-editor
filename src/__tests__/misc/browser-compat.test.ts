import { describe, it, expect } from "vitest";

describe("Browser Compatibility", () => {
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
