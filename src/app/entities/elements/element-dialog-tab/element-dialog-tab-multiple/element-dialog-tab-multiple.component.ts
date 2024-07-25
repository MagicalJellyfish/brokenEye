import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ParentData } from 'src/app/entities/ParentData';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ElementViewComponent } from '../../element-view/element-view.component';
import { TemplateSelectComponent } from 'src/app/entities/templates/template-select/template-select.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-element-dialog-tab-multiple',
  templateUrl: './element-dialog-tab-multiple.component.html',
  styleUrls: ['./element-dialog-tab-multiple.component.scss'],
})
export class ElementDialogTabMultipleComponent {
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

  ngOnInit() {
    this.elementSubject.subscribe((x) => {
      this.elements = x[this.elementName];
      this.elementTable = new MatTableDataSource(this.elements);
    });

    this.elements = this.parent[this.elementName];
    this.elementTable = new MatTableDataSource(this.elements);
  }

  elements: any;
  elementTable: MatTableDataSource<any> = new MatTableDataSource();
  elementTableCols: string[] = ['name'];

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
            this.parentData.parentId
          )
        ).subscribe((x: any) => {
          this.elements = x[this.elementName];
          this.elementTable = new MatTableDataSource(this.elements);
        });
      });
  }

  async createElement() {
    let newElement: any = this.objectService.newAny(this.elementRoute);

    newElement.modifierId = this.parentData.parentId;

    (await this.requestService.create(this.elementRoute, newElement)).subscribe(
      (x: any) => {
        this.elements.push(x);
        this.elementTable = new MatTableDataSource(this.elements);
      }
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
            template.id
          )
        ).subscribe(async (newElement: any) => {
          newElement.modifierId = this.parentData.parentId;

          (
            await this.requestService.create(this.elementRoute, newElement)
          ).subscribe((x) => {
            this.elements.push(x);
            this.elementTable = new MatTableDataSource(this.elements);
          });
        });
      });
  }
}
