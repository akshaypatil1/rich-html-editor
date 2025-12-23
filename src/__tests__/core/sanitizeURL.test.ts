import { describe, it, expect, beforeEach } from "vitest";
import { sanitizeURL } from "../../core/sanitizeURL";

describe("core.sanitizeURL", () => {
  it("blocks javascript: and data: protocols and normalizes URLs", () => {
    expect(sanitizeURL("javascript:alert('x')")).toBe("");
    expect(sanitizeURL("DATA:text/html,<script>")).toBe("");
    expect(sanitizeURL("")).toBe("");
    expect(sanitizeURL("   ")).toBe("");
    expect(sanitizeURL("example.com")).toBe("https://example.com");
    expect(sanitizeURL("http://example.com")).toBe("http://example.com");
    expect(sanitizeURL("#anchor")).toBe("#anchor");
  });
});
