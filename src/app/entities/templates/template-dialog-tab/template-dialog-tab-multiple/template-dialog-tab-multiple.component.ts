import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ParentData } from 'src/app/entities/ParentData';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { TemplateViewComponent } from '../../template-view/template-view.component';
import { TemplateSelectComponent } from '../../template-select/template-select.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-template-dialog-tab-multiple',
  templateUrl: './template-dialog-tab-multiple.component.html',
  styleUrls: ['./template-dialog-tab-multiple.component.scss'],
})
export class TemplateDialogTabMultipleComponent {
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
      this.elements = x[this.elementName];
      this.elementTable = new MatTableDataSource(this.elements);
    });

    if (this.parentData.editDialog) {
      this.elementTableCols.push('actions');
    }

    this.elements = this.parent[this.elementName];
    this.elementTable = new MatTableDataSource(this.elements);
  }

  elements: any;
  elementTable: MatTableDataSource<any> = new MatTableDataSource();
  elementTableCols: string[] = ['name'];

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
          this.elements = x[this.elementName];
          this.elementTable = new MatTableDataSource(this.elements);
        });
      });
  }

  async createElement() {
    let newElement: any = this.objectService.newAny(this.elementRoute);

    if (this.parentData.parentRoute.includes('Abilit')) {
      if (this.parentData.parentRoute == this.requestService.routes.ability) {
        newElement.applyingAbilitiesIds.push(this.parentData.parentId);
      } else {
        newElement.applyingAbilityTemplatesIds.push(this.parentData.parentId);
      }
    } else {
      newElement.modifierTemplatesIds.push(this.parentData.parentId);
    }

    (await this.requestService.create(this.elementRoute, newElement)).subscribe(
      (x: any) => {
        this.elements.push(x);
        this.elementTable = new MatTableDataSource(this.elements);
      }
    );
  }

  async addElement() {
    this.matDialog
      .open(TemplateSelectComponent, { data: { route: this.elementRoute } })
      .afterClosed()
      .subscribe(async (x) => {
        if (x != undefined) {
          let propertyName = this.elementName + 'Ids';

          (
            await this.requestService.fullPatch(
              this.parentData.parentRoute,
              this.parentData.parentId,
              [
                {
                  op: 'add',
                  path: '/' + propertyName + '/-',
                  value: x.id,
                },
              ]
            )
          ).subscribe((_) => {
            this.elements.push(x);
            this.elementTable = new MatTableDataSource(this.elements);
          });
        }
      });
  }

  async removeElement(id: number) {
    let propertyName = this.elementName + 'Ids';

    (
      await this.requestService.fullPatch(
        this.parentData.parentRoute,
        this.parentData.parentId,
        [
          {
            op: 'remove',
            path: '/' + propertyName + '/' + id,
          },
        ]
      )
    ).subscribe((_) => {
      this.elements.forEach((item: { id: number }, index: number) => {
        if (item.id === id) {
          this.elements.splice(index, 1);
        }
      });
      this.elementTable = new MatTableDataSource(this.elements);
    });
  }
}
