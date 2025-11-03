import { Event } from '@core/events/event.interface';

export class SensorCreatedEvent implements Event {
  name: string = 'SensorCreatedEvent';
  ocurredAt: Date = new Date();

  constructor(public readonly payload: { id: string; name: string }) {}
}
