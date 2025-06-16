import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
      {
    path: 'dashboard',
    component: DashboardComponent
  }

];
