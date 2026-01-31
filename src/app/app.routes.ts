import { Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics';
import { Analytics1Component } from './analytics1/analytics1';
import { Analytics3Component } from './analytics3/analytics3';

export const routes: Routes = [
  { path: '', redirectTo: '/analytics', pathMatch: 'full' },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'analytics1', component: Analytics1Component },
  { path: 'analytics3', component: Analytics3Component }
];
