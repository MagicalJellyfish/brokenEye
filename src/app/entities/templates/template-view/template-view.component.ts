import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ParentData, ParentType } from '../../ParentData';
import { TemplateEditComponent } from '../template-edit/template-edit.component';
import { PersistencyService } from 'src/app/services/persistency/persistency.service';
import { Subject } from 'rxjs';
import { TargetType } from 'src/app/api-classes/Abilities/Abilities/TargetType';
import { ReplenishType } from 'src/app/api-classes/Abilities/Abilities/ReplenishType';

@Component({
  selector: 'app-template-view',
  templateUrl: './template-view.component.html',
  styleUrls: [
    '../../dialog-view-shared.scss',
    './template-view.component.scss',
  ],
})
export class TemplateViewComponent implements OnInit {
  constructor(
    protected requestService: RequestService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; route: string },
    public dialogRef: MatDialogRef<TemplateViewComponent>,
    protected persistencyService: PersistencyService
  ) {
    if (data.route.includes('Counter')) {
      this.parentData = new ParentData(
        ParentType.Counter,
        data.route,
        data.id,
        false
      );
    } else {
      this.parentData = new ParentData(
        ParentType.Modifier,
        data.route,
        data.id,
        false
      );
    }
  }

  elementSubject = new Subject<any>();
  parentData: ParentData;

  async ngOnInit() {
    (await this.requestService.get(this.data.route, this.data.id)).subscribe(
      (x: any) => {
        this.element = x;

        this.elementSubject.next(x);
      }
    );
  }

  element?: any;

  targetType = TargetType;
  replenishType = ReplenishType;

  editElement() {
    this.matDialog
      .open(TemplateEditComponent, {
        maxWidth: '90vw',
        data: { id: this.element?.id, route: this.data.route },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x === false) {
          this.dialogRef.close(true);
        } else {
          (
            await this.requestService.get(this.data.route, this.data.id)
          ).subscribe((x: any) => {
            this.element = x;

            this.elementSubject.next(x);
          });
        }
      });
  }
}
