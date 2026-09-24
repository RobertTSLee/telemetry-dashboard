import { Injectable, Signal, computed, inject, signal } from '@angular/core';

import { TelemetryAlertDto } from '../models/TelemetryAlertDto';
import { TelemetryMetricDto } from '../models/TelemetryMetricDto';
import { SignalrTelemetryService } from '../services/signalr-telemetry.service';

@Injectable({ providedIn: 'root' })
export class SignalrTelemetryStore {
  private readonly telemetryService = inject(SignalrTelemetryService);

  readonly connectionState = this.telemetryService.connectionState;
  readonly metrics = this.telemetryService.latestMetrics;
  readonly alerts = this.telemetryService.activeAlerts;
  readonly searchQuery = signal('');

  readonly filteredMetrics = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.metrics();
    }

    return this.metrics().filter((metric) =>
      metric.deviceId.toLowerCase().includes(query) ||
      metric.metricName.toLowerCase().includes(query)
    );
  });

  readonly summary = computed(() => {
    const metrics = this.metrics();
    const devices = new Set(metrics.map((metric) => metric.deviceId));

    return {
      metricCount: metrics.length,
      deviceCount: devices.size,
      averageValue: metrics.length
        ? metrics.reduce((total, metric) => total + metric.value, 0) / metrics.length
        : 0,
      latestTimestamp: metrics.reduce(
        (latest, metric) => metric.timestamp > latest ? metric.timestamp : latest,
        ''
      ),
    };
  });

  readonly metricsByName: Signal<Record<string, TelemetryMetricDto[]>> = computed(() => {
    return this.metrics().reduce<Record<string, TelemetryMetricDto[]>>((groups, metric) => {
      (groups[metric.metricName] ??= []).push(metric);
      return groups;
    }, {});
  });

  readonly alertSummary = computed(() => ({
    total: this.alerts().length,
    latest: this.alerts()[0] as TelemetryAlertDto | undefined,
  }));

  async subscribeToZone(zoneId: string): Promise<void> {
    await this.telemetryService.subscribeToZone(zoneId);
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
