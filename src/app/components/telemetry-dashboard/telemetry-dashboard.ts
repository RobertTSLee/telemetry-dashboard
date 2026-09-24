import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

import { TelemetryStore } from '../../stores/telemetry.store';
import { SensorMetric } from '../../models/SensorMetric';

@Component({
  imports: [CommonModule, ScrollingModule],
  selector: 'app-telemetry-dashboard',
  styleUrl: './telemetry-dashboard.scss',
  templateUrl: './telemetry-dashboard.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelemetryDashboard {
  readonly store = inject(TelemetryStore);

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.updateSearch(input.value);
  }

  trackBySensorId(_: number, sensor: SensorMetric): string {
    return sensor.id;
  }
}
