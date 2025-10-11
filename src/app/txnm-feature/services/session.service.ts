import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionInfo } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionInfo: SessionInfo | null = null;
  private readonly SESSION_KEY = 'sessionInfo';

  constructor() {
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
    
    // Create session locally without API call
    const sessionInfo: SessionInfo = {
      sessionId,
      userType: 'GUEST',
      expiry: Date.now() + 3600000 // 1 hour
    };
    this.saveSession(sessionInfo);
    
    console.log('Created guest session locally:', sessionId);
    return of(sessionInfo);
  }

  validateSession(): Observable<boolean> {
    if (!this.sessionInfo) {
      return of(false);
    }

    // Validate session locally without API call
    const isValid = this.isSessionValid();
    console.log('Session validation (local):', isValid);
    
    return of(isValid);
  }

  refreshSession(): Observable<boolean> {
    if (!this.sessionInfo) {
      return of(false);
    }

    // Refresh session locally without API call
    this.sessionInfo.expiry = Date.now() + (this.sessionInfo.userType === 'GUEST' ? 3600000 : 86400000);
    this.saveSession(this.sessionInfo);
    
    console.log('Session refreshed locally:', this.sessionInfo.sessionId);
    return of(true);
  }

  deleteSession(): Observable<void> {
    if (!this.sessionInfo) {
      return of();
    }

    // Delete session locally without API call
    console.log('Deleting session locally:', this.sessionInfo.sessionId);
    this.sessionInfo = null;
    localStorage.removeItem(this.SESSION_KEY);
    
    return of();
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
