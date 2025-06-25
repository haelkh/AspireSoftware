import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Angular Conference',
      date: new Date('2024-10-26T10:00:00'),
      location: 'Online',
      description: 'The biggest Angular conference in the world.',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Tech Meetup',
      date: new Date('2024-11-15T18:30:00'),
      location: 'New York, NY',
      description: 'A meetup for tech enthusiasts.',
      status: 'attending',
    },
  ];

  constructor() {}

  getEvents(): Observable<Event[]> {
    return of(this.events);
  }

  addEvent(event: Omit<Event, 'id' | 'status'>): Observable<Event> {
    const newEvent: Event = {
      ...event,
      id: this.getNextId(),
      status: 'upcoming',
    };
    this.events.push(newEvent);
    return of(newEvent);
  }

  private getNextId(): number {
    return this.events.length > 0
      ? Math.max(...this.events.map((e) => e.id)) + 1
      : 1;
  }
}
