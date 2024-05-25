import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ElementEditComponent } from '../element-edit/element-edit.component';
import { ElementViewComponent } from '../element-view/element-view.component';
import { Subject } from 'rxjs';
import { ElementOrderComponent } from '../element-order/element-order.component';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TemplateSelectComponent } from '../../templates/template-select/template-select.component';
import { Character } from 'src/app/api-classes/Characters/Character';
import { Debouncer } from 'src/app/core/debouncer/debouncer';

@Component({
  selector: 'app-element-tab',
  templateUrl: './element-tab.component.html',
  styleUrls: ['./element-tab.component.scss'],
})
export class ElementTabComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog
  ) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;
  @Input() propertyName!: keyof Character;
  @Input() elementRoute!: string;

  async ngOnInit() {
    if (this.elementRoute == this.requestService.routes.roundReminder) {
      this.elementTableCols.push('reminder', 'reminding');

      this.elementTable.filterPredicate = function (
        data,
        filter: string
      ): boolean {
        return data.reminder.toLowerCase().includes(filter);
      };
    } else {
      this.elementTableCols.push('name');

      let routeList = [
        this.requestService.routes.trait,
        this.requestService.routes.item,
        this.requestService.routes.effect,
      ];
      if (routeList.includes(this.elementRoute)) {
        this.elementTableCols.push('abstract');
      } else if (this.elementRoute != this.requestService.routes.variable) {
        this.elementTableCols.push('description');
      }

      switch (this.elementRoute) {
        case this.requestService.routes.trait:
          this.elementTableCols.push('active');
          break;
        case this.requestService.routes.item:
          this.elementTableCols.push('equipped');
          this.elementTableCols.push('amount');
          break;
        case this.requestService.routes.counter:
          this.elementTableCols.push('count');
          break;
        case this.requestService.routes.variable:
          this.elementTableCols.push('value');
          break;
      }

      this.elementTable.filterPredicate = function (
        data,
        filter: string
      ): boolean {
        return data.name.toLowerCase().includes(filter);
      };
    }
    this.elementTableCols.push('actions');

    this.update();

    this.pcSubject.subscribe((x: Character) => {
      this.char = x;
      this.update();
    });
  }

  update() {
    this.elements = this.char[this.propertyName];

    this.elements.sort(function (
      a: { viewPosition: number },
      b: { viewPosition: number }
    ) {
      return a.viewPosition - b.viewPosition;
    });

    if (this.elementRoute == this.requestService.routes.counter) {
      this.char.counters.forEach((x) => {
        this.counterValueDebouncers.set(x.id, new Debouncer<string>());

        this.counterValueDebouncers
          .get(x.id)!
          .SaveSubject.subscribe((y) => this.updateCounter(x.id, +y));
      });
    }

    if (this.elementRoute == this.requestService.routes.item) {
      this.char.items.forEach((x) => {
        this.itemAmountDebouncers.set(x.id, new Debouncer<string>());

        this.itemAmountDebouncers
          .get(x.id)!
          .SaveSubject.subscribe((y) => this.updateItemAmount(x.id, +y));
      });
    }

    if (this.elementRoute == this.requestService.routes.variable) {
      this.char.variables.forEach((x) => {
        this.variableValueDebouncers.set(x.id, new Debouncer<string>());

        this.variableValueDebouncers
          .get(x.id)!
          .SaveSubject.subscribe((y) => this.updateVariable(x.id, +y));
      });
    }

    this.elementTable = new MatTableDataSource(this.elements);
  }

  elements: any;
  elementTable = new MatTableDataSource<any>();
  elementTableCols: string[] = [];

  counterValueDebouncers = new Map<number, Debouncer<string>>();
  itemAmountDebouncers = new Map<number, Debouncer<string>>();
  variableValueDebouncers = new Map<number, Debouncer<string>>();

  boxProperty: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  async createElement() {
    let newElement: any = this.objectService.newAny(this.elementRoute);
    newElement.characterId = this.char.id;

    (await this.requestService.create(this.elementRoute, newElement)).subscribe(
      (x: any) => {
        this.matDialog.open(ElementEditComponent, {
          maxWidth: '90vw',
          data: { id: x.id, route: this.elementRoute },
        });
      }
    );
  }

  orderElements() {
    this.matDialog.open(ElementOrderComponent, {
      data: { elements: this.elements, route: this.elementRoute },
    });
  }

  addTemplate() {
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
        ).subscribe(async (element: any) => {
          element.characterId = this.char.id;
          (
            await this.requestService.create(this.elementRoute, element)
          ).subscribe();
        });
      });
  }

  viewElement(id: number) {
    this.matDialog.open(ElementViewComponent, {
      maxWidth: '90vw',
      data: { id: id, route: this.elementRoute },
    });
  }

  async deleteElement(id: number) {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: { message: 'Are you sure you want to delete this element?' },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x) {
          (await this.requestService.delete(this.elementRoute, id)).subscribe();
        }
      });
  }

  async updateCounter(id: number, value: number) {
    (
      await this.requestService.patch(
        this.requestService.routes.counter,
        id,
        JSON.stringify({
          value: value,
        })
      )
    ).subscribe();
  }

  async updateItemAmount(id: number, value: number) {
    (
      await this.requestService.patch(
        this.requestService.routes.item,
        id,
        JSON.stringify({
          amount: value,
        })
      )
    ).subscribe();
  }

  async updateVariable(id: number, value: number) {
    (
      await this.requestService.patch(
        this.requestService.routes.variable,
        id,
        JSON.stringify({
          value: value,
        })
      )
    ).subscribe();
  }

  async updateCheckbox(
    id: number,
    propertyName: string,
    event: MatCheckboxChange
  ) {
    (
      await this.requestService.patch(
        this.elementRoute,
        id,
        JSON.stringify({
          [propertyName]: event.checked,
        })
      )
    ).subscribe();
  }
}
