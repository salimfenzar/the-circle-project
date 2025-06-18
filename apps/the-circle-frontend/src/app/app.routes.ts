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
    }
];
