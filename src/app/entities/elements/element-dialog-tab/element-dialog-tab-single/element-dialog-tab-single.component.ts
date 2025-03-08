import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Subject } from 'rxjs';
import { ParentData, ParentType } from 'src/app/entities/ParentData';
import { TemplateSelectComponent } from 'src/app/entities/templates/template-select/template-select.component';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ConfirmationDialog } from 'src/app/ui/core/confirmation-dialog/confirmation.dialog';
import { ElementViewComponent } from '../../element-view/element-view.component';

@Component({
  selector: 'app-element-dialog-tab-single',
  templateUrl: './element-dialog-tab-single.component.html',
  styleUrls: ['./element-dialog-tab-single.component.scss'],
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
export class ElementDialogTabSingleComponent {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog,
  ) {}

  @Input() parentData!: ParentData;
  @Input() elementRoute!: string;

  @Input() parent: any;
  @Input() elementName!: string;
  @Input() elementSubject!: Subject<any>;

  ngOnInit() {
    this.elementSubject.subscribe((x) => {
      this.element = x[this.elementName];
      this.elementTable = new MatTableDataSource([this.element]);
    });

    if (this.elementRoute == this.requestService.routes.roundReminder) {
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
      .open(ElementViewComponent, {
        maxWidth: '90vw',
        data: { id: id, route: this.elementRoute },
      })
      .afterClosed()
      .subscribe(async (_) => {
        (
          await this.requestService.get(
            this.parentData.parentRoute,
            this.parentData.parentId,
          )
        ).subscribe((x: any) => {
          this.element = x[this.elementName];
          this.elementTable = new MatTableDataSource([this.element]);
        });
      });
  }

  async createElement() {
    let newElement: any = this.objectService.newAny(this.elementRoute);

    if (this.elementRoute == this.requestService.routes.effectCounter) {
      newElement.effectId = this.parentData.parentId;
    } else {
      switch (this.parentData.parentType) {
        case ParentType.Modifier:
          newElement.modifierId = this.parentData.parentId;
          break;
        case ParentType.Counter:
          newElement.counterId = this.parentData.parentId;
          break;
      }
    }

    (await this.requestService.create(this.elementRoute, newElement)).subscribe(
      (x: any) => {
        this.element = x;
        this.elementTable = new MatTableDataSource([this.element!]);
      },
    );
  }

  async addElement() {
    this.matDialog
      .open(TemplateSelectComponent, {
        data: {
          route: this.requestService.elementToTemplateRoute(this.elementRoute),
        },
      })
      .afterClosed()
      .subscribe(async (template) => {
        (
          await this.requestService.get(
            this.requestService.elementToTemplateRoute(this.elementRoute) +
              '/Instantiate',
            template.id,
          )
        ).subscribe(async (newElement: any) => {
          switch (this.parentData.parentType) {
            case ParentType.Modifier:
              newElement.modifierId = this.parentData.parentId;
              break;
            case ParentType.Counter:
              newElement.counterId = this.parentData.parentId;
              break;
          }

          (
            await this.requestService.create(this.elementRoute, newElement)
          ).subscribe((x) => {
            this.element = x;
            this.elementTable = new MatTableDataSource([this.element!]);
          });
        });
      });
  }

  async removeElement() {
    this.matDialog
      .open(ConfirmationDialog, {
        data: { message: 'Are you sure you want to delete this element?' },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x) {
          (
            await this.requestService.delete(this.elementRoute, this.element.id)
          ).subscribe((_) => {
            this.element = undefined;
            this.elementTable = new MatTableDataSource([this.element!]);
          });
        }
      });
  }
}
