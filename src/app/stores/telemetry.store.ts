import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TelemetryService } from '../services/telemetry-service';
import { SensorMetric } from '../models/SensorMetric';

/**
 * TelemetryStore is a state management service that provides reactive signals for telemetry data.
 * It manages the search query, status filter, and computes derived metrics and KPIs based on the live telemetry data.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryStore {
  private telemetryService = inject(TelemetryService);

  // Writable signals for state
  readonly searchQuery = signal<string>('');
  readonly selectedStatusFilter = signal<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');

  // Debounced search query via RxJS Interop
  readonly debouncedSearchQuery = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(250),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  // Raw signal from WebSocket service
  readonly allSensors = this.telemetryService.liveMetrics;

  // Derived filtered metrics
  readonly filteredSensors: Signal<SensorMetric[]> = computed(() => {
    const list = this.allSensors();
    const query = this.debouncedSearchQuery().toLowerCase().trim();
    const status = this.selectedStatusFilter();

    return list.filter((sensor) => {
      const matchesQuery =
        !query ||
        sensor.name.toLowerCase().includes(query) ||
        sensor.id.toLowerCase().includes(query);

      const matchesStatus =
        status === 'ALL' || sensor.status === status;

      return matchesQuery && matchesStatus;
    });
  });

  // Aggregated KPIs calculated automatically when data changes
  readonly kpis = computed(() => {
    const total = this.allSensors();
    return {
      totalCount: total.length,
      criticalCount: total.filter((s) => s.status === 'CRITICAL').length,
      warningCount: total.filter((s) => s.status === 'WARNING').length,
      avgValue: total.length
        ? (total.reduce((acc, curr) => acc + curr.value, 0) / total.length).toFixed(1)
        : '0.0',
    };
  });

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  setStatusFilter(status: 'ALL' | 'CRITICAL' | 'WARNING'): void {
    this.selectedStatusFilter.set(status);
  }
}