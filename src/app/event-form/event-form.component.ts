import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { EventService } from '../services/event.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Event } from '../models/event.model';
import { AiService } from '../services/ai.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  isParsing = false;
  private eventId?: number;
  naturalLanguageText = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    public dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event | null,
    private aiService: AiService
  ) {
    this.isEditMode = !!this.data;
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.eventForm.patchValue(this.data);
    }
  }

  onParseText() {
    if (!this.naturalLanguageText) return;
    this.isParsing = true;
    this.aiService.parseEventText(this.naturalLanguageText).subscribe({
      next: (parsedEvent) => {
        this.eventForm.patchValue(parsedEvent);
        this.isParsing = false;
      },
      error: (err) => {
        console.error('Error parsing event text:', err);
        // You can add user-facing error handling here
        this.isParsing = false;
      },
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    const eventData = { ...this.data, ...this.eventForm.value };

    // NOTE: This part needs to be updated to use the real backend endpoints
    // For now, it will use the mock service methods.
    const saveObservable = this.isEditMode
      ? this.eventService.updateEvent(eventData)
      : this.eventService.addEvent(eventData);

    saveObservable.subscribe(() => {
      this.dialogRef.close(true); // Close dialog and signal success
    });
  }
}
