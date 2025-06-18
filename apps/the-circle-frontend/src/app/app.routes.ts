import { Route } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StreamingComponent } from './components/dashboard/streaming/streaming.component';
import { AuthRegisterComponent } from './components/auth/auth-register.component';
import { AuthLoginComponent } from './components/auth/auth-login.component';

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
    },

    {
        path: 'register',
        pathMatch: 'full',
        loadComponent: () =>
            import('./components/auth/auth-register.component').then(
                (m) => m.AuthRegisterComponent
            )
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
    }
];
