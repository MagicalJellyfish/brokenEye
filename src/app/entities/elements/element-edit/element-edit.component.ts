import { Component, Inject, OnInit } from '@angular/core';
import { ParentData, ParentType } from '../../ParentData';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { PersistencyService } from 'src/app/services/persistency/persistency.service';
import { Subject } from 'rxjs';
import { TargetType } from 'src/app/api-classes/Abilities/Abilities/TargetType';
import { ReplenishType } from 'src/app/api-classes/Abilities/Abilities/ReplenishType';

@Component({
  selector: 'app-element-edit',
  templateUrl: './element-edit.component.html',
  styleUrls: ['../../dialog-edit-shared.scss', './element-edit.component.scss'],
})
export class ElementEditComponent implements OnInit {
  constructor(
    protected requestService: RequestService,
    private objectService: ObjectService,
    public dialogRef: MatDialogRef<ElementEditComponent>,
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
