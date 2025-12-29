// Public API

// Class-based editor (browser + framework usage)
export { default as RichHtmlEditor } from "./RichHtmlEditor";

// Functional API (advanced usage)
export { initRichEditor, getCleanHTML } from "./core/editor";

// Types
export type {
  FormatState,
  ToolbarOptions,
  EditorEvent,
  EditorEventType,
  EditorEventHandler,
  FormattingCommand,
  TextAlignment,
  FontSizeMap,
  EditorConfig,
} from "./core/types";

// Event system
export { editorEventEmitter, getEditorEventEmitter } from "./core/events";
export type { EditorEventEmitter } from "./core/events";
