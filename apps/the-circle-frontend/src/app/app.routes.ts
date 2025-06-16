import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StreamingComponent } from './components/dashboard/streaming/streaming.component';


export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
      {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'streaming',
    component: StreamingComponent
  }

];
