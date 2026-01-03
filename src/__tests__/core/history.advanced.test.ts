import { describe, it, expect, beforeEach } from "vitest";
import { _setDoc, _setUndoStack, _setRedoStack } from "../../core/state";
import { handleUndo } from "../../core/history";

describe("history advanced restoration", () => {
  let mockDoc: Document;

  beforeEach(() => {
    _setDoc(null);
    _setUndoStack([]);
    _setRedoStack([]);
    mockDoc = document.implementation.createHTMLDocument();
  });

  it("restores inline script placeholders into the target element and dispatches event", () => {
    _setDoc(mockDoc);

    const local = mockDoc.createElement("div");
    local.setAttribute("data-rhe-id", "ed1");
    mockDoc.body.appendChild(local);

    const code = "window.__TEST_VAR = 42;";
    const encoded = encodeURIComponent(code); // will be decoded by fallback path
    const attrs = encodeURIComponent(JSON.stringify({}));

    const prev = `<!doctype html>\n<html><body><div data-rhe-id="ed1"><span data-rhe-script data-rhe-script-parent="ed1" data-rhe-script="${encoded}" data-rhe-script-attrs="${attrs}"></span></div></body></html>`;
    const current =
      "<!doctype html>\n<html><body><div>other</div></body></html>";

    _setUndoStack([prev, current]);

    let restored = false;
    mockDoc.addEventListener("rhe:scripts-restored", () => (restored = true));

    handleUndo();

    const target = mockDoc.body.querySelector('[data-rhe-id="ed1"]');
    expect(target).not.toBeNull();
    const script = target!.querySelector("script");
    expect(script).not.toBeNull();
    // inline script should be present (textContent may vary in jsdom), and no src
    expect(script!.getAttribute("src")).toBeNull();
    // event should have been dispatched synchronously when no loads
    expect(restored).toBe(true);
  });

  it("restores external script src and waits for load before dispatching event", async () => {
    _setDoc(mockDoc);

    const local = mockDoc.createElement("div");
    local.setAttribute("data-rhe-id", "ed2");
    mockDoc.body.appendChild(local);

    const encoded = encodeURIComponent("");
    const attrsObj = { src: "https://example.com/test.js" };
    const attrs = encodeURIComponent(JSON.stringify(attrsObj));

    const prev = `<!doctype html>\n<html><body><div data-rhe-id="ed2"><span data-rhe-script data-rhe-script-parent="ed2" data-rhe-script="${encoded}" data-rhe-script-attrs="${attrs}"></span></div></body></html>`;
    const current =
      "<!doctype html>\n<html><body><div>other</div></body></html>";

    _setUndoStack([prev, current]);

    const restoredPromise = new Promise<void>((resolve) => {
      mockDoc.addEventListener("rhe:scripts-restored", () => resolve());
    });

    handleUndo();

    // find the appended script and simulate load to resolve promise
    const script = mockDoc.querySelector(
      'script[src="https://example.com/test.js"]',
    );
    expect(script).not.toBeNull();

    // dispatch load to resolve the internal promise
    script!.dispatchEvent(new Event("load"));

    // wait for the event propagated after promise resolution
    await restoredPromise;
  });

  it("falls back to replacing documentElement on parse errors", () => {
    _setDoc(mockDoc);

    const prev = "<!doctype html>\n<html><body><p>fallback</p></body></html>";
    const current =
      "<!doctype html>\n<html><body><div>other</div></body></html>";

    _setUndoStack([prev, current]);

    // mock DOMParser.parseFromString to throw
    const orig = (DOMParser.prototype as any).parseFromString;
    (DOMParser.prototype as any).parseFromString = function () {
      throw new Error("parse failure");
    };

    try {
      handleUndo();
      // injection of editor styles indicates the code reached the fallback + post-processing
      expect(mockDoc.head.querySelector("#editor-styles")).not.toBeNull();
    } finally {
      (DOMParser.prototype as any).parseFromString = orig;
    }
  });
});
