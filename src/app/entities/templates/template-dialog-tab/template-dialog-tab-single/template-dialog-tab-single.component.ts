import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { ParentData, ParentType } from 'src/app/entities/ParentData';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { TemplateViewComponent } from '../../template-view/template-view.component';
import { TemplateSelectComponent } from '../../template-select/template-select.component';
import { Subject } from 'rxjs';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-template-dialog-tab-single',
  templateUrl: './template-dialog-tab-single.component.html',
  styleUrls: ['./template-dialog-tab-single.component.scss'],
  imports: [
    NgIf,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatButton,
  ],
})
export class TemplateDialogTabSingleComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog
  ) {}

  @Input() parentData!: ParentData;
  @Input() elementRoute!: string;

  @Input() parent: any;
  @Input() elementName!: string;
  @Input() elementSubject!: Subject<any>;

  async ngOnInit() {
    this.elementSubject.subscribe((x) => {
      this.element = x[this.elementName];
      this.elementTable = new MatTableDataSource([this.element]);
    });

    if (this.elementRoute == this.requestService.routes.roundReminderTemplate) {
      this.elementTableCols = ['reminder'];
    } else {
      this.elementTableCols = ['name'];
    }

    this.element = this.parent[this.elementName];
    this.elementTable = new MatTableDataSource([this.element]);
  }

  element: any;
  elementTable: MatTableDataSource<any> = new MatTableDataSource();
  elementTableCols: string[] = [];

  viewElement(id: number) {
    this.matDialog
      .open(TemplateViewComponent, {
        maxWidth: '90vw',
        data: { id: id, route: this.elementRoute },
      })
      .afterClosed()
      .subscribe(async (_) => {
        (
          await this.requestService.get(
            this.parentData.parentRoute,
            this.parentData.parentId
          )
        ).subscribe((x: any) => {
          this.element = x[this.elementName];
          this.elementTable = new MatTableDataSource([this.element]);
        });
      });
  }

  async createElement() {
    let newElement: any = this.objectService.newAny(this.elementRoute);

    if (this.elementRoute == this.requestService.routes.effectCounterTemplate) {
      newElement.effectTemplatesIds.push(this.parentData.parentId);
    } else {
      switch (this.parentData.parentType) {
        case ParentType.Modifier:
          newElement.modifierTemplatesIds.push(this.parentData.parentId);
          break;
        case ParentType.Counter:
          newElement.counterTemplatesIds.push(this.parentData.parentId);
          break;
      }
    }

    (await this.requestService.create(this.elementRoute, newElement)).subscribe(
      (x: any) => {
        this.element = x;
        this.elementTable = new MatTableDataSource([this.element!]);
      }
    );
  }

  async addElement() {
    this.matDialog
      .open(TemplateSelectComponent, { data: { route: this.elementRoute } })
      .afterClosed()
      .subscribe(async (x) => {
        if (x != undefined) {
          let propertyName = this.elementRoute.slice(0, -1) + 'Id';

          (
            await this.requestService.patch(
              this.parentData.parentRoute,
              this.parentData.parentId,
              JSON.stringify({
                [propertyName]: x.id,
              })
            )
          ).subscribe((_) => {
            this.element = x;
            this.elementTable = new MatTableDataSource([this.element!]);
          });
        }
      });
  }

  async removeElement() {
    let propertyName = this.elementRoute.slice(0, -1) + 'Id';

    (
      await this.requestService.patch(
        this.parentData.parentRoute,
        this.parentData.parentId,
        JSON.stringify({
          [propertyName]: null,
        })
      )
    ).subscribe((_) => {
      this.element = undefined;
      this.elementTable = new MatTableDataSource([this.element!]);
    });
  }
}
