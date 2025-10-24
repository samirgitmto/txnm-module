import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from './session.service';
import { SessionInfo } from '../models/api-response.model';

export interface User {
  id: number;
  email: string | null;
  googleId: string | null;
  fullName: string | null;
  userType: 'GUEST' | 'REGISTERED';
  sessionId: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public user$ = this.userSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private sessionService: SessionService) {
  }

  private async initializeAuth(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      const sessionId = this.sessionService.getSessionId();
      if (sessionId) {
        // SessionService now validates locally, so we can trust it
        const sessionInfo = this.sessionService.getSessionInfo();
        if (sessionInfo && this.sessionService.isSessionValid()) {
          const user: User = {
            id: 0, // This will be set by the backend
            email: sessionInfo.email || null,
            googleId: null,
            fullName: sessionInfo.fullName || null,
            userType: sessionInfo.userType,
            sessionId: sessionInfo.sessionId,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          this.userSubject.next(user);
        } else {
          // Session is invalid, clear it
          // await this.sessionService.deleteSession().toPromise();
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      this.errorSubject.next('Failed to initialize authentication');
    } finally {
      this.loadingSubject.next(false);
    }
  }

  loginAsGuest(): Observable<User> {
    return new Observable(observer => {
      // Create new session for this upload
      const sessionId = this.sessionService.createSessionForUpload();
      
      const user: User = {
        id: 0,
        email: null,
        googleId: null,
        fullName: null,
        userType: 'GUEST',
        sessionId: sessionId,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.userSubject.next(user);
      observer.next(user);
      observer.complete();
    });
  }


  // logout(): Observable<void> {
  //   return new Observable(observer => {
  //     this.sessionService.deleteSession().subscribe({
  //       next: () => {
  //         this.userSubject.next(null);
  //         this.errorSubject.next(null);
  //         observer.next();
  //         observer.complete();
  //       },
  //       error: (error) => {
  //         console.error('Logout error:', error);
  //         this.errorSubject.next('Failed to logout');
  //         observer.error(error);
  //       }
  //     });
  //   });
  // }


  // auth.service.ts
logout(): Observable<void> {
  return new Observable(observer => {
    this.userSubject.next(null);
    this.errorSubject.next(null);
    observer.next();
    observer.complete();
  });
}

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  isGuest(): boolean {
    const user = this.getCurrentUser();
    return user?.userType === 'GUEST';
  }

  getSessionId(): string | null {
    return this.sessionService.getSessionId();
  }
}
