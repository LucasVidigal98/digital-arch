import { Injectable } from '@nestjs/common';

import { Event } from './event.interface';

@Injectable()
export class EventStoreService {
  private events: Event[] = [];

  save(event: Event) {
    this.events.push({ ...event });
  }

  getAll(): Event[] {
    return this.events;
  }

  findByType(type: string): Event[] {
    return this.events.filter((e) => e.constructor.name === type);
  }
}
