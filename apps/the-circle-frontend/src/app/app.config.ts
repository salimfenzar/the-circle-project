import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation
} from '@angular/router';
import { appRoutes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './components/auth/auth.interceptor';

registerLocaleData(localeNl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: LOCALE_ID, useValue: 'nl-NL' }
  ]
};
