import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface GetEventsResponse {
  data: Event[];
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost/eventScheduler/api/event/read.php'; // Adjust if your local server URL is different
  private events: Event[] = []; // This will now serve as a cache

  constructor(private http: HttpClient) {}

  getEvents(): Observable<Event[]> {
    return this.http.get<GetEventsResponse>(this.apiUrl).pipe(
      map((response) => {
        this.events = response.data;
        return this.events;
      })
    );
  }

  addEvent(event: Omit<Event, 'id' | 'status'>): Observable<Event> {
    // This will be replaced with an HTTP POST request
    console.log('Adding event (mock):', event);
    const newEvent: Event = {
      ...event,
      id: this.getNextId(),
      status: 'upcoming',
    };
    this.events.push(newEvent);
    return of(newEvent);
  }

  deleteEvent(eventId: number): Observable<void> {
    // This will be replaced with an HTTP DELETE request
    console.log('Deleting event (mock):', eventId);
    this.events = this.events.filter((event) => event.id !== eventId);
    return of(undefined);
  }

  getEventById(id: number): Observable<Event | undefined> {
    // This will be replaced with an HTTP GET request
    console.log('Getting event by ID (mock):', id);
    const event = this.events.find((e) => e.id === id);
    return of(event);
  }

  updateEvent(updatedEvent: Event): Observable<Event> {
    // This will be replaced with an HTTP PUT request
    console.log('Updating event (mock):', updatedEvent);
    const index = this.events.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      this.events[index] = updatedEvent;
    }
    return of(updatedEvent);
  }

  private getNextId(): number {
    return this.events.length > 0
      ? Math.max(...this.events.map((e) => e.id)) + 1
      : 1;
  }
}
