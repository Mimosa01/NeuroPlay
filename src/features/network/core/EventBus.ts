import type { EventType, EventMap, Event } from "../types/event.types";

type EventHandler<T extends EventType> = (event: Event<T>) => void;

export class EventBus {
  private listeners = new Map<EventType, Set<EventHandler<EventType>>>();

  subscribe<T extends EventType>(type: T, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    const handlers = this.listeners.get(type)!;
    handlers.add(handler as EventHandler<EventType>);
    return () => {
      handlers.delete(handler as EventHandler<EventType>);
    };
  }

  publish<T extends EventType>(type: T, payload: EventMap[T]): void {
    const event: Event<T> = { type, payload };
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => (handler as EventHandler<T>)(event));
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();