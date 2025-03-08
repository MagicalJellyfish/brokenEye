import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RollRelationItem } from 'src/app/models/elements/ElementView';
import { ElementApiService } from '../../element.api-service';

@Component({
  templateUrl: './roll.dialog.html',
  styleUrls: ['./roll.dialog.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
  ],
})
export class RollDialog {
  constructor(private apiService: ElementApiService) {}

  data: { parentId: number; rolls: RollRelationItem[] } =
    inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<RollDialog>);

  rolls = [...this.data.rolls];

  add() {
    this.rolls = this.rolls.concat([{ id: 0, name: '', roll: '' }]);
  }

  remove(id: number) {
    this.rolls = this.rolls.filter((x) => x.id != id);
  }

  saveRolls() {
    this.apiService
      .saveRolls(
        this.data.parentId,
        this.rolls.map((x) => {
          return { id: x.id, name: x.name, value: x.roll };
        }),
      )
      .subscribe((_) => {
        this.dialogRef.close();
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
