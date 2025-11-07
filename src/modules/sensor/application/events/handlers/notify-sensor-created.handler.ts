import { EventHandler } from '@core/events/event-handler.inerface';

import { SensorCreatedEvent } from '../sensor-created.event';

export class NotifySensorCreatedHandler
  implements EventHandler<SensorCreatedEvent>
{
  handle(event: SensorCreatedEvent): Promise<void> | void {
    console.log(
      `[Event] Sensor criado: ${event.payload.name} (${event.payload.id})`,
    );
  }
}
