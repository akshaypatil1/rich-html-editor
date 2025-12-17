# rich-html-editor

A framework-agnostic, plug-and-play rich HTML editor library for adding WYSIWYG editing capabilities to your web applications.

## Features

- 📝 **Rich Text Editing** - Bold, italic, underline, text alignment, font selection
- 🎨 **Formatting Tools** - Color pickers for text and highlight colors
- 🔗 **Links & URLs** - Built-in link insertion with XSS protection
- ↩️ **Undo/Redo** - Full undo/redo support with snapshot management
- 🛠️ **Sticky Toolbar** - Always-visible formatting toolbar
- 🔒 **Security** - URL sanitization to prevent XSS attacks
- 📦 **Small Bundle** - ~13KB minified (ESM format)

## Installation

### From npm (once published)

```bash
npm install rich-html-editor
```

### From GitHub

```bash
npm install github:akshaypatil1/rich-html-editor
```

## Usage

```typescript
import { initRichEditor, getCleanHTML } from "rich-html-editor";

// Initialize editor on an iframe
const iframe = document.querySelector("iframe");
initRichEditor(iframe);

// Get cleaned HTML content
const html = getCleanHTML();
```

## Demo / Examples

Below are quick examples to get the editor running in various environments. These show minimal integrations for a host page or framework.

Vanilla JavaScript

```html
<iframe id="editor" srcdoc="<body><div class=\"editable\">Edit me</div></body>"></iframe>
<script type="module">
  import { initRichEditor } from './dist/index.mjs';
  const iframe = document.getElementById('editor');
  initRichEditor(iframe);
</script>
```

React (functional component)

```jsx
import { useEffect, useRef } from "react";
import { initRichEditor } from "rich-html-editor";

export default function Editor() {
  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current) initRichEditor(iframeRef.current);
  }, []);
  return (
    <iframe
      ref={iframeRef}
      srcDoc={'<body><div class="editable">Edit me</div></body>'}
    />
  );
}
```

Angular (simple component)

```ts
// in component template
// <iframe #editor [srcdoc]="'<body><div class=\"editable\">Edit me</div></body>'"></iframe>

// in component.ts
import { AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { initRichEditor } from "rich-html-editor";

export class MyEditorComponent implements AfterViewInit {
  @ViewChild("editor") editor!: ElementRef<HTMLIFrameElement>;
  ngAfterViewInit() {
    initRichEditor(this.editor.nativeElement);
  }
}
```

Vue 3 (Composition API)

```vue
<template>
  <iframe ref="editor" :srcdoc="srcdoc"></iframe>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { initRichEditor } from "rich-html-editor";

const editor = ref(null);
const srcdoc = '<body><div class="editable">Edit me</div></body>';
onMounted(() => {
  if (editor.value) initRichEditor(editor.value);
});
</script>
```

Notes:

- The toolbar is injected into the iframe document and uses inline styles by default. For theming, replace or override the `#editor-toolbar` element inside the iframe or modify the `injectToolbar` function.
- Accessibility: toolbar exposes ARIA attributes and keyboard navigation (Arrow keys, Enter/Space). Keyboard shortcuts are available for Bold (Ctrl/Cmd+B), Italic (Ctrl/Cmd+I), Underline (Ctrl/Cmd+U), Undo (Ctrl/Cmd+Z), Redo (Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z).

## API

### `initRichEditor(iframe: HTMLIFrameElement): void`

Initializes the rich HTML editor on the target iframe element.

**Parameters:**

# rich-html-editor

A framework-agnostic, plug-and-play rich HTML editor library for adding WYSIWYG editing capabilities to web applications (vanilla JS, React, Vue, Angular, etc.).

## Quick Start

Install from npm (when published):

```bash
npm install rich-html-editor
```

Install directly from GitHub (dist is included in this repo — no build required on install):

```bash
npm install github:akshaypatil1/rich-html-editor
```

Or install a specific release/tag:

```bash
npm install github:akshaypatil1/rich-html-editor#v0.1.0
```

This repository includes built `dist/` artifacts so consumers installing from Git do not need to run a build step.

## Usage (quick)

```typescript
import {
  initRichEditor,
  getCleanHTML,
  getSanitizedHTML,
} from "rich-html-editor";

const iframe = document.querySelector("iframe") as HTMLIFrameElement | null;
if (iframe) {
  initRichEditor(iframe);
  // later...
  const raw = getCleanHTML(); // full document HTML (raw)
  const safe = getSanitizedHTML(); // sanitized HTML safe for untrusted contexts
}
```

## Examples

Vanilla JavaScript (module import):

```html
<iframe id="editor" srcdoc="<body><div class=\"editable\">Edit me</div></body>"></iframe>
<script type="module">
  import { initRichEditor } from 'rich-html-editor';
  const iframe = document.getElementById('editor');
  if (iframe instanceof HTMLIFrameElement) initRichEditor(iframe);
</script>
```

React (functional component):

```jsx
import { useEffect, useRef } from "react";
import { initRichEditor } from "rich-html-editor";

export default function Editor() {
  const iframeRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current) initRichEditor(iframeRef.current);
  }, []);
  return (
    <iframe
      ref={iframeRef}
      srcDoc={'<body><div class="editable">Edit me</div></body>'}
    />
  );
}
```

Vue 3 (Composition API):

```vue
<template>
  <iframe ref="editor" :srcdoc="srcdoc"></iframe>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { initRichEditor } from "rich-html-editor";

const editor = ref(null);
const srcdoc = '<body><div class="editable">Edit me</div></body>';
onMounted(() => {
  if (editor.value) initRichEditor(editor.value);
});
</script>
```

Angular (component):

```ts
// template: <iframe #editor [srcdoc]="'<body><div class=\"editable\">Edit me</div></body>'"></iframe>
import { AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { initRichEditor } from "rich-html-editor";

export class MyEditorComponent implements AfterViewInit {
  @ViewChild("editor") editor!: ElementRef<HTMLIFrameElement>;
  ngAfterViewInit() {
    initRichEditor(this.editor.nativeElement);
  }
}
```

## API

- `initRichEditor(iframe: HTMLIFrameElement, config?)` — Initialize the editor on the provided iframe.
- `getCleanHTML(): string` — Returns the full document HTML (raw). Use only in trusted contexts or for internal storage.
- `getSanitizedHTML(): string` — Returns a sanitized HTML string suitable for exporting to untrusted contexts (uses the library sanitizer).

Notes:

- The package provides ESM, CJS and TypeScript declaration files (`dist/*.mjs`, `dist/*.js`, `dist/*.d.ts`).
- This library is framework-agnostic; you can integrate it with any frontend framework — the consumer is responsible for framework-specific lifecycle integration.

## Security

- `getCleanHTML()` returns raw HTML from the editor and may contain unsafe attributes or elements. Sanitize before inserting into other pages.
- Prefer `getSanitizedHTML()` when exporting user content for untrusted contexts. Server-side sanitization is recommended as a second line of defense.

## Notes for Consumers

- Because this repo includes prebuilt `dist/` artifacts, installing from GitHub will not require the consumer to run a build step.
- If you instead rely on source-only installs and `prepare` scripts, ensure `devDependencies` (build tools) are available on the install environment.

## License

MIT
