import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../models/event.model';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatButtonToggleModule,
  MatButtonToggleChange,
} from '@angular/material/button-toggle';
import { SearchService } from '../services/search.service';
import { RouterModule } from '@angular/router';
import { AiService } from '../services/ai.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  private allEvents: Event[] = [];
  summarizingEventIds = new Set<number>();
  currentUser: User | null = null;
  private authSubscription!: Subscription;

  constructor(
    private eventService: EventService,
    private searchService: SearchService,
    private aiService: AiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.refreshEvents();
    this.searchService.searchTerm$.subscribe((term) => {
      this.filterEvents(term);
    });
    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  editEvent(event: Event): void {
    this.eventService.openEventDialog(event).subscribe((result) => {
      if (result) {
        this.refreshEvents();
      }
    });
  }

  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.refreshEvents();
    });
  }

  summarizeDescription(event: Event): void {
    if (!event.description || this.summarizingEventIds.has(event.id)) return;

    this.summarizingEventIds.add(event.id);
    this.aiService.summarizeDescription(event.description).subscribe({
      next: (response) => {
        // Update the description for this event in both arrays
        const update = (e: Event) =>
          e.id === event.id ? { ...e, description: response.summary } : e;
        this.events = this.events.map(update);
        this.allEvents = this.allEvents.map(update);
        this.summarizingEventIds.delete(event.id);
      },
      error: (err) => {
        console.error('Error summarizing description:', err);
        this.summarizingEventIds.delete(event.id);
      },
    });
  }

  onStatusChange(change: MatButtonToggleChange, event: Event): void {
    const updatedEvent = { ...event, status: change.value };
    this.eventService.updateEvent(updatedEvent).subscribe(() => {
      // Optionally refresh just this event in the UI for better performance
      const index = this.events.findIndex((e) => e.id === updatedEvent.id);
      if (index !== -1) {
        this.events[index] = updatedEvent;
      }
    });
  }

  private refreshEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.allEvents = events;
      this.events = events;
    });
  }

  private filterEvents(searchTerm: string): void {
    const lowerCaseTerm = searchTerm.toLowerCase();
    this.events = this.allEvents.filter((event) =>
      event.title.toLowerCase().includes(lowerCaseTerm)
    );
  }
}
