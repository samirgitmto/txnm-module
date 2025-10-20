import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction, SpendingInsights, AnalysisStatus, AnalysisProgress } from '../../models/api-response.model';
import { TransactionService } from '../../services/transaction.service';
import { AIAnalysisStateService, AnalysisState } from '../../services/ai-analysis-state.service';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  transactions: Transaction[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  // AI Insights properties (existing)
  aiInsights: SpendingInsights | null = null;
  isLoadingAI = false;
  aiError: string | null = null;
  
  // New async AI analysis properties
  analysisState: AnalysisState | null = null;
  analysisProgress: AnalysisProgress | null = null;
  isAnalysisInProgress = false;
  analysisError: string | null = null;
  requestId: string | null = null;
  
  // Analytics navigation options
  analyticsOptions = [
    { value: 'daily', label: 'Daily Analytics', icon: 'trending_up', available: true },
    { value: 'weekly', label: 'Weekly Analytics', icon: 'bar_chart', available: false },
    { value: 'five-day', label: 'Five-Day Analytics', icon: 'pie_chart', available: false }
  ];
  
  selectedAnalytics: string = '';

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private aiAnalysisStateService: AIAnalysisStateService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.subscribeToAnalysisState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.aiAnalysisStateService.clearState();
  }

  /**
   * Subscribe to analysis state changes
   */
  private subscribeToAnalysisState(): void {
    this.aiAnalysisStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.analysisState = state;
        this.isAnalysisInProgress = state.status === 'REQUESTING' || state.status === 'PROCESSING';
        this.analysisProgress = state.progress;
        this.analysisError = state.error;
        this.requestId = state.requestId;
        
        // Update AI insights when analysis completes
        if (state.status === 'COMPLETED' && state.insights) {
          this.aiInsights = state.insights;
          this.isLoadingAI = false;
        }
        
        // Update loading state
        if (state.status === 'REQUESTING') {
          this.isLoadingAI = true;
        } else if (state.status === 'FAILED') {
          this.isLoadingAI = false;
          this.aiError = state.error;
        }
        
        console.log('Analysis state updated:', state);
      });
  }

  private loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = null;
  
    // Check if session exists
    const sessionId = this.sessionService.getSessionId();
    if (!sessionId) {
      this.errorMessage = 'No active session. Please upload a statement first.';
      this.isLoading = false;
      return;
    }
  
    this.transactionService.getTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load transactions';
          this.isLoading = false;
        }
      });
  }

  goHome(): void {
    this.router.navigate(['/txnm']);
  }

  goToTransactions(): void {
    this.router.navigate(['/txnm/transactions'], {
      state: { transactions: this.transactions }
    });
  }

  onAnalyticsChange(): void {
    const selectedOption = this.analyticsOptions.find(option => option.value === this.selectedAnalytics);
    
    if (selectedOption && selectedOption.available) {
      switch (this.selectedAnalytics) {
        case 'daily':
          this.router.navigate(['/txnm/analytics/daily'], {
            state: { transactions: this.transactions }
          });
          break;
        case 'weekly':
          // TODO: Implement weekly analytics navigation
          console.log('Weekly analytics not yet implemented');
          break;
        case 'five-day':
          // TODO: Implement five-day analytics navigation
          console.log('Five-day analytics not yet implemented');
          break;
      }
    }
  }

  getTotalCount(): number {
    return this.transactions.length;
  }

  getTotalIncome(): number {
    return this.transactions.reduce((sum, transaction) => {
      return sum + (transaction.credit || 0);
    }, 0);
  }

  getTotalExpenses(): number {
    return this.transactions.reduce((sum, transaction) => {
      return sum + (transaction.debit || 0);
    }, 0);
  }

  getNetAmount(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // AI Insights Methods (existing synchronous method)
  getAIInsights(): void {
    this.isLoadingAI = true;
    this.aiError = null;
    this.aiInsights = null;

    this.transactionService.getAISpendingInsights()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (insights) => {
          this.aiInsights = insights;
          this.isLoadingAI = false;
          console.log('AI insights loaded successfully:', insights);
        },
        error: (error) => {
          this.aiError = error.message || 'Failed to get AI insights';
          this.isLoadingAI = false;
          console.error('Error loading AI insights:', error);
        }
      });
  }

  // ===== NEW ASYNC AI ANALYSIS METHODS =====

  /**
   * Start async AI analysis using Kafka-based processing
   */
  getAIInsightsAsync(): void {
    console.log('Starting async AI analysis');
    
    // Clear previous state
    this.aiError = null;
    this.analysisError = null;
    this.aiInsights = null;
    
    // Start analysis using the state service
    this.aiAnalysisStateService.startAnalysis('')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requestId) => {
          console.log('Async AI analysis started with request ID:', requestId);
          this.requestId = requestId;
        },
        error: (error) => {
          console.error('Failed to start async AI analysis:', error);
          this.analysisError = error.message || 'Failed to start AI analysis';
          this.isLoadingAI = false;
        }
      });
  }

  /**
   * Retry failed analysis
   */
  retryAnalysis(): void {
    console.log('Retrying AI analysis');
    
    this.aiAnalysisStateService.retryAnalysis()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requestId) => {
          console.log('Analysis retry started with request ID:', requestId);
          this.requestId = requestId;
        },
        error: (error) => {
          console.error('Failed to retry analysis:', error);
          this.analysisError = error.message || 'Failed to retry analysis';
        }
      });
  }

  /**
   * Cancel current analysis
   */
  cancelAnalysis(): void {
    console.log('Cancelling AI analysis');
    this.aiAnalysisStateService.cancelAnalysis();
    this.isLoadingAI = false;
    this.isAnalysisInProgress = false;
  }

  /**
   * Get progress percentage for display
   */
  getProgressPercentage(): number {
    if (!this.analysisProgress) return 0;
    return this.analysisProgress.progressPercentage || 0;
  }

  /**
   * Get progress text for display
   */
  getProgressText(): string {
    if (!this.analysisProgress) return '';
    
    if (this.analysisProgress.chunksProcessed && this.analysisProgress.totalChunks) {
      return `Processing chunk ${this.analysisProgress.chunksProcessed} of ${this.analysisProgress.totalChunks}`;
    }
    
    return this.analysisProgress.progress || 'Processing...';
  }

  /**
   * Check if analysis is in progress
   */
  isAnalysisRunning(): boolean {
    return this.isAnalysisInProgress || this.aiAnalysisStateService.isAnalysisInProgress();
  }

  /**
   * Check if analysis is completed
   */
  isAnalysisDone(): boolean {
    return this.aiAnalysisStateService.isAnalysisCompleted();
  }

  /**
   * Check if analysis failed
   */
  isAnalysisFailed(): boolean {
    return this.aiAnalysisStateService.isAnalysisFailed();
  }

  /**
   * Get processing time in seconds
   */
  getProcessingTimeSeconds(): number {
    const processingTime = this.aiAnalysisStateService.getProcessingTime();
    return processingTime ? Math.round(processingTime / 1000) : 0;
  }

  getCategoryBreakdownArray(): { name: string; amount: number }[] {
    if (!this.aiInsights?.categoryBreakdown) {
      return [];
    }
    
    return Object.entries(this.aiInsights.categoryBreakdown)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }

  hasCategoryBreakdown(): boolean {
    return !!(this.aiInsights?.categoryBreakdown && 
              Object.keys(this.aiInsights.categoryBreakdown).length > 0);
  }
}
