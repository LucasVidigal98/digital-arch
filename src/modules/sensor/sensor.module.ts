import { EventBus } from '@core/events/event-bus';
import { EventsModule } from '@core/events/events.module';
import { Module } from '@nestjs/common';

import { NotifySensorCreatedHandler } from './application/events/handlers/notify-sensor-created.handler';
import { CreateSensorUseCase } from './application/use-cases/create-sensor.usecase';
import { InMemomorySensorRepository } from './infrastructure/persistence/im-memory-sensor.repository';
import { SensorController } from './interfaces/controllers/sensor.controller';

@Module({
  imports: [EventsModule],
  controllers: [SensorController],
  providers: [
    CreateSensorUseCase,
    { provide: 'ISensorRepository', useClass: InMemomorySensorRepository },
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
