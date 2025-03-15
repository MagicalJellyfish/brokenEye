import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { concatMap, defer, of, retry, throwError } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    if (
      this.userService.accessToken != undefined &&
      request.url.includes('brokenHeart:')
    ) {
      let firstAttempt: boolean = true;

      return defer(() =>
        of(
          request.clone({
            headers: request.headers.set(
              'Authorization',
              'Bearer ' + this.userService.accessToken,
            ),
          }),
        ),
      ).pipe(
        concatMap((authenticatedRequest) => {
          return next.handle(authenticatedRequest);
        }),
        retry({
          delay: (error) => {
            if (error instanceof HttpErrorResponse && error.status == 401) {
              if (firstAttempt) {
                firstAttempt = false;

                let result = this.userService.refreshTokens();
                if (!result) {
                  return throwError(() => new Error());
                }
                return result;
              }

              this.userService.logout();
              this.snackBar.open('Reauthentication failed. Logging out.');
              return throwError(() => error);
            }

            return throwError(() => error);
          },
        }),
      );
    }

    return next.handle(request);
  }
}
