# rich-html-editor

[![npm version](https://img.shields.io/npm/v/rich-html-editor.svg)](https://www.npmjs.com/package/rich-html-editor) [![license](https://img.shields.io/npm/l/rich-html-editor.svg)](LICENSE)

> **Edit HTML templates safely — without breaking layout or CSS.**

`rich-html-editor` is a **lightweight, framework-agnostic HTML editor** designed for **non-technical users** to edit **existing HTML templates** inside an iframe.  
It enables **controlled, template-driven editing**, not free-form WYSIWYG chaos.

---

## 🎥 Demo & Playground

### ▶️ Live Playground (Try it yourself)

👉 **https://akshaypatil1.github.io/rich-html-editor/**

Use the playground to:

- Edit real HTML inside an iframe
- Apply formatting safely
- Export clean HTML instantly

> No install. No build. Runs directly in the browser.

---

### 📽️ Video Demo

Below is a short demo showing how **rich-html-editor** allows inline editing of an HTML template using a toolbar embedded inside an iframe.

![rich-html-editor demo](assets/demo.gif)

> The user edits text, formatting, and styles directly inside the iframe while preserving the original template structure.

---

## ✨ Why rich-html-editor?

Most rich text editors allow users to edit _anything_ — which often leads to broken layouts, styles, or invalid HTML.

**rich-html-editor is different:**

- 🧩 Built for **template-driven HTML**
- 🔒 Runs inside an **iframe** (style & DOM isolation)
- 🛠️ Focused on **safe, controlled editing**
- 👩‍💼 Ideal for **non-technical users**
- ⚙️ Framework-agnostic (React, Angular, Vue, Vanilla JS)

---

## 🚀 Features

### ✏️ Text Formatting

- Bold
- Italic
- Underline
- Strikethrough
- Font family
- Font size
- Headings (H1–H6)
- Ordered & unordered lists
- Links
- Clear formatting (🧹) — removes editor-applied styles within the current session

### 🎨 Styling

- Text color
- Text highlighter
- Alignment

### 🖼️ Image Editing

- Click-to-edit images: click an image inside the editor to open a modal that lets the user upload a local image (image/\*, ≤ 1 MB) which will be embedded as a base64 data URL, or provide an `http(s)` image URL to apply. Image changes are recorded in the editor undo/redo history.

### 🧠 Editor Utilities

- Undo / Redo
- Format state tracking
- History stack (configurable)
- Clean HTML extraction

### 🧱 Architecture

- Iframe-based isolation
- Injectable toolbar
- Event-driven updates
- Framework-agnostic core
- TypeScript-first API

---

## 📦 Installation

```bash
npm install rich-html-editor
# or
yarn add rich-html-editor
```

---

## ⚡ Quick Start (Browser / iframe)

The editor initializes on an `HTMLIFrameElement`.

> ⚠️ The iframe must be **same-origin**. Use `srcdoc` for safety.

```html
<script type="module">
  import {
    initRichEditor,
    getCleanHTML,
    editorEventEmitter,
  } from "rich-html-editor";

  const iframe = document.createElement("iframe");
  iframe.srcdoc =
    "<!doctype html><html><head></head><body><div>Edit me</div></body></html>";

  document.body.appendChild(iframe);

  initRichEditor(iframe, { maxStackSize: 50 });

  const off = editorEventEmitter.on("contentChanged", (event) => {
    console.log("Content changed:", event);
  });

  const html = getCleanHTML();
  console.log(html);

  // off(); // unsubscribe when needed
</script>
```

---

## 📦 Module Usage

### ESM

```js
import { initRichEditor, getCleanHTML } from "rich-html-editor";
```

### CommonJS

```js
const { initRichEditor, getCleanHTML } = require("rich-html-editor");
```

---

## 🧩 Framework Integrations

### React (Functional Component)

```jsx
import React, { useRef, useEffect } from "react";
import { initRichEditor, editorEventEmitter } from "rich-html-editor";

export default function RichEditor() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    iframe.srcdoc =
      "<!doctype html><html><body><div>Edit me</div></body></html>";

    initRichEditor(iframe);

    const off = editorEventEmitter.on("contentChanged", () => {});
    return () => off();
  }, []);

  return <iframe ref={iframeRef} title="Rich HTML Editor" />;
}
```

---

### Angular (Component)

```ts
import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { initRichEditor, editorEventEmitter } from "rich-html-editor";

@Component({
  selector: "app-rich-editor",
  template: `<iframe #editorIframe title="Rich HTML Editor"></iframe>`,
})
export class RichEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorIframe", { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;
  private off?: () => void;

  ngAfterViewInit() {
    const iframe = this.iframeRef.nativeElement;
    iframe.srcdoc =
      "<!doctype html><html><body><div>Edit me</div></body></html>";
    initRichEditor(iframe);
    this.off = editorEventEmitter.on("contentChanged", () => {
      /* react to changes */
    });
  }

  ngOnDestroy() {
    this.off?.();
  }
}
```

---

### Vue (Single File Component)

```vue
<template>
  <iframe ref="editorIframe" title="Rich HTML Editor"></iframe>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { initRichEditor, editorEventEmitter } from "rich-html-editor";

const editorIframe = ref(null);
let off;

onMounted(() => {
  const iframe = editorIframe.value;
  iframe.srcdoc = "<!doctype html><html><body><div>Edit me</div></body></html>";
  initRichEditor(iframe);
  off = editorEventEmitter.on("contentChanged", () => {
    /* handle */
  });
});

onBeforeUnmount(() => {
  off?.();
});
</script>
```

---

## 🧠 Public API

### `initRichEditor(iframe, config?)`

Initializes the editor inside the provided iframe.

### `getCleanHTML(): string`

Returns sanitized HTML:

- Toolbar removed
- Editor-specific attributes stripped
- Safe for storage or approval workflows

---

## 🛣️ Roadmap

- Background color / image
- Table editor
- Video embedding (≤ 1MB)
- Superscript / subscript
- Editable-region locking

---

## 🤝 Contributing

Contributions are welcome!

👉 https://github.com/akshaypatil1/rich-html-editor

---

## 📄 License

MIT

---

⭐ If this helps you, consider starring the repo
