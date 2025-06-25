import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  events: Event[] = [];
  private allEvents: Event[] = [];

  constructor(
    private eventService: EventService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.refreshEvents();
    this.searchService.searchTerm$.subscribe((term) => {
      this.filterEvents(term);
    });
  }

  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.refreshEvents();
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
