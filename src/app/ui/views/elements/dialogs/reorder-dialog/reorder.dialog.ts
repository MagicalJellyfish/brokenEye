import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
import { ElementReorder } from 'src/app/models/elements/saves/ElementReorder';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ElementApiService } from '../../element.api-service';

@Component({
  templateUrl: './reorder.dialog.html',
  styleUrls: ['./reorder.dialog.scss'],
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
  ],
})
export class ReorderDialog {
  constructor(private apiService: ElementApiService) {}

  data: { type: ElementType; elements: any[] } = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ReorderDialog>);

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.data.elements,
      event.previousIndex,
      event.currentIndex,
    );
  }

  saveReorder() {
    let reorders: ElementReorder[] = [];

    for (let i = 0; i < this.data.elements.length; i++) {
      reorders.push({ id: this.data.elements[i].id, viewPosition: i });
    }

    this.apiService.reorderElements(this.data.type, reorders).subscribe((_) => {
      this.dialogRef.close();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
