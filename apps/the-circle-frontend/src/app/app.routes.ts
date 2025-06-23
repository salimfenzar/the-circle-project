import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StreamingComponent } from './components/dashboard/streaming/streaming.component';
import { AuthLoginComponent } from './components/auth/auth-login.component';
import { AuthRegisterComponent } from './components/auth/auth-register.component';
import { authGuard } from './components/auth/auth.guard'; // ✅ importeer de guard


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
  component: StreamingComponent,
  canActivate: [authGuard]
},
    {
      path: 'streaming/:id',
        component: StreamingComponent,
         canActivate: [authGuard]
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
            ).then((m) => m.ActiveStreamersComponent),
             canActivate: [authGuard]
    },

    {
        path: 'watch/:id',
        loadComponent: () =>
            import('./components/watch/watch.component').then(
                (m) => m.WatchComponent
            ),
             canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./components/Profile/profile.component').then(
                (m) => m.ProfileComponent
            ),
             canActivate: [authGuard]
    }
];
