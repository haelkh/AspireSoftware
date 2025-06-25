import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css'],
})
export class SignupDialogComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    private dialog: MatDialog
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
        // Optionally, we could open a "Registration successful" dialog here
        // or automatically log the user in. For now, we'll just close.
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
