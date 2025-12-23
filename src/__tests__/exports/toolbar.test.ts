import { describe, it, expect } from "vitest";
import { injectToolbar } from "../../toolbar/toolbar";

describe("exports: toolbar", () => {
  it("re-exports injectToolbar from render", () => {
    expect(typeof injectToolbar).toBe("function");
  });
});
