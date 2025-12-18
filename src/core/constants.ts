// Shared constants for the rich-html-editor (moved to core)
export const TOOLBAR_ID = "editor-toolbar";
export const STYLE_ID = "editor-styles";
export const CLASS_EDITABLE = "editor-editable-element";
export const CLASS_ACTIVE = "editor-active-element";

// Default undo/redo stack size
export const DEFAULT_MAX_STACK = 60;

// Toolbar styling constants
export const TOOLBAR_BG = "#f8fafc";
export const TOOLBAR_BORDER = "#e5e7eb";
export const BUTTON_BORDER = "#d1d5db";
export const BUTTON_ACTIVE_BG = "#e0e7ff";
export const BUTTON_BG = "#fff";
export const BUTTON_COLOR = "#222";
export const INFO_COLOR = "#888";

// Outline colors used by injected styles
export const HOVER_OUTLINE = "#2563eb";
export const ACTIVE_OUTLINE = "#16a34a";

// Toolbar label/icon constants (kept in core for reuse)
export const LABEL_BOLD = "<b>B</b>";
export const LABEL_ITALIC = "<i>I</i>";
export const LABEL_UNDERLINE = "<u>U</u>";
export const LABEL_STRIKETHROUGH = "<s>S</s>";
export const LABEL_UNDO = "↺";
export const LABEL_REDO = "↻";
export const LABEL_LINK = "🔗";
export const LABEL_ALIGN_LEFT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="1" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
export const LABEL_ALIGN_CENTER = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="3" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="3" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;
export const LABEL_ALIGN_RIGHT = `
	<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<rect x="5" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="6" width="14" height="2" rx="0.5" fill="currentColor" />
		<rect x="5" y="10" width="10" height="2" rx="0.5" fill="currentColor" />
		<rect x="1" y="14" width="14" height="2" rx="0.5" fill="currentColor" />
	</svg>
`;

// Font and size option lists used by the toolbar
export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "Trebuchet MS, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, Times, serif" },
  { label: "Palatino", value: "Palatino, 'Palatino Linotype', serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Book Antiqua", value: "'Book Antiqua', Palatino, serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Lucida Console", value: "'Lucida Console', Monaco, monospace" },
  { label: "Impact", value: "Impact, Charcoal, sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', 'Comic Sans', cursive" },
  { label: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, sans-serif" },
  {
    label: "Roboto",
    value: "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  { label: "Open Sans", value: "'Open Sans', Arial, sans-serif" },
  { label: "Lato", value: "Lato, 'Helvetica Neue', Arial, sans-serif" },
  { label: "Montserrat", value: "Montserrat, Arial, sans-serif" },
  { label: "Source Sans Pro", value: "'Source Sans Pro', Arial, sans-serif" },
  { label: "Fira Sans", value: "'Fira Sans', Arial, sans-serif" },
  { label: "Ubuntu", value: "Ubuntu, Arial, sans-serif" },
  { label: "Noto Sans", value: "'Noto Sans', Arial, sans-serif" },
  { label: "Droid Sans", value: "'Droid Sans', Arial, sans-serif" },
  {
    label: "Helvetica Neue",
    value: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  {
    label: "System UI",
    value:
      "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
];

export const SIZE_OPTIONS: { label: string; value: string }[] = [
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
  { label: "14", value: "14" },
  { label: "16", value: "16" },
  { label: "18", value: "18" },
  { label: "20", value: "20" },
  { label: "22", value: "22" },
  { label: "24", value: "24" },
  { label: "26", value: "26" },
  { label: "28", value: "28" },
  { label: "36", value: "36" },
  { label: "48", value: "48" },
  { label: "72", value: "72" },
];

// Block format options (Paragraph + Headings)
export const FORMAT_OPTIONS: { label: string; value: string }[] = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" },
];

// Shared SVG used by toolbar color inputs (palette icon)
export const PALETTE_SVG = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2C7 2 3 6 3 11c0 2.8 1.4 5.3 3.7 6.8.9.6 2 .9 3.3.9 1.6 0 3.1-.5 4.3-1.4.6-.4.9-1.1.6-1.8-.3-.7-1-1-1.7-.8-1.1.3-2.3.2-3.4-.3C10.3 14.6 9 13.6 9 12c0-1.7 1.3-3 3-3 .8 0 1.5.3 2.1.8.5.4 1.2.3 1.6-.2.9-1.1 1.4-2.4 1.4-3.8C20.9 6 16.9 2 12 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="7.5" cy="10.5" r="1" fill="currentColor"/>
    <circle cx="11.5" cy="8.5" r="1" fill="currentColor"/>
    <circle cx="14.5" cy="11.5" r="1" fill="currentColor"/>
  </svg>
`;

// MS Word-like icons for color controls
export const TEXT_COLOR_ICON_HTML = `
  <span class="text-color-wrapper" aria-hidden="true">
    <span class="text-A">A</span>
  </span>
`;

export const HIGHLIGHT_ICON_HTML = `
  <span class="highlight-wrapper" aria-hidden="true">
    <span class="highlight-bar" data-role="highlight"></span>
    <span class="text-A">A</span>
  </span>
`;
