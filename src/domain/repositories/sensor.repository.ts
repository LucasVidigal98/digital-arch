import { Sensor } from '@domain/entities/sensor.entity';

export interface ISensorRepository {
  save(sensor: Sensor): Promise<Sensor>;
  findById(id: string): Promise<Sensor | null>;
  findAll(): Promise<Sensor[]>;
}
