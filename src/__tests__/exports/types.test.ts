import { describe, it, expect } from "vitest";
import * as types from "../../core/types";

describe("exports: core/types (runtime presence)", () => {
  it("module loads at runtime (types are erased at compile time)", () => {
    // Type-only exports don't exist at runtime; ensure import produces an object
    expect(typeof types).toBe("object");
  });
});
