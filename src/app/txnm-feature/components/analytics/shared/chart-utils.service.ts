import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Transaction } from '../../../models/api-response.model';

export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options: ChartConfiguration['options'];
}

export interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
  };
  gradients: {
    primary: string[];
    success: string[];
    warning: string[];
    danger: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChartUtilsService {
  
  private readonly defaultTheme: ChartTheme = {
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      success: '#4bc0c0',
      warning: '#ffc107',
      danger: '#ff6384',
      info: '#36a2eb',
      light: '#f8f9fa',
      dark: '#343a40'
    },
    gradients: {
      primary: ['#667eea', '#764ba2'],
      success: ['#4bc0c0', '#45b7b8'],
      warning: ['#ffc107', '#ffb300'],
      danger: ['#ff6384', '#ff4757']
    }
  };

  constructor() {}

  /**
   * Get default chart theme
   */
  getTheme(): ChartTheme {
    return this.defaultTheme;
  }

  /**
   * Create responsive chart options
   */
  createResponsiveOptions(title: string, xLabel?: string, yLabel?: string): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              family: "'Roboto', sans-serif"
            }
          }
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold',
            family: "'Roboto', sans-serif"
          },
          color: '#333',
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#667eea',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          intersect: false,
          mode: 'index'
        }
      },
      scales: {
        x: {
          title: {
            display: !!xLabel,
            text: xLabel || '',
            font: {
              size: 12,
              weight: 'normal'
            },
            color: '#666'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            drawOnChartArea: true
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#666'
          }
        },
        y: {
          title: {
            display: !!yLabel,
            text: yLabel || '',
            font: {
              size: 12,
              weight: 'normal'
            },
            color: '#666'
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            drawOnChartArea: true
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#666',
            callback: function(value: any) {
              return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
          },
          beginAtZero: true
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      elements: {
        point: {
          radius: 4,
          hoverRadius: 6,
          borderWidth: 2
        },
        line: {
          borderWidth: 2,
          tension: 0.1
        },
        bar: {
          borderWidth: 1,
          borderRadius: 4
        }
      }
    };
  }

  /**
   * Create line chart configuration
   */
  createLineChart(
    labels: string[], 
    datasets: any[], 
    title: string, 
    xLabel?: string, 
    yLabel?: string
  ): ChartConfig {
    return {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map(dataset => ({
          ...dataset,
          borderColor: dataset.borderColor || this.defaultTheme.colors.primary,
          backgroundColor: dataset.backgroundColor || this.getTransparentColor(dataset.borderColor || this.defaultTheme.colors.primary, 0.1),
          tension: dataset.tension || 0.1,
          fill: dataset.fill || false
        }))
      },
      options: this.createResponsiveOptions(title, xLabel, yLabel)
    };
  }

  /**
   * Create bar chart configuration
   */
  createBarChart(
    labels: string[], 
    datasets: any[], 
    title: string, 
    xLabel?: string, 
    yLabel?: string
  ): ChartConfig {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map(dataset => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || this.getTransparentColor(dataset.borderColor || this.defaultTheme.colors.primary, 0.6),
          borderColor: dataset.borderColor || this.defaultTheme.colors.primary,
          borderWidth: dataset.borderWidth || 1
        }))
      },
      options: this.createResponsiveOptions(title, xLabel, yLabel)
    };
  }

  /**
   * Create pie chart configuration
   */
  createPieChart(
    labels: string[], 
    data: number[], 
    title: string,
    colors?: string[]
  ): ChartConfig {
    const defaultColors = [
      this.defaultTheme.colors.primary,
      this.defaultTheme.colors.success,
      this.defaultTheme.colors.warning,
      this.defaultTheme.colors.danger,
      this.defaultTheme.colors.info
    ];

    const chartColors = colors || defaultColors;

    return {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: chartColors.map(color => this.getTransparentColor(color, 0.6)),
          borderColor: chartColors,
          borderWidth: 1,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                family: "'Roboto', sans-serif"
              }
            }
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: 'bold',
              family: "'Roboto', sans-serif"
            },
            color: '#333',
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#667eea',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${this.formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    };
  }

  /**
   * Process transactions for daily analytics
   */
  processDailyData(transactions: Transaction[]): {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
    netData: number[];
  } {
    const dailyMap = new Map<string, { income: number; expenses: number; net: number }>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (!dailyMap.has(date)) {
        dailyMap.set(date, { income: 0, expenses: 0, net: 0 });
      }

      const dayData = dailyMap.get(date)!;
      
      if (transaction.credit && transaction.credit > 0) {
        dayData.income += transaction.credit;
      }
      
      if (transaction.debit && transaction.debit > 0) {
        dayData.expenses += transaction.debit;
      }
      
      dayData.net = dayData.income - dayData.expenses;
    });

    const labels = Array.from(dailyMap.keys());
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    const netData: number[] = [];

    dailyMap.forEach((data) => {
      incomeData.push(data.income);
      expenseData.push(data.expenses);
      netData.push(data.net);
    });

    return { labels, incomeData, expenseData, netData };
  }

  /**
   * Process transactions for weekly analytics
   */
  processWeeklyData(transactions: Transaction[]): {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
    netData: number[];
  } {
    const weeklyMap = new Map<string, { income: number; expenses: number; net: number }>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      
      const weekKey = weekStart.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { income: 0, expenses: 0, net: 0 });
      }

      const weekData = weeklyMap.get(weekKey)!;
      
      if (transaction.credit && transaction.credit > 0) {
        weekData.income += transaction.credit;
      }
      
      if (transaction.debit && transaction.debit > 0) {
        weekData.expenses += transaction.debit;
      }
      
      weekData.net = weekData.income - weekData.expenses;
    });

    const labels = Array.from(weeklyMap.keys());
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    const netData: number[] = [];

    weeklyMap.forEach((data) => {
      incomeData.push(data.income);
      expenseData.push(data.expenses);
      netData.push(data.net);
    });

    return { labels, incomeData, expenseData, netData };
  }

  /**
   * Process transactions for five-day analytics
   */
  processFiveDayData(transactions: Transaction[]): {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
    netData: number[];
  } {
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const fiveDayMap = new Map<string, { income: number; expenses: number; net: number }>();

    // Create rolling 5-day windows
    for (let i = 0; i <= sortedTransactions.length - 5; i++) {
      const windowTransactions = sortedTransactions.slice(i, i + 5);
      const startDate = new Date(windowTransactions[0].date);
      const endDate = new Date(windowTransactions[4].date);
      
      const windowKey = `${startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;

      let income = 0;
      let expenses = 0;

      windowTransactions.forEach(transaction => {
        if (transaction.credit && transaction.credit > 0) {
          income += transaction.credit;
        }
        if (transaction.debit && transaction.debit > 0) {
          expenses += transaction.debit;
        }
      });

      fiveDayMap.set(windowKey, {
        income,
        expenses,
        net: income - expenses
      });
    }

    const labels = Array.from(fiveDayMap.keys());
    const incomeData: number[] = [];
    const expenseData: number[] = [];
    const netData: number[] = [];

    fiveDayMap.forEach((data) => {
      incomeData.push(data.income);
      expenseData.push(data.expenses);
      netData.push(data.net);
    });

    return { labels, incomeData, expenseData, netData };
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Get transparent color
   */
  private getTransparentColor(color: string, alpha: number): string {
    // Simple implementation - in production, you might want to use a color library
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  /**
   * Get default dataset configurations
   */
  getDefaultDatasets(): any {
    return {
      income: {
        label: 'Income',
        borderColor: this.defaultTheme.colors.success,
        backgroundColor: this.getTransparentColor(this.defaultTheme.colors.success, 0.1),
        fill: false
      },
      expenses: {
        label: 'Expenses',
        borderColor: this.defaultTheme.colors.danger,
        backgroundColor: this.getTransparentColor(this.defaultTheme.colors.danger, 0.1),
        fill: false
      },
      net: {
        label: 'Net Amount',
        borderColor: this.defaultTheme.colors.primary,
        backgroundColor: this.getTransparentColor(this.defaultTheme.colors.primary, 0.1),
        fill: true
      }
    };
  }
}
