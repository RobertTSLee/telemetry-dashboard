import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { SensorMetric } from '../../models/SensorMetric';
import { TelemetryStore } from '../../stores/telemetry.store';

@Component({
  selector: 'app-mock-telemetry-dashboard',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './mock-telemetry-dashboard.html',
  styleUrl: '../telemetry-dashboard/telemetry-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockTelemetryDashboard {
  readonly store = inject(TelemetryStore);

  onSearchInput(event: Event): void {
    this.store.updateSearch((event.target as HTMLInputElement).value);
  }

  trackBySensorId(_: number, sensor: SensorMetric): string {
    return sensor.id;
  }
}
