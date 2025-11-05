import { Sensor } from '@domain/entities/sensor.entity';
import { CreateSensorUseCase } from '@modules/sensor/application/use-cases/create-sensor.usecase';
import { InMemomorySensorRepository } from '@modules/sensor/infrastructure/persistence/im-memory-sensor.repository';
import { CreateSensorDto } from '@modules/sensor/interfaces/dtos/create-sensor.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('sensor')
export class SensorController {
  private readonly repo = new InMemomorySensorRepository();

  constructor(private readonly createSensorUseCase: CreateSensorUseCase) {}

  @Post()
  async create(@Body() dto: CreateSensorDto): Promise<Sensor> {
    return this.createSensorUseCase.execute(dto.name, dto.type);
  }

  @Get()
  async findAll(): Promise<Sensor[]> {
    return this.repo.findAll();
  }
}
