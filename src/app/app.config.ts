import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { ApiUrlService } from './services/api/apiUrl/api-url.service';
import { AuthenticationInterceptor } from './services/interceptors/authentication.interceptor';
import { LoadingInterceptor } from './services/interceptors/loading.interceptor';
import { UrlReplacementInterceptor } from './services/interceptors/url-replacement.interceptor';
import { UserService } from './services/user/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() =>
      initializeConfiguration(inject(ApiUrlService), inject(UserService))
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
      deps: [MatSnackBar, UserService, ApiUrlService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlReplacementInterceptor,
      multi: true,
    },
  ],
};

async function initializeConfiguration(
  apiUrlService: ApiUrlService,
  userService: UserService
): Promise<void> {
  await apiUrlService.loadUrl();
  await userService.initUser();
}
