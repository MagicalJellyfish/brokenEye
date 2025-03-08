import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  templateUrl: './confirmation.dialog.html',
  styleUrls: ['./confirmation.dialog.scss'],
  imports: [MatDialogContent, MatDialogActions, MatButton],
})
export class ConfirmationDialog {
  data: { message: string } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialog>);

  yes() {
    this.dialogRef.close(true);
  }

  no() {
    this.dialogRef.close(false);
  }
}
