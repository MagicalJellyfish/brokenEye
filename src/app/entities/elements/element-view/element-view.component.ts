import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ParentData, ParentType } from '../../ParentData';
import { ElementEditComponent } from '../element-edit/element-edit.component';
import { PersistencyService } from 'src/app/services/persistency/persistency.service';
import { Subject } from 'rxjs';
import { TargetType } from 'src/app/api-classes/Abilities/Abilities/TargetType';

@Component({
  selector: 'app-element-view',
  templateUrl: './element-view.component.html',
  styleUrls: ['../../dialog-view-shared.scss', './element-view.component.scss'],
})
export class ElementViewComponent implements OnInit {
  constructor(
    protected requestService: RequestService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; route: string },
    public dialogRef: MatDialogRef<ElementViewComponent>,
    protected persistencyService: PersistencyService,
  ) {
    if (data.route.includes('Counter')) {
      this.parentData = new ParentData(
        ParentType.Counter,
        data.route,
        data.id,
        false,
      );
    } else {
      this.parentData = new ParentData(
        ParentType.Modifier,
        data.route,
        data.id,
        false,
      );
    }
  }

  elementSubject = new Subject<any>();
  parentData: ParentData;

  targetType = TargetType;

  async ngOnInit() {
    (await this.requestService.get(this.data.route, this.data.id)).subscribe(
      (x: any) => {
        this.element = x;

        this.elementSubject.next(x);
      },
    );
  }

  element?: any;

  editElement() {
    this.matDialog
      .open(ElementEditComponent, {
        maxWidth: '90vw',
        data: { id: this.element?.id, route: this.data.route },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x === false) {
          this.dialogRef.close();
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
