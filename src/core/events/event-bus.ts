import { Injectable } from '@nestjs/common';

import { EventHandler } from './event-handler.inerface';
import { Event } from './event.interface';

@Injectable()
export class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  public subscribe<T extends Event>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)!.push(handler);
  }

  public async publish<T extends Event>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.name) ?? [];

    for (const handler of handlers) {
      await handler.handle(event);
    }
  }
}
