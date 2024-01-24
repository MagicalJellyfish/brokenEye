import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, firstValueFrom, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = ""
        if(error.message != "") {
          switch(error.status) {
            case 400:
              errorMsg = "400 Bad Request - "
              break;
            case 403:
              errorMsg = "403 Forbidden - "
              break;
          }

          if(errorMsg != "") {
            errorMsg += error.error
          }
        }

        if(errorMsg == "") {
          switch(error.status) {
            case 0:
              errorMsg = "Server not reachable or not responding"
              break;
            case 400:
              errorMsg = "400 Bad Request - Sent data does not match the required layout or has other errors"
              break;
            case 401: 
              errorMsg = "401 Unauthorized - Log in for access"
              break;
            case 403:
              errorMsg = "403 Forbidden - Your account cannot access this resource or your credentials have expired"
              break;
            case 404:
              errorMsg = "404 Not Found - No object of requested type found"
              break;
            case 500:
              errorMsg = "500 Internal Server Error - Server failed processing request"
          }
        }

        this.snackBar.open(errorMsg, "Close", { duration: 60000 })
        return throwError(() => error);
      })
    );
  }
}
