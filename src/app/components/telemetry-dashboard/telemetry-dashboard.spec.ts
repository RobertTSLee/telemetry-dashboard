import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryDashboard } from './telemetry-dashboard';

describe('TelemetryDashboard', () => {
  let component: TelemetryDashboard;
  let fixture: ComponentFixture<TelemetryDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelemetryDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(TelemetryDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
