import { Component, Inject, OnInit } from '@angular/core';
import { ParentData, ParentType } from '../../ParentData';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { PersistencyService } from 'src/app/services/persistency/persistency.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['../../dialog-edit-shared.scss', './template-edit.component.scss']
})
export class TemplateEditComponent implements OnInit {

  constructor(protected requestService: RequestService, private objectService: ObjectService, 
    public dialogRef: MatDialogRef<TemplateEditComponent>,
    private matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { id: number, route: string }, protected persistencyService: PersistencyService) 
  { 
    if(data.route.includes('Counter')) {
      this.parentData = new ParentData(ParentType.Counter, data.route, data.id, true)
    }
    else {
      this.parentData = new ParentData(ParentType.Modifier, data.route, data.id, true)
    }
  }

  elementSubject = new Subject<any>()
  parentData: ParentData

  async ngOnInit() {
    (await this.requestService.get(this.data.route, this.data.id)).subscribe((x: any) => {
      this.element = x

      this.elementSubject.next(x)
    })
  }

  element?: any;

  async save() {
    if(this.element) {
      let requestElement = structuredClone(this.element)

      Object.keys(requestElement!).forEach(key => {
        if(key.toLowerCase().includes("id")) {
          delete requestElement[key]
        }

        if(this.objectService.groupKeys.some(x => x == key)) {
          delete requestElement[key]
        }
      });

      (await this.requestService.patch(this.data.route, this.element.id, JSON.stringify(requestElement))).subscribe()
    }

    this.dialogRef.close(true)
  }

  async delete() {
    this.matDialog.open(ConfirmationDialogComponent, { data: { message: "Are you sure you want to delete this element?" }}).afterClosed().subscribe(async x =>
      {
        if(x) {
          (await this.requestService.delete(this.data.route, this.element!.id)).subscribe(_ => {
            this.dialogRef.close(false)
          })
        }
      }
    )
  }
}
