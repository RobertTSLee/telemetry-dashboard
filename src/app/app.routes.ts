import { Routes } from '@angular/router';
import { TelemetryDashboard } from './components/telemetry-dashboard/telemetry-dashboard';
import { Home } from './components/home/home';
import { MockTelemetryDashboard } from './components/mock-telemetry-dashboard/mock-telemetry-dashboard';

export const routes: Routes = [
	{
		path: 'telemetry-dashboard',
		component: TelemetryDashboard,
	},
	{
		path: 'telemetry-dashboard/mock',
		component: MockTelemetryDashboard,
	},
    {
        path: 'home',
        component: Home,        
    },
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
];
