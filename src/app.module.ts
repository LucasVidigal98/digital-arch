import { ClusterModule } from '@core/cluster/cluster.module';
import { SensorModule } from '@modules/sensor/sensor.module';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SensorModule, ClusterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
