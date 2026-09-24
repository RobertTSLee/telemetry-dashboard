import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SignalrTelemetryService } from '../../services/signalr-telemetry.service';

@Component({
  imports: [CommonModule, DatePipe],
  selector: 'app-alert-banner',
  styleUrl: './alert-banner.scss',
  templateUrl: './alert-banner.html',
})
export class AlertBanner {
  readonly signalRService = inject(SignalrTelemetryService);
}
