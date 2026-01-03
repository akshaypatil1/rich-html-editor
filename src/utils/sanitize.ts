import createDOMPurify from "dompurify";

/**
 * Sanitize HTML using DOMPurify.
 *
 * Works in browser and in jsdom (tests) by accepting either a `Window`
 * or a `Document` (from which `defaultView` is used).
 */
export function sanitizeHtml(
  html: string,
  ctx?: Window | Document | null,
): string {
  if (!html) return "";
  // Try to get a Window reference
  let win: Window | null = null;
  if (ctx && (ctx as Document).defaultView) {
    win = (ctx as Document).defaultView as Window;
  } else if (ctx && (ctx as Window).document) {
    win = ctx as Window;
  } else if (typeof window !== "undefined") {
    win = window as Window;
  }

  // If we have a window, use DOMPurify
  if (win) {
    try {
      const DOMPurify = createDOMPurify(win as any);
      // Preserve element ids and data-* attributes so restoring snapshots
      // during undo/redo does not break page scripts or CSS that rely on
      // those attributes. Still strip <script> and all inline event
      // handlers (on*) to avoid executing arbitrary script.
      // Use ADD_ATTR to allow `id`, and a hook to preserve any `data-` attrs.
      try {
        DOMPurify.addHook("uponSanitizeAttribute", (node: any, data: any) => {
          try {
            if (data && data.attrName && data.attrName.startsWith("data-")) {
              // Keep data-* attributes
              (data as any).keepAttr = true;
            }
          } catch (e) {
            /* ignore hook errors */
          }
        });
      } catch (e) {
        /* addHook may not be available in some environments; ignore */
      }

      return DOMPurify.sanitize(html, {
        // Use sensible defaults: allow common formatting tags but strip scripts
        ALLOWED_TAGS: [
          "a",
          "b",
          "i",
          "em",
          "strong",
          "u",
          "p",
          "div",
          "span",
          // Common semantic elements: preserve document structure so undo/redo
          // does not flatten header/section/nav into plain content.
          "header",
          "nav",
          "section",
          "main",
          "footer",
          "article",
          "aside",
          "figure",
          "figcaption",
          "time",
          // Interactive / form elements that may appear in content
          "button",
          "input",
          "label",
          "select",
          "option",
          "textarea",
          "details",
          "summary",
          // Allow <style> tags so user/content-provided CSS is preserved
          // when taking snapshots and during undo/redo operations.
          // DOMPurify will still sanitize the contents of style blocks.
          "style",
          // Preserve linked stylesheets so page/editor styling isn't lost
          "link",
          "ul",
          "ol",
          "li",
          "br",
          "hr",
          "blockquote",
          "pre",
          "code",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "img",
        ],
        ALLOWED_ATTR: [
          "href",
          "title",
          "alt",
          "src",
          "class",
          "style",
          // Attributes used by <link> tags
          "rel",
          "type",
          "media",
        ],
        // Also allow `id` attributes so element ids survive sanitization.
        ADD_ATTR: ["id"],
      });
    } catch (e) {
      // If DOMPurify initialization fails, fall through to minimal stripping
    }
  }

  // Minimal fallback: remove <script> tags and on* attributes
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on[a-z]+=\"[^"]*\"/gi, "");
}

export default sanitizeHtml;
