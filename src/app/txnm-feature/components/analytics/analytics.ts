import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../models/api-response.model';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {
  transactions: Transaction[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get transactions from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.transactions = navigation.extras.state['transactions'] || [];
    }

    // If no transactions in state, try to get from session storage
    if (this.transactions.length === 0) {
      const storedTransactions = sessionStorage.getItem('transactions');
      if (storedTransactions) {
        this.transactions = JSON.parse(storedTransactions);
      }
    }
  }

  goHome(): void {
    this.router.navigate(['/txnm']);
  }

  goToTransactions(): void {
    this.router.navigate(['/txnm/transactions'], {
      state: { transactions: this.transactions }
    });
  }

  getTotalCount(): number {
    return this.transactions.length;
  }
}
