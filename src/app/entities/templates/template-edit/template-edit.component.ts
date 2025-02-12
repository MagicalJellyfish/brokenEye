import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { ReplenishType } from 'src/app/api-classes/Abilities/Abilities/ReplenishType';
import { TargetType } from 'src/app/api-classes/Abilities/Abilities/TargetType';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { PersistencyService } from 'src/app/services/persistency/persistency.service';
import { ConfirmationDialogComponent } from 'src/app/ui/parts/confirmation-dialog/confirmation-dialog.component';
import { ParentData, ParentType } from '../../ParentData';
import { RollDialogTabComponent } from '../../roll/roll-dialog-tab/roll-dialog-tab.component';
import { StatDialogTabComponent } from '../../stat/stat-dialog-tab/stat-dialog-tab.component';
import { TemplateDialogTabMultipleComponent } from '../template-dialog-tab/template-dialog-tab-multiple/template-dialog-tab-multiple.component';
import { TemplateDialogTabSingleComponent } from '../template-dialog-tab/template-dialog-tab-single/template-dialog-tab-single.component';

@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: [
    '../../dialog-edit-shared.scss',
    './template-edit.component.scss',
  ],
  imports: [
    CdkScrollable,
    MatDialogContent,
    NgIf,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    FormsModule,
    MatGridList,
    MatGridTile,
    MatSelect,
    NgFor,
    MatOption,
    MatCheckbox,
    MatTabGroup,
    MatTab,
    TemplateDialogTabMultipleComponent,
    TemplateDialogTabSingleComponent,
    StatDialogTabComponent,
    RollDialogTabComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class TemplateEditComponent implements OnInit {
  constructor(
    protected requestService: RequestService,
    private objectService: ObjectService,
    public dialogRef: MatDialogRef<TemplateEditComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; route: string },
    protected persistencyService: PersistencyService
  ) {
    if (data.route.includes('Counter')) {
      this.parentData = new ParentData(
        ParentType.Counter,
        data.route,
        data.id,
        true
      );
    } else {
      this.parentData = new ParentData(
        ParentType.Modifier,
        data.route,
        data.id,
        true
      );
    }
  }

  elementSubject = new Subject<any>();
  parentData: ParentData;

  async ngOnInit() {
    (await this.requestService.get(this.data.route, this.data.id)).subscribe(
      (x: any) => {
        this.element = x;

        if (this.data.route.includes('Abilit')) {
          this.selectedTargetType = TargetType[x.targetType];
          this.selectedReplenishType = ReplenishType[x.replenishType];
        }

        this.elementSubject.next(x);
      }
    );
  }

  element?: any;

  targetTypeOptions = Object.keys(TargetType).filter((x) => isNaN(Number(x)));
  selectedTargetType: string = TargetType[TargetType.None];

  replenishTypeOptions = Object.keys(ReplenishType).filter((x) =>
    isNaN(Number(x))
  );
  selectedReplenishType: string = ReplenishType[ReplenishType.None];

  async save() {
    if (this.element) {
      let requestElement = structuredClone(this.element);

      Object.keys(requestElement!).forEach((key) => {
        if (key.toLowerCase().includes('id')) {
          delete requestElement[key];
        }

        if (this.objectService.groupKeys.some((x) => x == key)) {
          delete requestElement[key];
        }
      });

      if (this.data.route.includes('Abilit')) {
        requestElement.targetType =
          TargetType[this.selectedTargetType as keyof typeof TargetType];

        requestElement.replenishType =
          ReplenishType[
            this.selectedReplenishType as keyof typeof ReplenishType
          ];
      }

      (
        await this.requestService.patch(
          this.data.route,
          this.element.id,
          JSON.stringify(requestElement)
        )
      ).subscribe();
    }

    this.dialogRef.close(true);
  }

  async delete() {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: { message: 'Are you sure you want to delete this element?' },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x) {
          (
            await this.requestService.delete(this.data.route, this.element!.id)
          ).subscribe((_) => {
            this.dialogRef.close(false);
          });
        }
      });
  }
}
