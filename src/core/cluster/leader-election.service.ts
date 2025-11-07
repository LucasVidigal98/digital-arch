/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class LeaderElectionService {
  private redis: Redis;
  private checkInterval: NodeJS.Timeout;
  private readonly LEADER_KEY = 'cluster:leader';
  private readonly LEADER_TTL = 10000; // 10s

  constructor(@Inject('NODE_ID') private nodeId: string) {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });
    this.startElectionLoop();
  }

  private startElectionLoop() {
    this.checkInterval = setInterval(async () => {
      const now = Date.now();
      const currentLeader = await this.redis.get(this.LEADER_KEY);

      if (!currentLeader) {
        // Tenta se tornar líder
        const result = await this.redis.set(
          this.LEADER_KEY,
          this.nodeId,
          'PX',
          this.LEADER_TTL,
        );
        if (result) {
          console.log(`[LeaderElection] Node ${this.nodeId} agora é líder`);
        }
      } else if (currentLeader === this.nodeId) {
        // Atualiza TTL se já for líder
        await this.redis.pexpire(this.LEADER_KEY, this.LEADER_TTL);
      } else {
        console.log(
          `[LeaderElection] Node ${this.nodeId} reconhece líder: ${currentLeader}`,
        );
      }
    }, 5000);
  }

  async isLeader(): Promise<boolean> {
    const leader = await this.redis.get(this.LEADER_KEY);

    return this.nodeId === leader;
  }

  async stop() {
    clearInterval(this.checkInterval);
    await this.redis.quit();
  }
}
