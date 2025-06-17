import { ApplicationConfig } from '@angular/core';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation
} from '@angular/router';
import { appRoutes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeNl);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        { provide: LOCALE_ID, useValue: 'nl-NL' }
    ]
};
