import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-stats-edit',
  templateUrl: './stats-edit.component.html',
  styleUrls: ['./stats-edit.component.scss'],
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class StatsEditComponent {
  constructor(
    private requestService: RequestService,
    private dialogRef: MatDialogRef<StatsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { statValues: StatValue[] }
  ) {}

  async ngOnInit() {
    (
      await this.requestService.getAll(
        this.requestService.routes.constant + '/Stats'
      )
    ).subscribe((stats: any) => {
      for (let i = 0; i < stats.length; i++) {
        let statValue: StatValue = {
          id: 0,
          value: 0,
          statId: stats[i].id,
          stat: stats[i],
        };

        this.data.statValues.forEach((statIncrease) => {
          if (stats[i].id == statIncrease.stat?.id) {
            statValue.id = statIncrease.id;
            statValue.value = statIncrease.value;
          }
        });

        this.statValues.push(statValue);
      }
      this.statValueTable = new MatTableDataSource(this.statValues);
    });
  }

  statValues: StatValue[] = [];
  statValueTableCols: string[] = ['name', 'value'];
  statValueTable = new MatTableDataSource<StatValue>();

  async save() {
    this.dialogRef.close(this.statValues);
  }
}
