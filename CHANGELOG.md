# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2025-12-19

### Changed

- Refactor: Split the toolbar implementation into smaller modules (`toolbar/render.ts`, `toolbar/buttons.ts`, `toolbar/selects.ts`, `toolbar/color.ts`, `toolbar/overflow.ts`, `toolbar/navigation.ts`) to improve maintainability and make adding features (e.g., lists) easier.

### Fixed

- TypeScript: fixed event typing and import issues introduced during refactor; updated internal helper usage to avoid runtime globals.

### Notes

- Public API unchanged (`src/toolbar/toolbar.ts` still re-exports `injectToolbar`).

## [0.2.0] - 2025-12-18

### Added

- Responsive toolbar layout: toolbar now wraps on narrow screens and includes an accessible overflow "More" menu that exposes less-used controls (format, font, size, color pickers, link). Overflow items reuse existing command handlers so functionality is preserved.

### Changed

- Toolbar styles updated with media queries to reduce spacing on small viewports, hide separators, and enable horizontal scrolling on very small screens.

### Fixed

- Preserve accessibility and keyboard support for toolbar controls when moved into the overflow menu (aria attributes, focus management, Esc to close).

## [0.1.0] - 2025-12-17

### Added

#### Core Features

- `initRichEditor()` — initialize the editor on an iframe element
- `getCleanHTML()` — export the full document HTML (with DOCTYPE)
- Text formatting: bold, italic, underline
- Font controls: font family and font size selectors
- Text alignment: set block text alignment
- Color controls: text color and highlight/background color
- Link insertion with URL sanitization
- Sticky toolbar injected into the edited document
- Undo/Redo with snapshot-based state management (configurable max stack size)
- Click-to-edit element selection with `contenteditable` and active styling

#### Security

- URL sanitization to block dangerous protocols (`javascript:`, `data:`) and normalize missing protocols
- HTML sanitization utilities via DOMPurify fallback

#### TypeScript & Packaging

- Public type exports and TypeScript declaration output
- Dual module outputs (ESM + CJS) and conditional `exports` defined in `package.json`

#### Event System

- `editorEventEmitter` for subscribing to editor events (contentChanged, undoStateChanged, redoStateChanged, selectionChanged, etc.)

#### Error Handling & Validation

- Input validation for iframe and document access
- Consistent error logging with `[rich-html-editor]` prefix

#### Testing & Tooling

- Test suite and unit tests using Vitest and jsdom (see `src/__tests__`)
- Build via `tsup` with declaration generation

### Fixed

- Fixed undo/redo behavior and related callbacks
- Restored type exports required for TypeScript consumers
- Adjusted package export ordering and metadata

### Changed

- Library is framework-agnostic (no framework-specific runtime dependencies)
- Improved error messages and event emission behavior

### Removed

- (Previously considered) framework-specific dependencies were removed to keep the package vanilla

### Security

- URL and HTML sanitization improvements to reduce XSS risk

## Notes for Contributors

### Testing

All changes should include corresponding unit tests. Aim for at least 70% code coverage.

### Browser Support

Test changes in Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. Report any compatibility issues.

### Types

All public APIs must be properly typed with TypeScript. Use JSDoc comments for complex types.

### Security

Any user input handling should include validation and sanitization. Be especially careful with URL and HTML handling.

### Performance

Monitor bundle size and initialization time. Keep the library lightweight and fast.
