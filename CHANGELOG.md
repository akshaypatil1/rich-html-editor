# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Planned: Image support (≤ 1MB)
- Planned: Background color and background image support
- Planned: Table editor
- Planned: Video embedding (≤ 1MB)
- Planned: Superscript and subscript formatting

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
