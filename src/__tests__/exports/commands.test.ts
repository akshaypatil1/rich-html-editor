import { describe, it, expect } from "vitest";
import * as cmds from "../../core/commands";

describe("exports: core/commands", () => {
  it("re-exports expected functions", () => {
    // sanitizeURL is a function, history handlers and formatActions exported
    expect(typeof (cmds as any).sanitizeURL).toBe("function");
    expect(typeof (cmds as any).handleUndo).toBe("function");
    expect(typeof (cmds as any).handleRedo).toBe("function");
    expect(typeof (cmds as any).handleToolbarCommand).toBe("function");
    expect(typeof (cmds as any).applyStandaloneCommand).toBe("function");
  });
});
