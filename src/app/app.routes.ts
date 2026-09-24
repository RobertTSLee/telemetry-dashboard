import { Routes } from '@angular/router';
import { TelemetryDashboard } from './components/telemetry-dashboard/telemetry-dashboard';
import { Home } from './components/home/home';

export const routes: Routes = [
	{
		path: 'telemetry-dashboard',
		component: TelemetryDashboard,
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
