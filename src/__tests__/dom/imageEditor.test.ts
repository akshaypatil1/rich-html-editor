import { describe, it, expect, vi, beforeEach } from "vitest";

// Use JSDOM globals provided by Vitest
import { openImageEditor } from "../../dom/imageEditor";
import { MAX_FILE_SIZE } from "../../core/constants";

function createDoc() {
  const doc = document.implementation.createHTMLDocument("test");
  const img = doc.createElement("img");
  img.src = "about:blank";
  doc.body.appendChild(img);
  return { doc, img };
}

describe("imageEditor", () => {
  beforeEach(() => {
    // clean up any modal overlay from previous runs
    const existing = document.querySelector(".rhe-img-modal-overlay");
    if (existing) existing.remove();
  });

  it("applies a base64 data URL when uploading a valid image file <= 1MB", async () => {
    const { doc, img } = createDoc();

    // spy on FileReader
    const fakeDataUrl = "data:image/png;base64,FAKEBASE64";

    // Create a fake File object
    const blob = new Blob(["fakecontent"], { type: "image/png" });
    // Ensure size is under MAX_FILE_SIZE
    Object.defineProperty(blob, "size", { value: 1000 });
    const file = new (window as any).File([blob], "test.png", {
      type: "image/png",
    });

    // Open modal
    openImageEditor(doc, img);

    // Find file input in the document we appended the modal to (doc is separate from global document in JSDOM)
    const overlay = doc.querySelector(".rhe-img-modal-overlay") as HTMLElement;
    expect(overlay).toBeTruthy();
    const fileInput = overlay.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    // Mock FileReader to immediately call onload with fakeDataUrl
    const originalFR = (window as any).FileReader;
    class MockFR {
      onload:
        | ((this: FileReader, ev: ProgressEvent<FileReader>) => any)
        | null = null;
      onerror: (() => any) | null = null;
      result: any = null;
      readAsDataURL(_f: File) {
        this.result = fakeDataUrl;
        if (this.onload) {
          const ev = new ProgressEvent(
            "load"
          ) as unknown as ProgressEvent<FileReader>;
          this.onload.call(this as any, ev);
        }
      }
    }
    (window as any).FileReader = MockFR;

    // Simulate user selecting a file by setting files property and dispatching change
    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));

    // After change handler, img.src should be updated to fakeDataUrl
    expect(img.src).toBe(fakeDataUrl);

    // restore
    (window as any).FileReader = originalFR;
  });

  it("applies a remote URL when URL HEAD indicates an image and size under limit", async () => {
    const { doc, img } = createDoc();

    openImageEditor(doc, img);
    const overlay = doc.querySelector(".rhe-img-modal-overlay") as HTMLElement;
    const urlInput = overlay.querySelector(
      'input[type="url"]'
    ) as HTMLInputElement;
    const applyBtn = Array.from(overlay.querySelectorAll("button")).find(
      (b) => b.textContent === "Apply"
    ) as HTMLButtonElement;
    expect(urlInput).toBeTruthy();
    expect(applyBtn).toBeTruthy();

    const testUrl = "https://example.com/pic.jpg";

    // Mock fetch HEAD to return image content-type and small content-length
    const mockHead = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      return new Response(null, {
        status: 200,
        headers: {
          "content-type": "image/jpeg",
          "content-length": "1000",
        },
      });
    });
    (globalThis as any).fetch = mockHead;

    urlInput.value = testUrl;
    applyBtn.click();

    // Wait a tick for async handler
    await Promise.resolve();

    expect(img.src).toBe(testUrl);
  });

  it("falls back to applying URL when HEAD fails (CORS)", async () => {
    const { doc, img } = createDoc();

    openImageEditor(doc, img);
    const overlay = doc.querySelector(".rhe-img-modal-overlay") as HTMLElement;
    const urlInput = overlay.querySelector(
      'input[type="url"]'
    ) as HTMLInputElement;
    const applyBtn = Array.from(overlay.querySelectorAll("button")).find(
      (b) => b.textContent === "Apply"
    ) as HTMLButtonElement;

    const testUrl = "https://cors-blocked.example.com/pic.jpg";

    // Mock fetch to throw (simulate CORS failure)
    const mockFail = vi.fn(async () => {
      throw new Error("CORS");
    });
    (globalThis as any).fetch = mockFail;

    urlInput.value = testUrl;
    applyBtn.click();

    // Wait a tick
    await Promise.resolve();

    expect(img.src).toBe(testUrl);
  });
});
