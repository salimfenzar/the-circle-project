import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthRegisterComponent } from './components/auth/auth-register.component';


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
  
  { path: "register", pathMatch: "full", component: AuthRegisterComponent },

];
