/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BullMQService } from '@core/queue/bullmq.service';
import { Injectable } from '@nestjs/common';

import { EventHandler } from './event-handler.inerface';
import { Event } from './event.interface';

@Injectable()
export class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  constructor(private readonly queueService: BullMQService) {
    this.queueService.createWorker(async (job) => {
      console.log(`[AsyncEventBus] Processando evento: ${job.id}`);

      const { eventName, payload } = job.data;
      const handlers = this.handlers.get(eventName) || [];
      console.log(handlers);
      for (const handler of handlers) {
        await handler.handle(payload);
      }
    });
  }

  public subscribe<T extends Event>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    console.log('aqui');
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)!.push(handler);
  }

  public async publish<T extends Event>(event: T): Promise<void> {
    await this.queueService.addEvent(event.constructor.name, event);
  }

  public async replayEvents(events: Event[]) {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
