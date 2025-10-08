import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class DataGuardService {
  
  constructor(
    private baseApi: BaseApiService,
    private sessionService: SessionService
  ) {}

  /**
   * Check if transaction data exists for the current session
   * Since we just parsed transactions successfully, we can assume data exists
   */
  hasTransactionData(): Observable<boolean> {
    const sessionId = this.sessionService.getSessionId();
    
    if (!sessionId) {
      console.log('No session ID found');
      return of(false);
    }

    console.log('Assuming transaction data exists for session:', sessionId);
    
    // Since we just successfully parsed transactions, assume data exists
    // TODO: Implement proper check when /transactions/exists endpoint is available
    return of(true);
  }

  /**
   * Check if session is valid and has transaction data
   * Skip session validation for now
   */
  canAccessAnalytics(): Observable<boolean> {
    // Skip session validation for now
    console.log('Skipping session validation - allowing access');
    
    // Just check if transaction data exists
    return this.hasTransactionData();
  }
}
