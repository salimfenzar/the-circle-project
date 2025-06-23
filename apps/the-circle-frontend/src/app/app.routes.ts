import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StreamingComponent } from './components/dashboard/streaming/streaming.component';
import { AuthLoginComponent } from './components/auth/auth-login.component';
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
  {
    path: 'streaming',
    redirectTo: 'streaming/stream123', // 👈 fallback voor wanneer er geen ID is
    pathMatch: 'full'
  },
    {
      path: 'streaming/:id',
        component: StreamingComponent
    },

    {
        path: 'register',
        component: AuthRegisterComponent
    },

    {
        path: 'login',
        component: AuthLoginComponent
    },
    {
        path: 'active-streamers',
        loadComponent: () =>
            import(
                './components/active-streamers/active-streamers.component'
            ).then((m) => m.ActiveStreamersComponent)
    },

    {
        path: 'watch/:id',
        loadComponent: () => import('./components/watch/watch.component').then(m => m.WatchComponent)
    }

];
