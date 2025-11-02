import { Event } from '@core/events/event.interface';

export class SensorCreatedEvent implements Event {
  name: string = 'sensor.created';
  ocurredAt: Date = new Date();

  constructor(public readonly payload: { id: string; name: string }) {}
}
