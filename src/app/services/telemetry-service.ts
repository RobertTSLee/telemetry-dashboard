import { Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';

import { SensorMetric } from '../models/SensorMetric';

@Service()
export class TelemetryService {

  private socket$ = new Subject<SensorMetric[]>();
  // Expose real-time WebSocket data stream as a Signal with initial value
  readonly liveMetrics = toSignal(this.socket$.asObservable(), { initialValue: [] });

  constructor() {
    // mock WebSocket stream for demonstration purposes
    this.startMockWebSocketStream();
  }

  // MOCK: Simulates WebSocket pushes every 200ms for 2,000 devices
  private startMockWebSocketStream(): void {
    setInterval(() => {
      const mockBatch: SensorMetric[] = Array.from({ length: 2000 }, (_, i) => {
        const val = parseFloat((Math.random() * 120).toFixed(2));
        return {
          id: `sensor-${i + 1}`,
          name: `Pressure Valve ${i + 1}`,
          location: `Facility Zone ${Math.floor(i / 100) + 1}`,
          value: val,
          unit: 'PSI',
          status: val > 100 ? 'CRITICAL' : val > 80 ? 'WARNING' : 'NORMAL',
          lastUpdated: new Date().toISOString(),
        };
      });

      this.socket$.next(mockBatch);
    }, 200);
  }
}
