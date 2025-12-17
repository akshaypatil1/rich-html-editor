/**
 * Public TypeScript types and interfaces for rich-html-editor
 */

/**
 * The state of text formatting in the current selection
 */
export interface FormatState {
  /** Whether the selection contains bold text */
  bold: boolean;
  /** Whether the selection contains italic text */
  italic: boolean;
  /** Whether the selection contains underlined text */
  underline: boolean;
}

/**
 * Toolbar configuration and callback options
 */
export interface ToolbarOptions {
  /** Callback when a formatting command is executed */
  onCommand: (command: string, value?: string) => void;
  /** Function to determine if undo is available */
  canUndo: () => boolean;
  /** Function to determine if redo is available */
  canRedo: () => boolean;
  /** Callback when undo button is clicked */
  onUndo: () => void;
  /** Callback when redo button is clicked */
  onRedo: () => void;
  /** Function to get current formatting state */
  getFormatState: () => FormatState;
  /** Function to get information about selected element */
  getSelectedElementInfo: () => string | null;
}

export type EditorEventType =
  | "contentChanged"
  | "undoStateChanged"
  | "redoStateChanged"
  | "selectionChanged"
  | "formatStateChanged"
  | "error";

export interface EditorEvent {
  type: EditorEventType;
  timestamp: number;
  data?: unknown;
}

export type EditorEventHandler = (event: EditorEvent) => void;

export type FormattingCommand =
  | "bold"
  | "italic"
  | "underline"
  | "fontName"
  | "fontSize"
  | "link"
  | "foreColor"
  | "hiliteColor"
  | "align"
  | "undo"
  | "redo";

export type TextAlignment = "left" | "center" | "right" | "justify";

export interface FontSizeMap {
  [key: string]: string;
}

export interface EditorConfig {
  maxStackSize?: number;
  enableEvents?: boolean;
  toolbarOptions?: Partial<ToolbarOptions>;
  keyboardShortcuts?:
    | boolean
    | {
        mapping?: Partial<Record<FormattingCommand | "undo" | "redo", string>>;
      };
}
