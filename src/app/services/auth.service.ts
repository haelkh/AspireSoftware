import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../models/user.model'; // We will create this model next
import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component'; // Import the component
import { SignupDialogComponent } from '../auth/signup-dialog/signup-dialog.component'; // Import signup component

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://eventschedulermk1.unaux.com/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private dialog: MatDialog) {
    // Check for saved user on startup
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, credentials).pipe(
      tap((response) => {
        if (response && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  register(details: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register.php`, details);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
      panelClass: 'auth-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
  }

  openSignupDialog(): void {
    this.dialog.open(SignupDialogComponent, {
      width: '400px',
      panelClass: 'auth-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
  }

  // We will add the methods to open dialogs here later
}
