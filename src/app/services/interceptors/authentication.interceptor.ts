import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, defer, from, of, retry, throwError } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    if (
      this.userService.accessToken != undefined &&
      request.url.includes('brokenHeart:')
    ) {
      let firstAttempt: boolean = true;
      // Token the latest attempt was sent with, so a refresh can tell whether
      // another tab has already rotated the tokens in the meantime
      let usedAccessToken: string | null = null;

      return defer(() => {
        usedAccessToken = this.userService.accessToken;
        return of(
          request.clone({
            headers: request.headers.set(
              'Authorization',
              'Bearer ' + usedAccessToken,
            ),
          }),
        );
      }).pipe(
        concatMap((authenticatedRequest) => {
          return next.handle(authenticatedRequest);
        }),
        retry({
          // Bounds the loop should other tabs keep rotating the tokens
          count: 3,
          delay: (error) => {
            if (!(error instanceof HttpErrorResponse) || error.status != 401) {
              return throwError(() => error);
            }

            // Refresh if this is the first attempt, or if the token has changed through another tab since the last attempt
            if (firstAttempt || this.tokenChanged(usedAccessToken)) {
              firstAttempt = false;

              return from(this.userService.refreshTokens(usedAccessToken)).pipe(
                concatMap((refreshed) => {
                  if (refreshed || this.tokenChanged(usedAccessToken)) {
                    return of(true);
                  }
                  this.logoutIfUnchanged(usedAccessToken);
                  return throwError(() => error);
                }),
              );
            }

            this.logoutIfUnchanged(usedAccessToken);
            return throwError(() => error);
          },
        }),
      );
    }

    return next.handle(request);
  }

  private tokenChanged(usedAccessToken: string | null): boolean {
    const current = this.userService.accessToken;
    return current != null && current != usedAccessToken;
  }

  // Only log out if no other tab has logged in or refreshed in the meantime
  private logoutIfUnchanged(usedAccessToken: string | null) {
    if (
      this.userService.accessToken != null &&
      this.userService.accessToken == usedAccessToken
    ) {
      this.userService.logout();
    }
  }
}
