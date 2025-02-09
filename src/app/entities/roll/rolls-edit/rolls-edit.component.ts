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
import { Roll } from 'src/app/api-classes/Abilities/Roll';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rolls-edit',
  templateUrl: './rolls-edit.component.html',
  styleUrls: ['./rolls-edit.component.scss'],
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
    MatIconButton,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatButton,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class RollsEditComponent {
  constructor(
    private requestService: RequestService,
    private dialogRef: MatDialogRef<RollsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rolls: Roll[] }
  ) {}

  async ngOnInit() {
    this.rolls = structuredClone(this.data.rolls);
    this.rollTable = new MatTableDataSource(this.rolls);
  }

  rolls: Roll[] = [];
  rollTableCols: string[] = ['name', 'instruction', 'actions'];
  rollTable = new MatTableDataSource<Roll>();

  async save() {
    this.dialogRef.close(this.rolls);
  }

  async add() {
    let roll: Roll = {
      id: 0,
      name: 'unnamed',
      instruction: '',
    };
    this.rolls.push(roll);
    this.rollTable = new MatTableDataSource(this.rolls);
  }

  async remove(roll: Roll) {
    this.rolls.forEach((item, index) => {
      if (item === roll) this.rolls.splice(index, 1);
    });
    this.rollTable = new MatTableDataSource(this.rolls);
  }
}
