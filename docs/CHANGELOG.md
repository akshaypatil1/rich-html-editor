# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Planned: Background color and background image support
- Planned: Table editor
- Planned: Video embedding (≤ 1MB)
- Planned: Superscript and subscript formatting

---

## [1.2.4] - 2026-01-03

### Fixed

- Prevent UI style leakage from template pages: toolbar and modal UI are now mounted inside a scoped editor root (`#rhe-editor-root`), a conservative scoped CSS reset is injected, and a `getEditorRoot()` helper was added. This prevents site/global styles from breaking toolbar buttons, inputs, and popups. Tests updated to accept the new mount location.

---

## [1.2.3] - 2025-12-30

### Fixed

- Image modal UI: fixed layout/overflow issue in the image editor modal so input fields and controls no longer overflow on narrow modals. Improved responsive styling and box-sizing handling for inputs.

---

## [1.2.2] - 2025-12-29

### Changed

- Packaging: Fixed IIFE/global bundle setup and packaging metadata so the library can be consumed via a `<script>` tag or CDN (`dist/index.global.js`). Updated related build artifacts and maps.
- API/exports: Added `RichHtmlEditor` top-level class file and applied small packaging/export polish (see commit "iife setup fix").
- Docs: Updated `README.md` and packaging notes to reflect IIFE/global usage.

---

## [1.2.1] - 2025-12-29

### Changed

- Packaging: Added an IIFE browser build (`dist/index.global.js`) and `browser`/`unpkg` fields in `package.json` so the library can be used via a `<script>` tag or CDNs.
- Build: set `globalName` to `RichHtmlEditor` for the IIFE/global bundle.

---

## [1.2.0] - 2025-12-29

### Added

- Click-to-edit image update: clicking an `<img>` inside the editor opens an inline modal allowing users to either upload a local image (image/\*, ≤ 1 MB) which is embedded as a base64 data URL, or provide a remote `http(s)` image URL to apply.
- Undo/Redo integration for image changes: image `src` updates now push a snapshot so changes are captured in the editor history.
- Unit tests for image editor flows (file upload, URL apply, CORS fallback).

### Changed

- Moved `MAX_FILE_SIZE` constant into `core/constants.ts` and reused across modules.
- Styling: images inside editable regions now show a pointer cursor to indicate editable/interactive behavior.

### Removed

- Removed a few unused icon HTML constants from `core/constants.ts` during cleanup.

---

## [1.1.0] - 2025-12-24

### Added

- Clear formatting (editor-applied styles only) — session-only toolbar action (🧹). Removes formatting applied by the editor during the current editing session; includes marking editor-created nodes, robust selection save/restore for toolbar interactions, and automated tests.

### Changed

- Toolbar: label updated to use broom emoji for Clear formatting control.
- Tests: added unit tests covering `formatActions` branches and clear-format behavior.

---

## [1.0.1] - 2025-12-23

### Changed

- Documentation: updated README and CHANGELOG.
- Tests: enhanced and extended test suites.

---

## [1.0.0] - 2025-12-22

### Added

- First **stable v1.0.0 release** with a consolidated public API.
- Core editor functionality:
  - Undo / Redo with configurable history stack
  - Font family and font size controls
  - Headings (H1–H6)
  - Bold, Italic, Underline, Strikethrough
  - Ordered (OL) and Unordered (UL) lists
  - Text alignment (left / center / right)
  - Text color and highlight color pickers
  - Link insertion with URL sanitization

### Fixed

- Ensured pressing **Enter** inside list items consistently creates a new list item across supported browsers.

### Notes

- This release stabilizes the toolbar API and packages finalized build artifacts for long-term use.

---

## [0.2.2] - 2025-12-19

### Changed

- Internal refactor: Toolbar implementation split into smaller, focused modules for better maintainability:
  - `toolbar/render.ts`
  - `toolbar/buttons.ts`
  - `toolbar/selects.ts`
  - `toolbar/color.ts`
  - `toolbar/overflow.ts`
  - `toolbar/navigation.ts`
- Improved internal structure to make future feature additions (e.g., list controls) easier.

### Fixed

- TypeScript:
  - Fixed event typing issues introduced during refactor.
  - Corrected import paths and removed unintended runtime globals.

### Notes

- No public API changes (`injectToolbar` continues to be re-exported from `src/toolbar/toolbar.ts`).

---

## [0.2.0] - 2025-12-18

### Added

- Responsive toolbar layout:
  - Toolbar wraps on narrow screens.
  - Accessible overflow **"More"** menu for less-used controls (format, font, size, color, link).
  - Overflow controls reuse existing command handlers.

### Changed

- Toolbar styles updated to:
  - Reduce spacing on small viewports.
  - Hide separators where appropriate.
  - Enable horizontal scrolling on very small screens.

### Fixed

- Accessibility and keyboard navigation preserved when toolbar controls move into the overflow menu:
  - Proper ARIA attributes
  - Focus management
  - Escape key handling to close overflow menu

---

## [0.1.0] - 2025-12-17

### Added

#### Core Editor

- `initRichEditor()` — initialize the editor on an iframe element.
- `getCleanHTML()` — export sanitized full-document HTML (including DOCTYPE).
- Text formatting:
  - Bold, Italic, Underline
- Font controls:
  - Font family selector
  - Font size selector
- Text alignment controls.
- Text and highlight color pickers.
- Link insertion with URL sanitization.
- Sticky toolbar injected into the edited document.
- Undo / Redo with snapshot-based history management.
- Click-to-edit element selection using `contenteditable`.

#### Event System

- `editorEventEmitter` for subscribing to editor events:
  - `contentChanged`
  - `selectionChanged`
  - `undoStateChanged`
  - `redoStateChanged`

#### TypeScript & Packaging

- Full TypeScript typings for public APIs.
- Dual build outputs:
  - ESM
  - CommonJS
- Conditional exports defined in `package.json`.

#### Security

- URL sanitization blocking unsafe protocols (`javascript:`, `data:`).
- HTML sanitization utilities with DOMPurify fallback.

#### Tooling & Testing

- Unit tests using Vitest and jsdom.
- Build pipeline using `tsup` with declaration file generation.

### Fixed

- Undo / Redo state handling and related callbacks.
- Restored missing type exports required for TypeScript consumers.
- Corrected package export ordering and metadata.

### Changed

- Library is fully framework-agnostic (no framework runtime dependencies).
- Improved error messages and event emission consistency.

### Removed

- Previously considered framework-specific dependencies to keep the core lightweight.

### Security

- Additional URL and HTML sanitization safeguards to reduce XSS risk.

---

## Notes for Contributors

### Testing

- All changes should include relevant unit tests.
- Aim for **≥ 70% code coverage**.

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Types

- All public APIs must be properly typed.
- Use JSDoc comments for complex types.

### Security

- Validate and sanitize all user-controlled input.
- Pay special attention to URL and HTML handling.

### Performance

- Monitor bundle size and initialization time.
- Keep the editor lightweight and fast.
