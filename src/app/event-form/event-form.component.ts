import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  private eventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.eventService.getEventById(this.eventId).subscribe((event) => {
          if (event) {
            this.eventForm.patchValue(event);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      if (this.isEditMode && this.eventId) {
        const updatedEvent: Event = {
          ...this.eventForm.value,
          id: this.eventId,
          status: 'upcoming', // or get it from form if editable
        };
        this.eventService.updateEvent(updatedEvent).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      } else {
        this.eventService.addEvent(this.eventForm.value).subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    }
  }
}
