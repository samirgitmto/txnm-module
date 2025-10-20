import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionInfo } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionInfo: SessionInfo | null = null; // Memory only
  
  constructor() {
    // No automatic session loading
    // Session created only when needed
  }
  
  createSessionForUpload(): string {
    // Clear any existing session
    this.clearCurrentSession();
    
    // Generate new sessionId
    const sessionId = this.generateUUID();
    
    // Store in memory only
    this.sessionInfo = {
      sessionId,
      userType: 'GUEST',
      expiry: Date.now() + 3600000, // 1 hour
      browserId: this.generateBrowserId() // Unique per browser
    };
    
    return sessionId;
  }
  
  private clearCurrentSession(): void {
    this.sessionInfo = null;
    // No localStorage cleanup needed (memory-only)
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

  private generateBrowserId(): string {
    return 'browser-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
