import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BrokenErrorHandler implements ErrorHandler {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: Error) {
    console.error(error);
    let errorMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.error.errors) {
        errorMessage = error.error.errors.type;
      }
      errorMessage = errorMessage ?? error.error ?? error.message;
    } else {
      errorMessage = error.message;
    }

    this.snackBar.open(errorMessage, 'Close');
  }
}
