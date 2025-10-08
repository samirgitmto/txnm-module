import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Transaction } from '../../../models/api-response.model';
import { TransactionService } from '../../../services/transaction.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { Subject, takeUntil } from 'rxjs';

// Chart.js types
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-daily-analytics',
  standalone: false,
  templateUrl: './daily-analytics.html',
  styleUrl: './daily-analytics.css'
})
export class DailyAnalytics implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  transactions: Transaction[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  // Chart configurations
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Transaction Trends'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)'
        },
        beginAtZero: true
      }
    }
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Income vs Expenses'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)'
        },
        beginAtZero: true
      }
    }
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Type Distribution'
      }
    }
  };

  public lineChartType: ChartType = 'line';
  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';

  // Chart data
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Net Amount',
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Income',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        data: [],
        label: 'Expenses',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  public pieChartData: ChartData<'pie'> = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  };

  // Summary statistics
  totalIncome = 0;
  totalExpenses = 0;
  netAmount = 0;
  totalTransactions = 0;
  averageDailyIncome = 0;
  averageDailyExpenses = 0;
  daysWithTransactions = 0;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private chartUtils: ChartUtilsService
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

    // Always fetch transactions from backend using session ID
    this.transactionService.getTransactions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transactions) => {
          this.transactions = transactions;
          this.processTransactions();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load transactions';
          this.isLoading = false;
        }
      });
  }

  private processTransactions(): void {
    if (this.transactions.length === 0) {
      this.errorMessage = 'No transactions available for analysis';
      return;
    }

    // Sort transactions by date
    this.transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Use ChartUtilsService for data processing
    const dailyData = this.chartUtils.processDailyData(this.transactions);
    this.updateCharts(dailyData);
    this.calculateSummaryStatistics();
  }

  // Removed calculateDailyData method - now using ChartUtilsService

  private updateCharts(dailyData: { labels: string[]; incomeData: number[]; expenseData: number[]; netData: number[] }): void {
    const defaultDatasets = this.chartUtils.getDefaultDatasets();

    // Update line chart (net amount trend)
    this.lineChartData = {
      labels: dailyData.labels,
      datasets: [
        {
          ...defaultDatasets.net,
          data: dailyData.netData,
          label: 'Net Amount'
        }
      ]
    };

    // Update bar chart (income vs expenses)
    this.barChartData = {
      labels: dailyData.labels,
      datasets: [
        {
          ...defaultDatasets.income,
          data: dailyData.incomeData,
          label: 'Income'
        },
        {
          ...defaultDatasets.expenses,
          data: dailyData.expenseData,
          label: 'Expenses'
        }
      ]
    };

    // Update pie chart (overall distribution)
    this.pieChartData = {
      labels: ['Income', 'Expenses'],
      datasets: [{
        data: [this.totalIncome, this.totalExpenses],
        backgroundColor: [
          this.chartUtils.getTheme().colors.success + '60',
          this.chartUtils.getTheme().colors.danger + '60'
        ],
        borderColor: [
          this.chartUtils.getTheme().colors.success,
          this.chartUtils.getTheme().colors.danger
        ],
        borderWidth: 1
      }]
    };
  }

  private calculateSummaryStatistics(): void {
    this.totalIncome = 0;
    this.totalExpenses = 0;
    this.totalTransactions = this.transactions.length;

    this.transactions.forEach(transaction => {
      if (transaction.credit && transaction.credit > 0) {
        this.totalIncome += transaction.credit;
      }
      if (transaction.debit && transaction.debit > 0) {
        this.totalExpenses += transaction.debit;
      }
    });

    this.netAmount = this.totalIncome - this.totalExpenses;

    // Calculate unique days with transactions
    const uniqueDays = new Set(
      this.transactions.map(t => new Date(t.date).toDateString())
    );
    this.daysWithTransactions = uniqueDays.size;

    // Calculate averages
    if (this.daysWithTransactions > 0) {
      this.averageDailyIncome = this.totalIncome / this.daysWithTransactions;
      this.averageDailyExpenses = this.totalExpenses / this.daysWithTransactions;
    }
  }

  // Navigation methods
  goBack(): void {
    this.router.navigate(['/txnm/analytics']);
  }

  goToTransactions(): void {
    this.router.navigate(['/txnm/transactions'], {
      state: { transactions: this.transactions }
    });
  }

  goHome(): void {
    this.router.navigate(['/txnm']);
  }

  // Chart event handlers
  public chartClicked(event: any): void {
    console.log('Chart clicked:', event);
  }

  public chartHovered(event: any): void {
    console.log('Chart hovered:', event);
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getNetAmountClass(): string {
    return this.netAmount >= 0 ? 'positive' : 'negative';
  }

  refreshData(): void {
    this.loadTransactions();
  }
}
