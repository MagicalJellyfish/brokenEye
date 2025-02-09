import {
  CdkDragDrop,
  moveItemInArray,
  CdkDropList,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-element-order',
  templateUrl: './element-order.component.html',
  styleUrls: ['./element-order.component.scss'],
  imports: [
    CdkScrollable,
    MatDialogContent,
    CdkDropList,
    NgFor,
    MatCard,
    CdkDrag,
    MatCardContent,
    MatIcon,
    NgIf,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ElementOrderComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    @Inject(MAT_DIALOG_DATA) public data: { elements: any[]; route: string },
    public dialogRef: MatDialogRef<ElementOrderComponent>
  ) {}

  async ngOnInit() {
    this.elements = structuredClone(this.data.elements);
  }

  elements: any[] = [];

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
  }

  async saveOrder() {
    for (let i = 0; i < this.elements.length; i++) {
      (
        await this.requestService.patch(
          this.data.route,
          this.elements.at(i)!.id,
          JSON.stringify({
            viewPosition: i,
          })
        )
      ).subscribe();
    }

    this.dialogRef.close();
  }
}
