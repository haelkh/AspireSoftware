import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EventFormComponent } from '../event-form/event-form.component';
import { AuthService } from './auth.service';

interface GetEventsResponse {
  data: Event[];
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'https://eventschedulermk1.unaux.com/api/event/read.php'; // Adjust if your local server URL is different
  private updateStatusUrl =
    'https://eventschedulermk1.unaux.com/api/event/update_status.php';
  private events: Event[] = []; // This will now serve as a cache

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  openEventDialog(event?: Event): Observable<any> {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '600px',
      data: event, // Pass event data for editing, or null for creating
      panelClass: 'auth-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });

    return dialogRef.afterClosed();
  }

  getEvents(): Observable<Event[]> {
    const user = this.authService.currentUserValue;
    let url = this.apiUrl;
    if (user) {
      url += `?userId=${user.id}`;
    }
    return this.http.get<GetEventsResponse>(url).pipe(
      map((response) => {
        this.events = response.data;
        return this.events;
      })
    );
  }

  updateEventStatus(eventId: number, status: string): Observable<any> {
    const user = this.authService.currentUserValue;
    if (!user) {
      // Or handle this case as you see fit, e.g., by throwing an error or returning a specific Observable
      return of({ message: 'User not logged in.' });
    }
    const payload = {
      userId: user.id,
      eventId: eventId,
      status: status,
    };
    return this.http.post(this.updateStatusUrl, payload);
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
