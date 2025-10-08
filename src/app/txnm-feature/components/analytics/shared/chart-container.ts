import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chart-container',
  standalone: false,
  templateUrl: './chart-container.html',
  styleUrl: './chart-container.css'
})
export class ChartContainer implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() chartType: ChartType = 'line';
  @Input() chartData: ChartData = { labels: [], datasets: [] };
  @Input() chartOptions: ChartConfiguration['options'] = {};
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() height: string = '300px';
  @Input() showLegend: boolean = true;
  @Input() showToolbar: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;

  // Chart event handlers
  @Input() onChartClick: (event: any) => void = () => {};
  @Input() onChartHover: (event: any) => void = () => {};

  // Chart reference for programmatic control
  chartRef: any = null;

  constructor() {}

  ngOnInit(): void {
    // Initialize chart if data is available
    if (this.chartData && this.chartData.labels && this.chartData.labels.length > 0) {
      this.initializeChart();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeChart(): void {
    // Chart initialization logic can be added here if needed
    // For now, the template handles the chart rendering
  }

  onChartClickEvent(event: any): void {
    this.onChartClick(event);
  }

  onChartHoverEvent(event: any): void {
    this.onChartHover(event);
  }

  // Toolbar actions
  exportChart(): void {
    if (this.chartRef) {
      const url = this.chartRef.toBase64Image();
      const link = document.createElement('a');
      link.download = `${this.title || 'chart'}.png`;
      link.href = url;
      link.click();
    }
  }

  refreshChart(): void {
    // Trigger chart refresh
    if (this.chartRef) {
      this.chartRef.update();
    }
  }

  toggleLegend(): void {
    this.showLegend = !this.showLegend;
    if (this.chartRef) {
      this.chartRef.options.plugins.legend.display = this.showLegend;
      this.chartRef.update();
    }
  }

  // Utility methods
  getChartHeight(): string {
    return this.height;
  }

  hasData(): boolean {
    return !!(this.chartData && 
           this.chartData.labels && 
           this.chartData.labels.length > 0 &&
           this.chartData.datasets && 
           this.chartData.datasets.length > 0);
  }

  getErrorMessage(): string {
    return this.errorMessage || 'Unable to load chart data';
  }
}
