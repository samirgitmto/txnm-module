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
   */
  hasTransactionData(): Observable<boolean> {
    const sessionId = this.sessionService.getSessionId();
    
    if (!sessionId) {
      console.log('No session ID found');
      return of(false);
    }

    console.log('Checking transaction data for session:', sessionId);
    
    return this.baseApi.get<{ exists: boolean }>(`/transactions/exists?sessionId=${sessionId}`).pipe(
      map(response => {
        console.log('Transaction data exists:', response.data?.exists);
        return response.data?.exists || false;
      }),
      catchError(error => {
        console.error('Error checking transaction data:', error);
        return of(false);
      })
    );
  }

  /**
   * Check if session is valid and has transaction data
   */
  canAccessAnalytics(): Observable<boolean> {
    // First check if session is valid
    if (!this.sessionService.isSessionValid()) {
      console.log('Session is not valid');
      return of(false);
    }

    // Then check if transaction data exists
    return this.hasTransactionData();
  }
}
