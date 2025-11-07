import { ClusterModule } from '@core/cluster/cluster.module';
import { BullMQService } from '@core/queue/bullmq.service';
import { Module } from '@nestjs/common';

import { EventBus } from './event-bus';
import { EventStoreService } from './event-store.service';

@Module({
  imports: [ClusterModule],
  providers: [EventBus, EventStoreService, BullMQService],
  exports: [EventBus, EventStoreService, BullMQService, ClusterModule],
})
export class EventsModule {}
