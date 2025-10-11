import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, timer } from 'rxjs';
import { map, takeUntil, filter, tap } from 'rxjs/operators';
import { AnalysisStatus, AnalysisProgress, SpendingInsights } from '../models/api-response.model';
import { TransactionService } from './transaction.service';

export interface AnalysisState {
  requestId: string | null;
  sessionId: string | null;
  status: 'IDLE' | 'REQUESTING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: AnalysisProgress | null;
  insights: SpendingInsights | null;
  error: string | null;
  startTime: number | null;
  lastUpdate: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AIAnalysisStateService {
  private destroy$ = new Subject<void>();
  
  // State management
  private stateSubject = new BehaviorSubject<AnalysisState>({
    requestId: null,
    sessionId: null,
    status: 'IDLE',
    progress: null,
    insights: null,
    error: null,
    startTime: null,
    lastUpdate: null
  });

  // Public observables
  public state$ = this.stateSubject.asObservable();
  public status$ = this.state$.pipe(map(state => state.status));
  public progress$ = this.state$.pipe(map(state => state.progress));
  public insights$ = this.state$.pipe(map(state => state.insights));
  public error$ = this.state$.pipe(map(state => state.error));

  constructor(private transactionService: TransactionService) {}

  /**
   * Start a new AI analysis request
   */
  startAnalysis(sessionId: string): Observable<string> {
    console.log('Starting AI analysis for session:', sessionId);
    
    // Reset state
    this.updateState({
      requestId: null,
      sessionId,
      status: 'REQUESTING',
      progress: null,
      insights: null,
      error: null,
      startTime: Date.now(),
      lastUpdate: Date.now()
    });

    return this.transactionService.sendAIAnalysisRequest(sessionId).pipe(
      map(response => {
        console.log('Analysis request initiated:', response);
        
        this.updateState({
          requestId: response.requestId,
          status: 'PROCESSING',
          lastUpdate: Date.now()
        });

        // Start polling for progress
        this.startProgressPolling(response.requestId);
        
        return response.requestId;
      }),
      tap({
        error: (error) => {
          console.error('Failed to start analysis:', error);
          this.updateState({
            status: 'FAILED',
            error: error.message || 'Failed to start analysis',
            lastUpdate: Date.now()
          });
        }
      })
    );
  }

  /**
   * Start polling for analysis progress
   */
  private startProgressPolling(requestId: string): void {
    console.log('Starting progress polling for request:', requestId);
    
    // Stop any existing polling
    this.destroy$.next();
    
    interval(2000).pipe( // Poll every 2 seconds
      takeUntil(this.destroy$),
      tap(() => {
        this.checkStatus(requestId);
      })
    ).subscribe();
  }

  /**
   * Check analysis status
   */
  private checkStatus(requestId: string): void {
    this.transactionService.checkAnalysisStatus(requestId).subscribe({
      next: (status) => {
        console.log('Status update received:', status);
        
        this.updateState({
          progress: {
            sessionId: status.sessionId || '',
            hasProgress: true,
            status: status.status,
            progress: status.progress,
            progressPercentage: status.progressPercentage,
            chunksProcessed: status.chunksProcessed,
            totalChunks: status.totalChunks,
            processingTimeMs: status.processingTimeMs,
            timestamp: status.timestamp
          },
          lastUpdate: Date.now()
        });

        // Handle completion
        if (status.status === 'COMPLETED') {
          this.handleCompletion(status);
        } else if (status.status === 'FAILED') {
          this.handleFailure(status);
        }
      },
      error: (error) => {
        console.error('Error checking status:', error);
        this.updateState({
          status: 'FAILED',
          error: error.message || 'Failed to check status',
          lastUpdate: Date.now()
        });
      }
    });
  }

  /**
   * Handle analysis completion
   */
  private handleCompletion(status: AnalysisStatus): void {
    console.log('Analysis completed:', status);
    
    if (status.insights) {
      this.updateState({
        status: 'COMPLETED',
        insights: status.insights,
        lastUpdate: Date.now()
      });
    } else if (status.sessionId) {
      // Fetch insights separately if not included in status
      this.transactionService.getAnalysisResults(status.sessionId).subscribe({
        next: (insights) => {
          this.updateState({
            status: 'COMPLETED',
            insights,
            lastUpdate: Date.now()
          });
        },
        error: (error) => {
          console.error('Error fetching insights:', error);
          this.updateState({
            status: 'FAILED',
            error: error.message || 'Failed to fetch insights',
            lastUpdate: Date.now()
          });
        }
      });
    }
    
    // Stop polling
    this.destroy$.next();
  }

  /**
   * Handle analysis failure
   */
  private handleFailure(status: AnalysisStatus): void {
    console.error('Analysis failed:', status);
    
    this.updateState({
      status: 'FAILED',
      error: status.errorMessage || 'Analysis failed',
      lastUpdate: Date.now()
    });
    
    // Stop polling
    this.destroy$.next();
  }

  /**
   * Retry failed analysis
   */
  retryAnalysis(): Observable<string> {
    const currentState = this.stateSubject.value;
    if (!currentState.sessionId) {
      throw new Error('No session ID available for retry');
    }
    
    return this.startAnalysis(currentState.sessionId);
  }

  /**
   * Cancel current analysis
   */
  cancelAnalysis(): void {
    console.log('Cancelling analysis');
    
    this.destroy$.next();
    
    this.updateState({
      status: 'IDLE',
      requestId: null,
      progress: null,
      error: null,
      lastUpdate: Date.now()
    });
  }

  /**
   * Clear all state
   */
  clearState(): void {
    console.log('Clearing analysis state');
    
    this.destroy$.next();
    
    this.stateSubject.next({
      requestId: null,
      sessionId: null,
      status: 'IDLE',
      progress: null,
      insights: null,
      error: null,
      startTime: null,
      lastUpdate: null
    });
  }

  /**
   * Get current state
   */
  getCurrentState(): AnalysisState {
    return this.stateSubject.value;
  }

  /**
   * Check if analysis is in progress
   */
  isAnalysisInProgress(): boolean {
    const state = this.stateSubject.value;
    return state.status === 'REQUESTING' || state.status === 'PROCESSING';
  }

  /**
   * Check if analysis is completed
   */
  isAnalysisCompleted(): boolean {
    return this.stateSubject.value.status === 'COMPLETED';
  }

  /**
   * Check if analysis failed
   */
  isAnalysisFailed(): boolean {
    return this.stateSubject.value.status === 'FAILED';
  }

  /**
   * Get processing time
   */
  getProcessingTime(): number | null {
    const state = this.stateSubject.value;
    if (state.startTime && state.lastUpdate) {
      return state.lastUpdate - state.startTime;
    }
    return null;
  }

  /**
   * Update state helper
   */
  private updateState(updates: Partial<AnalysisState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
