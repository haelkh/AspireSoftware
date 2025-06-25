import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventFormComponent } from './event-form/event-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'new-event', component: EventFormComponent },
];
