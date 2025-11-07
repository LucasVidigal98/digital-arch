import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class HeartBeatService implements OnModuleDestroy {
  private redis: Redis;
  private interval: NodeJS.Timeout;

  constructor(@Inject('NODE_ID') private nodeId: string) {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.interval = setInterval(async () => this.sendHeartBeat(), 5000);
    console.log(`[Heartbeat] Node ${this.nodeId} iniciado`);
  }

  async sendHeartBeat() {
    await this.redis.set(`heartbeat:${this.nodeId}`, Date.now(), 'EX', 10);
    console.log(`[Heartbeat] Node ${this.nodeId} ativo`);
  }

  async onModuleDestroy() {
    clearInterval(this.interval);
    await this.redis.quit();
  }
}
