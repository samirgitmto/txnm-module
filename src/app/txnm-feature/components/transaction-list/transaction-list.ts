import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Transaction } from '../../models/api-response.model';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css'
})
export class TransactionList implements OnInit {
  transactions: Transaction[] = [];
  message: string | null = null;
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get transactions from router state (passed from upload)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.transactions = navigation.extras.state['transactions'] || [];
      this.message = navigation.extras.state['message'] || null;
    }

    // If no transactions in state, try to get from session storage
    if (this.transactions.length === 0) {
      const storedTransactions = sessionStorage.getItem('transactions');
      if (storedTransactions) {
        this.transactions = JSON.parse(storedTransactions);
      }
    }
  }

  // Navigate back to home
  goHome(): void {
    this.router.navigate(['/txnm']);
  }

  // Navigate to analytics
  goToAnalytics(): void {
    this.router.navigate(['/txnm/analytics'], {
      state: { transactions: this.transactions }
    });
  }

  // Get total transactions count
  getTotalCount(): number {
    return this.transactions.length;
  }

  // Get total credit amount
  getTotalCredit(): number {
    return this.transactions.reduce((sum, t) => sum + (t.credit || 0), 0);
  }

  // Get total debit amount
  getTotalDebit(): number {
    return this.transactions.reduce((sum, t) => sum + (t.debit || 0), 0);
  }

  // Get net amount (credit - debit)
  getNetAmount(): number {
    return this.getTotalCredit() - this.getTotalDebit();
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
