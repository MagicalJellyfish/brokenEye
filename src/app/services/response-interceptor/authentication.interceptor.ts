import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  concatMap,
  defer,
  findIndex,
  first,
  of,
  retry,
  throwError,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user/user.service';
import { ApiUrlService } from '../api/apiUrl/api-url.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private userService: UserService,
    private apiUrlService: ApiUrlService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    if (
      request.url.includes(this.apiUrlService.apiUrl) &&
      !request.url.includes('/Auth/refresh-token') &&
      !request.url.includes('/Auth/login') &&
      !request.url.includes('/Auth/register')
    ) {
      let firstAttempt: boolean = true;

      return defer(() =>
        of(
          request.clone({
            headers: request.headers.set(
              'Authorization',
              'Bearer ' + this.userService.accessToken
            ),
          })
        )
      ).pipe(
        concatMap((authenticatedRequest) => {
          return next.handle(authenticatedRequest);
        }),
        retry({
          delay: (error) => {
            if (error instanceof HttpErrorResponse && error.status == 401) {
              if (firstAttempt) {
                firstAttempt = false;
                return this.userService.refreshTokens();
              }

              this.userService.logout();
              this.snackBar.open('Reauthentication failed. Logging out.');
              return throwError(() => error);
            }

            this.errorMessaging(error);
            return throwError(() => error);
          },
        })
      );
    }

    return next.handle(request);
  }

  private errorMessaging(error: HttpErrorResponse) {
    let errorMsg = '';
    if (error.message != '') {
      switch (error.status) {
        case 400:
          errorMsg = '400 Bad Request - ';
          break;
        case 401:
          errorMsg = '401 Unauthorized - ';
          break;
        case 403:
          errorMsg = '403 Forbidden - ';
          break;
        case 500:
          errorMsg = '500 Internal Server Error - ';
          break;
      }

      if (errorMsg != '') {
        if (typeof error.error == 'object') {
          errorMsg += error.error.title;
        } else {
          errorMsg += error.error;
        }
      }
    }

    if (errorMsg == '') {
      switch (error.status) {
        case 0:
          errorMsg = 'Server not reachable or not responding';
          break;
        case 400:
          errorMsg =
            '400 Bad Request - Sent data does not match the required layout or has other errors';
          break;
        case 401:
          errorMsg = '401 Unauthorized - Log in for access';
          break;
        case 403:
          errorMsg =
            '403 Forbidden - Your account cannot access this resource or your credentials have expired';
          break;
        case 404:
          errorMsg = '404 Not Found - No object of requested type found';
          break;
        case 500:
          errorMsg =
            '500 Internal Server Error - Server failed processing request';
      }
    }

    this.snackBar.open(errorMsg, 'Close', { duration: 60000 });
  }
}
