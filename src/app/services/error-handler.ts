import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BrokenErrorHandler implements ErrorHandler {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: Error) {
    console.error(error);
    this.snackBar.open(this.getErrorMessage(error), 'Close');
  }

  getErrorMessage(error: Error) {
    if (error instanceof HttpErrorResponse) {
      try {
        if (error.error) {
          if (error.error.errors) {
            return error.error.errors.type;
          }

          if (typeof error.error != 'object') {
            return error.error;
          }
        }

        if (error.status == 0) {
          return 'Server not reachable';
        }

        if (error.message) {
          return error.message;
        }

        return 'Unknown request error occurred. Please check and pass on the error in the console.';
      } catch (_) {
        return 'An unexpected error has occurred trying to show a request error message. Please check and pass on the error in the console.';
      }
    } else {
      return error.message;
    }
  }
}
