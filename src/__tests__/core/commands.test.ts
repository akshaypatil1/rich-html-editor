import { describe, it, expect, beforeEach } from "vitest";
import { sanitizeURL } from "../../core/commands";

describe("URL Sanitization", () => {
  describe("XSS Prevention", () => {
    it("should block javascript: protocol", () => {
      expect(sanitizeURL("javascript:alert('xss')")).toBe("");
    });

    it("should block data: protocol", () => {
      expect(sanitizeURL("data:text/html,<script>alert('xss')</script>")).toBe(
        "",
      );
    });

    it("should accept http URLs", () => {
      expect(sanitizeURL("http://example.com")).toBe("http://example.com");
    });

    it("should accept https URLs", () => {
      expect(sanitizeURL("https://example.com")).toBe("https://example.com");
    });

    it("should add https protocol to URLs without protocol", () => {
      expect(sanitizeURL("example.com")).toBe("https://example.com");
    });

    it("should preserve hash links", () => {
      expect(sanitizeURL("#section")).toBe("#section");
    });

    it("should trim whitespace", () => {
      expect(sanitizeURL("  https://example.com  ")).toBe(
        "https://example.com",
      );
    });

    it("should handle empty strings", () => {
      expect(sanitizeURL("")).toBe("");
    });

    it("should handle whitespace only strings", () => {
      expect(sanitizeURL("   ")).toBe("");
    });

    it("should be case insensitive for protocol detection", () => {
      expect(sanitizeURL("JAVASCRIPT:alert('xss')")).toBe("");
      expect(sanitizeURL("DATA:text/html,test")).toBe("");
    });

    it("should handle complex URLs", () => {
      expect(sanitizeURL("github.com/user/repo")).toBe(
        "https://github.com/user/repo",
      );
    });

    it("should preserve query parameters", () => {
      expect(sanitizeURL("example.com?foo=bar&baz=qux")).toBe(
        "https://example.com?foo=bar&baz=qux",
      );
    });

    it("should preserve URL fragments", () => {
      expect(sanitizeURL("example.com#section")).toBe(
        "https://example.com#section",
      );
    });
  });
});
