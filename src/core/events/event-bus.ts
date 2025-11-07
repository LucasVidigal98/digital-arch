/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { LeaderElectionService } from '@core/cluster/leader-election.service';
import { BullMQService } from '@core/queue/bullmq.service';
import { Injectable } from '@nestjs/common';

import { EventHandler } from './event-handler.inerface';
import { Event } from './event.interface';

@Injectable()
export class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  constructor(
    private readonly queueService: BullMQService,
    private leaerService: LeaderElectionService,
  ) {
    this.queueService.createWorker(async (job) => {
      console.log(`[AsyncEventBus] Processando evento: ${job.id}`);

      const { name } = job.data;

      const handlers = this.handlers.get(name) || [];
      for (const handler of handlers) {
        await handler.handle(job.data);
      }
    });
  }

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
    if (event.isCriticalEvent) {
      const isLeader = await this.leaerService.isLeader();

      if (isLeader) {
        console.log(`[AsyncEventBus] Evento ${event.name} enviado Pelo líder`);
        await this.queueService.addEvent(event.constructor.name, event);
      } else {
        console.log(
          '[AsyncEventBus] Node não-líder não envia eventos críticos',
        );
      }
    } else {
      await this.queueService.addEvent(event.constructor.name, event);
    }
  }

  public async replayEvents(events: Event[]) {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
