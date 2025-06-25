import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private authSubscription!: Subscription;

  constructor(
    private searchService: SearchService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchService.search(input.value);
  }

  login(): void {
    this.authService.openLoginDialog();
  }

  addEvent(): void {
    this.eventService.openEventDialog().subscribe((result) => {
      if (result) {
        console.log('Event dialog closed with success. Refresh needed.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
