import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { ElementList } from 'src/app/models/elements/ElementList';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ElementListComponent } from '../../../../parts/element/element-list/element-list.component';
import { TemplateApiService } from '../template.api-service';

@Component({
  templateUrl: './template-select.dialog.html',
  styleUrls: ['./template-select.dialog.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    DragDropModule,
    ElementListComponent,
  ],
})
export class TemplateSelectDialog {
  constructor(private apiService: TemplateApiService) {
    this.getTemplateSelection();
  }

  data: { type: ElementType; parentType: ElementType; parentId: number } =
    inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<TemplateSelectDialog>);

  elementList!: ElementList;

  getTemplateSelection() {
    this.apiService.getTemplateSelection(this.data.type).subscribe((x) => {
      this.elementList = x;
    });
  }

  select(id: number) {
    this.dialogRef.close(id);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
