import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../../models/api-response.model';

export interface SummaryCardData {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
}

@Component({
  selector: 'app-summary-cards',
  standalone: false,
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css'
})
export class SummaryCards implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Input() period: 'daily' | 'weekly' | 'monthly' = 'daily';
  @Input() showTrends: boolean = true;
  @Input() customCards: SummaryCardData[] = [];

  summaryCards: SummaryCardData[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.customCards.length > 0) {
      this.summaryCards = this.customCards;
    } else {
      this.generateDefaultCards();
    }
  }

  private generateDefaultCards(): void {
    const stats = this.calculateStatistics();
    
    this.summaryCards = [
      {
        title: 'Total Income',
        value: stats.totalIncome,
        subtitle: `${this.formatCurrency(stats.averageIncome)} avg/${this.period}`,
        icon: 'trending_up',
        color: 'success',
        trend: this.showTrends ? {
          value: stats.incomeTrend,
          direction: stats.incomeTrend >= 0 ? 'up' : 'down',
          period: this.period
        } : undefined
      },
      {
        title: 'Total Expenses',
        value: stats.totalExpenses,
        subtitle: `${this.formatCurrency(stats.averageExpenses)} avg/${this.period}`,
        icon: 'trending_down',
        color: 'danger',
        trend: this.showTrends ? {
          value: stats.expenseTrend,
          direction: stats.expenseTrend >= 0 ? 'up' : 'down',
          period: this.period
        } : undefined
      },
      {
        title: 'Net Amount',
        value: stats.netAmount,
        subtitle: stats.netAmount >= 0 ? 'Surplus' : 'Deficit',
        icon: stats.netAmount >= 0 ? 'account_balance' : 'warning',
        color: stats.netAmount >= 0 ? 'success' : 'warning',
        trend: this.showTrends ? {
          value: stats.netTrend,
          direction: stats.netTrend >= 0 ? 'up' : 'down',
          period: this.period
        } : undefined
      },
      {
        title: 'Transactions',
        value: stats.totalTransactions,
        subtitle: `${stats.activePeriods} active ${this.period}s`,
        icon: 'receipt',
        color: 'info',
        trend: this.showTrends ? {
          value: stats.transactionTrend,
          direction: stats.transactionTrend >= 0 ? 'up' : 'down',
          period: this.period
        } : undefined
      }
    ];
  }

  private calculateStatistics(): any {
    if (this.transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0,
        totalTransactions: 0,
        averageIncome: 0,
        averageExpenses: 0,
        activePeriods: 0,
        incomeTrend: 0,
        expenseTrend: 0,
        netTrend: 0,
        transactionTrend: 0
      };
    }

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalTransactions = this.transactions.length;

    // Calculate totals
    this.transactions.forEach(transaction => {
      if (transaction.credit && transaction.credit > 0) {
        totalIncome += transaction.credit;
      }
      if (transaction.debit && transaction.debit > 0) {
        totalExpenses += transaction.debit;
      }
    });

    const netAmount = totalIncome - totalExpenses;

    // Calculate periods
    const periods = this.calculatePeriods();
    const activePeriods = periods.size;

    // Calculate averages
    const averageIncome = activePeriods > 0 ? totalIncome / activePeriods : 0;
    const averageExpenses = activePeriods > 0 ? totalExpenses / activePeriods : 0;

    // Calculate trends (simplified - comparing first half vs second half)
    const trends = this.calculateTrends();

    return {
      totalIncome,
      totalExpenses,
      netAmount,
      totalTransactions,
      averageIncome,
      averageExpenses,
      activePeriods,
      incomeTrend: trends.incomeTrend,
      expenseTrend: trends.expenseTrend,
      netTrend: trends.netTrend,
      transactionTrend: trends.transactionTrend
    };
  }

  private calculatePeriods(): Set<string> {
    const periods = new Set<string>();
    
    this.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let periodKey: string;

      switch (this.period) {
        case 'daily':
          periodKey = date.toDateString();
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          periodKey = weekStart.toDateString();
          break;
        case 'monthly':
          periodKey = `${date.getFullYear()}-${date.getMonth()}`;
          break;
        default:
          periodKey = date.toDateString();
      }
      
      periods.add(periodKey);
    });

    return periods;
  }

  private calculateTrends(): any {
    if (this.transactions.length < 2) {
      return { incomeTrend: 0, expenseTrend: 0, netTrend: 0, transactionTrend: 0 };
    }

    // Sort transactions by date
    const sortedTransactions = [...this.transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const midPoint = Math.floor(sortedTransactions.length / 2);
    const firstHalf = sortedTransactions.slice(0, midPoint);
    const secondHalf = sortedTransactions.slice(midPoint);

    const firstHalfStats = this.calculatePeriodStats(firstHalf);
    const secondHalfStats = this.calculatePeriodStats(secondHalf);

    return {
      incomeTrend: this.calculatePercentageChange(firstHalfStats.income, secondHalfStats.income),
      expenseTrend: this.calculatePercentageChange(firstHalfStats.expenses, secondHalfStats.expenses),
      netTrend: this.calculatePercentageChange(firstHalfStats.net, secondHalfStats.net),
      transactionTrend: this.calculatePercentageChange(firstHalf.length, secondHalf.length)
    };
  }

  private calculatePeriodStats(transactions: Transaction[]): any {
    let income = 0;
    let expenses = 0;

    transactions.forEach(transaction => {
      if (transaction.credit && transaction.credit > 0) {
        income += transaction.credit;
      }
      if (transaction.debit && transaction.debit > 0) {
        expenses += transaction.debit;
      }
    });

    return {
      income,
      expenses,
      net: income - expenses
    };
  }

  private calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getCardClass(card: SummaryCardData): string {
    return `summary-card ${card.color}-card`;
  }

  getTrendClass(trend: any): string {
    if (!trend) return '';
    return `trend-${trend.direction}`;
  }

  getTrendIcon(trend: any): string {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  formatTrendValue(trend: any): string {
    if (!trend) return '';
    const sign = trend.direction === 'up' ? '+' : '';
    return `${sign}${trend.value.toFixed(1)}%`;
  }
}
