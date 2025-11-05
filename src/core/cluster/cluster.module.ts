import { Module } from '@nestjs/common';

import { HeartBeatService } from './heartbeat.service';
import { LeaderElectionService } from './leader-election.service';
import { NodeMonitorService } from './node-monitor.service';

const nodeId = `worker-${Math.floor(Math.random() * 10000)}`;

@Module({
  providers: [
    { provide: 'NODE_ID', useValue: nodeId },
    HeartBeatService,
    NodeMonitorService,
    LeaderElectionService,
  ],
})
export class ClusterModule {}
