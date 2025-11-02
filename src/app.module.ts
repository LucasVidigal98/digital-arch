import { SensorModule } from '@modules/sensor/sensor.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SensorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
