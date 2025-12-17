// Main entry point for the rich-html-editor util
// Plug-and-play HTML editor API

// Core functions
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
