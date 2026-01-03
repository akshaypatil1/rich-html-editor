import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RichHtmlEditor from "../RichHtmlEditor";
import * as editor from "../core/editor";

describe("RichHtmlEditor class", () => {
  beforeEach(() => {
    // clean document between tests
    document.body.innerHTML = "";
    // ensure no global attached
    // @ts-ignore
    delete (window as any).RichHtmlEditor;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when selector not found", () => {
    expect(() => new RichHtmlEditor({ iframe: "#no-such" })).toThrow(
      /Iframe selector "#no-such" not found/,
    );
  });

  it("throws when selector does not resolve to an iframe", () => {
    const div = document.createElement("div");
    div.id = "not-iframe";
    document.body.appendChild(div);
    expect(() => new RichHtmlEditor({ iframe: "#not-iframe" })).toThrow(
      /did not resolve to an iframe/,
    );
  });

  it("throws when iframe has no contentWindow", () => {
    const iframe = document.createElement("iframe");
    iframe.id = "no-content-window";
    // override readonly property to simulate missing contentWindow
    Object.defineProperty(iframe, "contentWindow", {
      value: undefined,
      configurable: true,
    });
    document.body.appendChild(iframe);
    expect(() => new RichHtmlEditor({ iframe: "#no-content-window" })).toThrow(
      /Iframe has no contentWindow/,
    );
  });

  it("accepts Window and init() throws when there is no iframe element", () => {
    const inst = new RichHtmlEditor({ iframe: window });
    expect(() => inst.init()).toThrow(/iframe element not available/);
  });

  it("getHTML delegates to getCleanHTML", () => {
    const spy = vi.spyOn(editor, "getCleanHTML").mockReturnValue("<p>x</p>");
    const inst = new RichHtmlEditor({ iframe: window });
    expect(inst.getHTML()).toBe("<p>x</p>");
    expect(spy).toHaveBeenCalled();
  });

  it("attachToWindow sets global when forced", () => {
    // ensure not present
    // @ts-ignore
    delete (window as any).RichHtmlEditor;
    RichHtmlEditor.attachToWindow(true);
    // @ts-ignore
    expect((window as any).RichHtmlEditor).toBe(RichHtmlEditor);
  });

  it("accepts an iframe element and init calls initRichEditor with config", () => {
    const iframe = document.createElement("iframe");
    // make contentWindow available
    Object.defineProperty(iframe, "contentWindow", {
      value: window,
      configurable: true,
    });
    document.body.appendChild(iframe);

    const spy = vi.spyOn(editor, "initRichEditor").mockImplementation(() => {});

    const inst = new RichHtmlEditor({ iframe, custom: "x" } as any);
    inst.init();

    expect(spy).toHaveBeenCalledWith(iframe, { custom: "x" });
  });

  it("accepts a Window and finds matching iframe in document", () => {
    const fakeWin = { document: {} } as unknown as Window;
    const iframe = document.createElement("iframe");
    Object.defineProperty(iframe, "contentWindow", {
      value: fakeWin,
      configurable: true,
    });
    document.body.appendChild(iframe);

    const spy = vi.spyOn(editor, "initRichEditor").mockImplementation(() => {});

    const inst = new RichHtmlEditor({ iframe: fakeWin });
    // init should succeed because constructor found the iframe element
    inst.init();
    expect(spy).toHaveBeenCalledWith(iframe, undefined);
  });

  it("continues when document.querySelectorAll throws (cross-origin) and init then errors", () => {
    const qsa = vi
      .spyOn(document, "querySelectorAll")
      .mockImplementation(() => {
        throw new Error("cross-origin");
      });

    const inst = new RichHtmlEditor({ iframe: window });
    expect(() => inst.init()).toThrow(/iframe element not available/);

    qsa.mockRestore();
  });
});
