import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-element-order',
  templateUrl: './element-order.component.html',
  styleUrls: ['./element-order.component.scss']
})
export class ElementOrderComponent implements OnInit {

  constructor(private requestService: RequestService, 
    @Inject(MAT_DIALOG_DATA) public data: { elements: any[], route: string },
    public dialogRef: MatDialogRef<ElementOrderComponent>) { }

  async ngOnInit() {
    this.elements = structuredClone(this.data.elements)
  }

  elements: any[] = []

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
  }

  async saveOrder() {
    for(let i=0; i < this.elements.length; i++) {
      (await this.requestService.patch(this.data.route, this.elements.at(i)!.id, JSON.stringify({
        "viewPosition": i
      }))).subscribe()
    }
    
    this.dialogRef.close()
  }
}
