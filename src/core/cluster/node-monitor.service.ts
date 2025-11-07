import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NodeMonitorService implements OnModuleDestroy {
  private redis: Redis;
  private interval: NodeJS.Timeout;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.interval = setInterval(async () => this.checkNodes(), 7000); // verifica a cada 7s
    console.log('[Cluster] Monitor iniciado');
  }

  async checkNodes() {
    const keys = await this.redis.keys('heartbeat:*');
    console.log(
      '[Cluster] Nodes ativos:',
      keys.map((k) => k.replace('heartbeat:', '')),
    );
  }

  async onModuleDestroy() {
    clearInterval(this.interval);
    await this.redis.quit();
  }
}
