import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
   protected readonly title = signal('telemetry-dashboard');
}
