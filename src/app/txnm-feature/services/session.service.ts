import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { SessionInfo } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionInfo: SessionInfo | null = null;
  private readonly SESSION_KEY = 'sessionInfo';

  constructor(private baseApi: BaseApiService) {
    this.loadSession();
  }

  private loadSession(): void {
    const storedSession = localStorage.getItem(this.SESSION_KEY);
    if (storedSession) {
      this.sessionInfo = JSON.parse(storedSession);
    }
  }

  private saveSession(sessionInfo: SessionInfo): void {
    this.sessionInfo = sessionInfo;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionInfo));
  }

  createGuestSession(): Observable<SessionInfo> {
    const sessionId = this.generateUUID();
    
    console.log('Request URL:', `${this.baseApi['baseUrl']}/session/guest?sessionId=${sessionId}`);
    
    return this.baseApi.post<{ success: boolean }>(`/session/guest?sessionId=${sessionId}`, {}).pipe(
      map(response => {
        if (response.success) {
          const sessionInfo: SessionInfo = {
            sessionId,
            userType: 'GUEST',
            expiry: Date.now() + 3600000 // 1 hour
          };
          this.saveSession(sessionInfo);
          return sessionInfo;
        }
        throw new Error('Failed to create guest session');
      }),
      catchError(error => {
        console.error('Guest session creation error:', error);
        return throwError(() => error);
      })
    );
  }

  validateSession(): Observable<boolean> {
    if (!this.sessionInfo) {
      return of(false);
    }

    console.log('Request URL:', `${this.baseApi['baseUrl']}/session/validate?sessionId=${this.sessionInfo.sessionId}`);
    
    return this.baseApi.get<{ success: boolean }>(`/session/validate?sessionId=${this.sessionInfo.sessionId}`).pipe(
      map(response => response.success),
      catchError(error => {
        console.error('Session validation error:', error);
        return of(false);
      })
    );
  }

  refreshSession(): Observable<boolean> {
    if (!this.sessionInfo) {
      return of(false);
    }

    console.log('Request URL:', `${this.baseApi['baseUrl']}/session/refresh?sessionId=${this.sessionInfo.sessionId}`);
    
    return this.baseApi.post<{ success: boolean }>(`/session/refresh?sessionId=${this.sessionInfo.sessionId}`, {}).pipe(
      map(response => {
        if (response.success) {
          // Update expiry time
          this.sessionInfo!.expiry = Date.now() + (this.sessionInfo!.userType === 'GUEST' ? 3600000 : 86400000);
          this.saveSession(this.sessionInfo!);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Session refresh error:', error);
        return of(false);
      })
    );
  }

  deleteSession(): Observable<void> {
    if (!this.sessionInfo) {
      return of();
    }

    console.log('Request URL:', `${this.baseApi['baseUrl']}/session/logout?sessionId=${this.sessionInfo.sessionId}`);
    
    return this.baseApi.post<{ success: boolean }>(`/session/logout?sessionId=${this.sessionInfo.sessionId}`, {}).pipe(
      map(() => {
        this.sessionInfo = null;
        localStorage.removeItem(this.SESSION_KEY);
      }),
      catchError(error => {
        console.error('Session deletion error:', error);
        // Clear session even if API call fails
        this.sessionInfo = null;
        localStorage.removeItem(this.SESSION_KEY);
        return of();
      })
    );
  }

  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo;
  }

  isSessionValid(): boolean {
    if (!this.sessionInfo) return false;
    return Date.now() < this.sessionInfo.expiry;
  }

  isRegisteredUser(): boolean {
    return this.sessionInfo?.userType === 'REGISTERED';
  }

  getSessionId(): string | null {
    return this.sessionInfo?.sessionId || null;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
