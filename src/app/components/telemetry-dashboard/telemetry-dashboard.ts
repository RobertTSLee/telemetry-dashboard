import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

import { SignalrTelemetryStore } from '../../stores/signalr-telemetry.store';
import { TelemetryMetricDto } from '../../models/TelemetryMetricDto';

@Component({
  imports: [CommonModule, ScrollingModule],
  selector: 'app-telemetry-dashboard',
  styleUrl: './telemetry-dashboard.scss',
  templateUrl: './telemetry-dashboard.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelemetryDashboard {
  readonly store = inject(SignalrTelemetryStore);

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.updateSearch(input.value);
  }

  trackByMetric(_: number, metric: TelemetryMetricDto): string {
    return `${metric.deviceId}-${metric.metricName}-${metric.timestamp}`;
  }
}
