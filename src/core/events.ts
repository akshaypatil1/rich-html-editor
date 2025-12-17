import type { EditorEventType, EditorEvent, EditorEventHandler } from "./types";

export class EditorEventEmitter {
  private listeners: Map<EditorEventType, Set<EditorEventHandler>> = new Map();

  on(type: EditorEventType, handler: EditorEventHandler): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
    return () => this.off(type, handler);
  }

  once(type: EditorEventType, handler: EditorEventHandler): void {
    const unsubscribe = this.on(type, (event) => {
      handler(event);
      unsubscribe();
    });
  }

  off(type: EditorEventType, handler: EditorEventHandler): void {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) this.listeners.delete(type);
    }
  }

  emit(event: EditorEvent): void {
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(
            `[rich-html-editor] Error in event handler for ${event.type}:`,
            error
          );
        }
      });
    }
  }

  removeAllListeners(type?: EditorEventType): void {
    if (type) this.listeners.delete(type);
    else this.listeners.clear();
  }

  listenerCount(type: EditorEventType): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

export const editorEventEmitter = new EditorEventEmitter();

export function getEditorEventEmitter(): EditorEventEmitter {
  return editorEventEmitter;
}
