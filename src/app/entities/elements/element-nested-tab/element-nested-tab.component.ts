import { Component, Input, OnInit, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ElementEditComponent } from '../element-edit/element-edit.component';
import { ElementViewComponent } from '../element-view/element-view.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ElementOrderComponent } from '../element-order/element-order.component';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TemplateSelectComponent } from '../../templates/template-select/template-select.component';
import { Character } from 'src/app/api-classes/Characters/Character';

@Component({
  selector: 'app-element-nested-tab',
  templateUrl: './element-nested-tab.component.html',
  styleUrls: ['./element-nested-tab.component.scss'],
})
export class ElementNestedTabComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog
  ) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;
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

      if (this.elementRoute != this.requestService.routes.ability) {
        let routeList = [
          this.requestService.routes.trait,
          this.requestService.routes.item,
          this.requestService.routes.effect,
        ];
        if (routeList.includes(this.elementRoute)) {
          this.elementTableCols.push('abstract');
        } else {
          this.elementTableCols.push('description');
        }
      }

      switch (this.elementRoute) {
        case this.requestService.routes.trait:
          this.elementTableCols.push('active');
          break;
        case this.requestService.routes.item:
          this.elementTableCols.push('equipped');
          break;
        case this.requestService.routes.counter:
          this.elementTableCols.push('count');
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
    this.elements = [];
    if (this.elementRoute == this.requestService.routes.counter) {
      this.char.traits.forEach((trait) => {
        if (trait.counters.length > 0) {
          trait.counters.forEach((counter: any) => {
            counter.source = 'Trait "' + trait.name + '"';
            this.elements.push(counter);
          });
        }
      });

      this.char.items.forEach((item) => {
        if (item.counters.length > 0) {
          item.counters.forEach((counter: any) => {
            counter.source = 'Item "' + item.name + '"';
            this.elements.push(counter);
          });
        }
      });

      this.char.effects.forEach((effect) => {
        if (effect.counters.length > 0) {
          effect.counters.forEach((counter: any) => {
            counter.source = 'Effect "' + effect.name + '"';
            this.elements.push(counter);
          });
        }
        if (effect.effectCounter != undefined) {
          let effectCounter: any = effect.effectCounter;
          effectCounter.source =
            'Effect-Counter of Effect  "' + effect.name + '"';
          this.elements.push(effectCounter);
        }
      });
    } else if (this.elementRoute == this.requestService.routes.roundReminder) {
      this.char.traits.forEach((trait) => {
        if (trait.roundReminder != undefined) {
          let roundReminder: any = trait.roundReminder;
          roundReminder.source = 'Trait "' + trait.name + '"';
          this.elements.push(roundReminder);
        }

        if (trait.counters.length > 0) {
          trait.counters.forEach((counter) => {
            if (counter.roundReminder != undefined) {
              let roundReminder: any = counter.roundReminder;
              roundReminder.source =
                'Counter "' + counter.name + '" on Trait "' + trait.name + '"';
              this.elements.push(roundReminder);
            }
          });
        }
      });

      this.char.items.forEach((item) => {
        if (item.roundReminder != undefined) {
          let roundReminder: any = item.roundReminder;
          roundReminder.source = 'Item "' + item.name + '"';
          this.elements.push(roundReminder);
        }

        if (item.counters.length > 0) {
          item.counters.forEach((counter) => {
            if (counter.roundReminder != undefined) {
              let roundReminder: any = counter.roundReminder;
              roundReminder.source =
                'Counter "' + counter.name + '" on Item "' + item.name + '"';
              this.elements.push(roundReminder);
            }
          });
        }
      });

      this.char.effects.forEach((effect) => {
        if (effect.roundReminder != undefined) {
          let roundReminder: any = effect.roundReminder;
          roundReminder.source = 'Effect "' + effect.name + '"';
          this.elements.push(roundReminder);
        }

        if (effect.counters.length > 0) {
          effect.counters.forEach((counter) => {
            if (counter.roundReminder != undefined) {
              let roundReminder: any = counter.roundReminder;
              roundReminder.source =
                'Counter "' +
                counter.name +
                '" on Effect "' +
                effect.name +
                '"';
              this.elements.push(roundReminder);
            }
          });
        }
      });

      if (this.char.counters.length > 0) {
        this.char.counters.forEach((counter) => {
          if (counter.roundReminder != undefined) {
            let roundReminder: any = counter.roundReminder;
            roundReminder.source = 'Counter "' + counter.name + '"';
            this.elements.push(roundReminder);
          }
        });
      }
    } else if (this.elementRoute == this.requestService.routes.ability) {
      this.char.items.forEach((item) => {
        if (item.abilities.length > 0) {
          item.abilities.forEach((ability: any) => {
            ability.source = 'Item "' + item.name + '"';
            this.elements.push(ability);
          });
        }
      });
    }

    this.elements.sort(function (
      a: { viewPosition: number },
      b: { viewPosition: number }
    ) {
      return a.viewPosition - b.viewPosition;
    });

    if (this.elementRoute == this.requestService.routes.counter) {
      this.char.counters.forEach((x) => {
        this.counterValueDebounces.set(x.id, new Subject<string>());
        this.counterValueDebouncings.set(x.id, false);

        this.counterValueDebounces
          .get(x.id)!
          .subscribe((_) => this.counterValueDebouncings.set(x.id, true));
        this.counterValueDebounces
          .get(x.id)!
          .pipe(debounceTime(2000), distinctUntilChanged())
          .subscribe((y) => {
            this.updateCounter(x.id, +y);
          });
      });
    }

    this.elementTable = new MatTableDataSource(this.elements);
  }

  elements: any;
  elementTable = new MatTableDataSource<any>();
  elementTableCols: string[] = ['source'];

  counterValueDebounces = new Map<number, Subject<string>>();
  counterValueDebouncings = new Map<number, boolean>();

  boxProperty: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  orderElements() {
    this.matDialog.open(ElementOrderComponent, {
      data: { elements: this.elements, route: this.elementRoute },
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
