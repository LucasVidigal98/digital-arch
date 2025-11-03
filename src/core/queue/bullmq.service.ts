import { Injectable } from '@nestjs/common';
import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class BullMQService {
  private redis: Redis;
  public queue: Queue;
  public worker: Worker;
  public events: QueueEvents;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });
    this.queue = new Queue('events', { connection: this.redis });
    this.events = new QueueEvents('events', { connection: this.redis });

    console.log('[BullMQ] Queue initialized');
  }

  async addEvent(eventName: string, payload: any) {
    await this.queue.add(eventName, payload, {
      removeOnComplete: true,
    });
  }

  createWorker(processCallback: (job: Job) => Promise<void>) {
    this.worker = new Worker('events', processCallback, {
      connection: this.redis,
    });

    this.worker.on('completed', (job) =>
      console.log(`[BullMQ] Job ${job.id} completed`),
    );

    this.worker.on('failed', (job, err) =>
      console.error(`[BullMQ] Job ${job?.id} failed:`, err),
    );
  }
}
