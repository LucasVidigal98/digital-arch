import { CreateSensorUseCase } from '@application/use-cases/create-sensor.usecase';
import { Sensor } from '@domain/entities/sensor.entity';
import { InMemomorySensorRepository } from '@infrastructure/persistence/im-memory-sensor.repository';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSensorDto } from 'interfaces/dtos/create-sensor.dto';

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
