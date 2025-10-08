import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../models/api-response.model';
import { TransactionService } from '../../services/transaction.service';
import { Subject, takeUntil } from 'rxjs';

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

  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Fetch transactions from backend using session ID
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

  goToDailyAnalytics(): void {
    this.router.navigate(['/txnm/analytics/daily'], {
      state: { transactions: this.transactions }
    });
  }

  getTotalCount(): number {
    return this.transactions.length;
  }
}
