import createDOMPurify from "dompurify";

/**
 * Sanitize HTML using DOMPurify.
 *
 * Works in browser and in jsdom (tests) by accepting either a `Window`
 * or a `Document` (from which `defaultView` is used).
 */
export function sanitizeHtml(
  html: string,
  ctx?: Window | Document | null
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
        ALLOWED_ATTR: ["href", "title", "alt", "src", "class", "style"],
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
