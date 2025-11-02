import { Sensor } from '@domain/entities/sensor.entity';
import { ISensorRepository } from '@domain/repositories/sensor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemomorySensorRepository implements ISensorRepository {
  private sensors: Sensor[] = [];

  save(sensor: Sensor): Promise<Sensor> {
    this.sensors.push(sensor);

    return Promise.resolve(sensor);
  }

  findById(id: string): Promise<Sensor | null> {
    const foundSensor = this.sensors.find(({ id: i }) => i === id);

    if (foundSensor) {
      return Promise.resolve(foundSensor);
    }

    return Promise.resolve(null);
  }

  findAll(): Promise<Sensor[]> {
    return Promise.all(this.sensors);
  }
}
