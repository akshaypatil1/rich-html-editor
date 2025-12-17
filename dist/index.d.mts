/**
 * Public TypeScript types and interfaces for rich-html-editor
 */
/**
 * The state of text formatting in the current selection
 */
interface FormatState {
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
interface ToolbarOptions {
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
type EditorEventType = "contentChanged" | "undoStateChanged" | "redoStateChanged" | "selectionChanged" | "formatStateChanged" | "error";
interface EditorEvent {
    type: EditorEventType;
    timestamp: number;
    data?: unknown;
}
type EditorEventHandler = (event: EditorEvent) => void;
type FormattingCommand = "bold" | "italic" | "underline" | "fontName" | "fontSize" | "link" | "foreColor" | "hiliteColor" | "align" | "undo" | "redo";
type TextAlignment = "left" | "center" | "right" | "justify";
interface FontSizeMap {
    [key: string]: string;
}
interface EditorConfig {
    maxStackSize?: number;
    enableEvents?: boolean;
    toolbarOptions?: Partial<ToolbarOptions>;
    keyboardShortcuts?: boolean | {
        mapping?: Partial<Record<FormattingCommand | "undo" | "redo", string>>;
    };
}

/**
 * Initialize the rich HTML editor on an iframe element
 *
 * Sets up:
 * - State management (undo/redo stacks, current editable element)
 * - DOM styles for editable element highlighting
 * - Event handlers for click, selection change, and input events
 * - Toolbar UI with formatting buttons
 *
 * @param iframe - The target iframe element to enable editing on
 * @throws {Error} If iframe is invalid or contentDocument is not accessible
 *
 * @example
 * ```typescript
 * const iframe = document.querySelector('iframe');
 * initRichEditor(iframe);
 * ```
 */
declare function initRichEditor(iframe: HTMLIFrameElement, config?: EditorConfig): void;
/**
 * Get the cleaned HTML content from the edited document
 *
 * Returns the full HTML document with proper DOCTYPE declaration
 *
 * @returns HTML string with DOCTYPE, or empty string if editor not initialized
 * @throws {Error} If document is not properly initialized
 *
 * @example
 * ```typescript
 * const html = getCleanHTML();
 * console.log(html); // <!doctype html>\n<html>...</html>
 * ```
 */
declare function getCleanHTML(): string;

declare class EditorEventEmitter {
    private listeners;
    on(type: EditorEventType, handler: EditorEventHandler): () => void;
    once(type: EditorEventType, handler: EditorEventHandler): void;
    off(type: EditorEventType, handler: EditorEventHandler): void;
    emit(event: EditorEvent): void;
    removeAllListeners(type?: EditorEventType): void;
    listenerCount(type: EditorEventType): number;
}
declare const editorEventEmitter: EditorEventEmitter;
declare function getEditorEventEmitter(): EditorEventEmitter;

export { type EditorConfig, type EditorEvent, EditorEventEmitter, type EditorEventHandler, type EditorEventType, type FontSizeMap, type FormatState, type FormattingCommand, type TextAlignment, type ToolbarOptions, editorEventEmitter, getCleanHTML, getEditorEventEmitter, initRichEditor };
