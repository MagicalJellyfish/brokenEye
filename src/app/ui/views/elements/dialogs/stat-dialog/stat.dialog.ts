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
import { StatRelationItem } from 'src/app/models/elements/ElementView';
import { StatModel } from 'src/app/models/elements/models/StatModel';
import { ElementApiService } from '../../element.api-service';

@Component({
  templateUrl: './stat.dialog.html',
  styleUrls: ['./stat.dialog.scss'],
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
export class StatDialog {
  constructor(private apiService: ElementApiService) {
    apiService.getStats().subscribe((x) => {
      (x as StatModel[]).forEach((stat) => {
        if (!this.statValues.find((x) => x.statId == stat.id)) {
          this.statValues.push({
            id: 0,
            statId: stat.id,
            name: stat.name,
            value: 0,
          });
        }
      });

      this.statValues = [...this.statValues].sort(
        (x, y) => x.statId - y.statId,
      );
    });
  }

  data: {
    stats: StatRelationItem[];
  } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<StatDialog>);

  statValues = [...this.data.stats];

  saveValues() {
    this.dialogRef.close(
      this.statValues.map((x) => {
        return { id: x.statId, value: +x.value };
      }),
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
