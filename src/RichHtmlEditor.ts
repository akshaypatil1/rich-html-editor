import { initRichEditor, getCleanHTML } from "./core/editor";
import type { EditorConfig } from "./core/types";

export default class RichHtmlEditor {
  private iframeWindow!: Window;
  private iframeEl?: HTMLIFrameElement;
  private config?: EditorConfig;

  constructor(
    options: {
      iframe: Window | HTMLIFrameElement | string;
    } & Partial<EditorConfig>,
  ) {
    const { iframe, ...cfg } = options as any;
    this.config = Object.keys(cfg).length ? (cfg as EditorConfig) : undefined;

    if (typeof iframe === "string") {
      const el = document.querySelector(iframe);
      if (!el) throw new Error(`Iframe selector "${iframe}" not found`);
      if (!(el instanceof HTMLIFrameElement))
        throw new Error(`Selector "${iframe}" did not resolve to an iframe`);
      if (!el.contentWindow) throw new Error("Iframe has no contentWindow");
      this.iframeEl = el;
      this.iframeWindow = el.contentWindow;
    } else if (iframe && (iframe as HTMLIFrameElement).contentWindow) {
      const el = iframe as HTMLIFrameElement;
      if (!el.contentWindow) throw new Error("Iframe has no contentWindow");
      this.iframeEl = el;
      this.iframeWindow = el.contentWindow;
    } else if (iframe && (iframe as Window).document) {
      this.iframeWindow = iframe as Window;
      // Try to locate the corresponding iframe element in the current document
      try {
        const candidates = Array.from(
          document.querySelectorAll("iframe"),
        ) as HTMLIFrameElement[];
        const found = candidates.find(
          (f) => f.contentWindow === this.iframeWindow,
        );
        if (found) this.iframeEl = found;
      } catch (e) {
        /* ignore cross-origin or DOM errors */
      }
    } else {
      throw new Error(
        "Invalid `iframe` option. Provide a `Window`, `HTMLIFrameElement`, or selector string.",
      );
    }
  }

  init() {
    if (!this.iframeEl) {
      throw new Error(
        "Unable to initialize: iframe element not available. Provide an iframe element or selector.",
      );
    }
    initRichEditor(this.iframeEl, this.config);
  }

  getHTML() {
    return getCleanHTML();
  }

  static attachToWindow(force = false) {
    if (typeof window === "undefined") return;
    if (!(window as any).RichHtmlEditor || force) {
      (window as any).RichHtmlEditor = RichHtmlEditor;
    }
  }
}

declare global {
  interface Window {
    RichHtmlEditor?: typeof RichHtmlEditor;
  }
}

if (typeof window !== "undefined") {
  RichHtmlEditor.attachToWindow();
}
