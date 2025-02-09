import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { Component, Inject, OnInit, forwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { ReplenishType } from 'src/app/api-classes/Abilities/Abilities/ReplenishType';
import { TargetType } from 'src/app/api-classes/Abilities/Abilities/TargetType';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { PersistencyService } from 'src/app/services/persistency/persistency.service';
import { ParentData, ParentType } from '../../ParentData';
import { RollDialogTabComponent } from '../../roll/roll-dialog-tab/roll-dialog-tab.component';
import { StatDialogTabComponent } from '../../stat/stat-dialog-tab/stat-dialog-tab.component';
import { TemplateDialogTabMultipleComponent } from '../../templates/template-dialog-tab/template-dialog-tab-multiple/template-dialog-tab-multiple.component';
import { ElementDialogTabMultipleComponent } from '../element-dialog-tab/element-dialog-tab-multiple/element-dialog-tab-multiple.component';
import { ElementDialogTabSingleComponent } from '../element-dialog-tab/element-dialog-tab-single/element-dialog-tab-single.component';
import { ElementEditComponent } from '../element-edit/element-edit.component';

@Component({
  selector: 'app-element-view',
  templateUrl: './element-view.component.html',
  styleUrls: ['../../dialog-view-shared.scss', './element-view.component.scss'],
  imports: [
    CdkScrollable,
    MatDialogContent,
    NgIf,
    MatGridList,
    MatGridTile,
    MatCheckbox,
    FormsModule,
    MatTabGroup,
    MatTab,
    forwardRef(() => ElementDialogTabMultipleComponent),
    forwardRef(() => ElementDialogTabSingleComponent),
    StatDialogTabComponent,
    TemplateDialogTabMultipleComponent,
    RollDialogTabComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ElementViewComponent implements OnInit {
  constructor(
    protected requestService: RequestService,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; route: string },
    public dialogRef: MatDialogRef<ElementViewComponent>,
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

  targetType = TargetType;
  replenishType = ReplenishType;

  async ngOnInit() {
    (await this.requestService.get(this.data.route, this.data.id)).subscribe(
      (x: any) => {
        this.element = x;

        this.elementSubject.next(x);
      }
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
