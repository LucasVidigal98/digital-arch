import { EventBus } from '@core/events/event-bus';
import { EventStoreService } from '@core/events/event-store.service';
import { Sensor } from '@domain/entities/sensor.entity';
import * as sensorRepository from '@domain/repositories/sensor.repository';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { SensorCreatedEvent } from '../events/sensor-created.event';

@Injectable()
export class CreateSensorUseCase {
  constructor(
    @Inject('ISensorRepository')
    private readonly sensorRepo: sensorRepository.ISensorRepository,
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStoreService,
  ) {}

  async execute(name: string, type: string): Promise<Sensor> {
    const id = typeof randomUUID === 'function' ? randomUUID() : '';

    const sensor = new Sensor(id, name, type);

    const event = new SensorCreatedEvent({ name, id });

    this.sensorRepo.save(sensor);

    await this.eventBus.publish(event);
    this.eventStore.save(event);

    return sensor;
  }
}
