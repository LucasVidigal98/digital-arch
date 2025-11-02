import { Sensor } from '@domain/entities/sensor.entity';
import * as sensorRepository from '@domain/repositories/sensor.repository';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateSensorUseCase {
  constructor(
    @Inject('ISensorRepository')
    private readonly sensorRepo: sensorRepository.ISensorRepository,
  ) {}

  async execute(name: string, type: string): Promise<Sensor> {
    const id = typeof randomUUID === 'function' ? randomUUID() : '';

    const sensor = new Sensor(id, name, type);

    return this.sensorRepo.save(sensor);
  }
}
