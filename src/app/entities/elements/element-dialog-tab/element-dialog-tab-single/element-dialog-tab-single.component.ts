import { Component, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ParentData, ParentType } from 'src/app/entities/ParentData';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ElementViewComponent } from '../../element-view/element-view.component';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { TemplateSelectComponent } from 'src/app/entities/templates/template-select/template-select.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-element-dialog-tab-single',
  templateUrl: './element-dialog-tab-single.component.html',
  styleUrls: ['./element-dialog-tab-single.component.scss'],
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
      .open(ConfirmationDialogComponent, {
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
