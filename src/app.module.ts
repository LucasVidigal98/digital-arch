import { CreateSensorUseCase } from '@application/use-cases/create-sensor.usecase';
import { InMemomorySensorRepository } from '@infrastructure/persistence/im-memory-sensor.repository';
import { Module } from '@nestjs/common';
import { SensorController } from 'interfaces/controllers/sensor.controller';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, SensorController],
  providers: [
    AppService,
    CreateSensorUseCase,
    { provide: 'ISensorRepository', useClass: InMemomorySensorRepository },
  ],
})
export class AppModule {}
