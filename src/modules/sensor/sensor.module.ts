import { EventBus } from '@core/events/event-bus';
import { EventStoreService } from '@core/events/event-store.service';
import { BullMQService } from '@core/queue/bullmq.service';
import { Module } from '@nestjs/common';

import { NotifySensorCreatedHandler } from './application/events/handlers/notify-sensor-created.handler';
import { CreateSensorUseCase } from './application/use-cases/create-sensor.usecase';
import { InMemomorySensorRepository } from './infrastructure/persistence/im-memory-sensor.repository';
import { SensorController } from './interfaces/controllers/sensor.controller';

@Module({
  controllers: [SensorController],
  providers: [
    CreateSensorUseCase,
    { provide: 'ISensorRepository', useClass: InMemomorySensorRepository },
    EventBus,
    EventStoreService,
    BullMQService,
    NotifySensorCreatedHandler,
  ],
})
export class SensorModule {
  constructor(
    private readonly eventBus: EventBus,
    private readonly notifySensorCreatedHandler: NotifySensorCreatedHandler,
  ) {
    this.eventBus.subscribe(
      'SensorCreatedEvent',
      this.notifySensorCreatedHandler,
    );
  }
}
