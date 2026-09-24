import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

import { TelemetryAlertDto } from '../models/TelemetryAlertDto';
import { TelemetryMetricDto } from '../models/TelemetryMetricDto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalrTelemetryService {
    private hubConnection!: signalR.HubConnection;

    // Signal State for UI
    readonly connectionState = signal<'Connected' | 'Reconnecting' | 'Disconnected'>('Disconnected');
    readonly latestMetrics = signal<TelemetryMetricDto[]>([]);
    readonly activeAlerts = signal<TelemetryAlertDto[]>([]);

    constructor() {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection(): void {
    const hubUrl = `${environment.apiUrl.replace(/\/$/, '')}/hubs/telemetry`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      // Let SignalR negotiate WebSockets, Server-Sent Events, or Long Polling.
      .withUrl(hubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Custom exponential backoff
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.registerConnectionEvents();
    this.registerHubHandlers();
  }

  private registerConnectionEvents(): void {
    this.hubConnection.onreconnecting(() => this.connectionState.set('Reconnecting'));
    this.hubConnection.onreconnected(() => this.connectionState.set('Connected'));
    this.hubConnection.onclose(() => this.connectionState.set('Disconnected'));
  }

  private registerHubHandlers(): void {
    // Receive real-time telemetry batch
    this.hubConnection.on('ReceiveTelemetryBatch', (metrics: TelemetryMetricDto[]) => {
      this.latestMetrics.set(metrics);
    });

    // Receive critical alerts
    this.hubConnection.on('ReceiveCriticalAlert', (alert: TelemetryAlertDto) => {
      this.activeAlerts.update((current) => [alert, ...current.slice(0, 49)]); // Keep last 50 alerts
    });
  }

  // Start the SignalR connection with retry logic
  public async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      this.connectionState.set('Connected');
    } catch (err) {
      this.connectionState.set('Disconnected');
      console.error(`Unable to connect to SignalR hub at ${environment.apiUrl}/hubs/telemetry`, err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public async subscribeToZone(zoneId: string): Promise<void> {
    if (this.connectionState() === 'Connected') {
      await this.hubConnection.invoke('JoinZoneGroup', zoneId);
    }
  }
}
