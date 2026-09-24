import { TestBed } from '@angular/core/testing';
import { SignalrTelemetryService } from './signalr-telemetry.service';

describe('SignalrTelemetryService', () => {
  let service: SignalrTelemetryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalrTelemetryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
