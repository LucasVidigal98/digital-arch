import { Event } from './event.interface';

export interface EventHandler<T extends Event = Event> {
  handle(event: T): Promise<void> | void;
}
