import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
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
import { Character } from 'src/app/api-classes/Characters/Character';
import { Debouncer } from 'src/app/logic/core/debouncer/debouncer';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { ConfirmationDialog } from 'src/app/ui/core/confirmation-dialog/confirmation.dialog';
import { TemplateSelectComponent } from '../../templates/template-select/template-select.component';
import { ElementEditComponent } from '../element-edit/element-edit.component';
import { ElementOrderComponent } from '../element-order/element-order.component';
import { ElementViewComponent } from '../element-view/element-view.component';

@Component({
  selector: 'app-element-tab',
  templateUrl: './element-tab.component.html',
  styleUrls: ['./element-tab.component.scss'],
  imports: [
    NgIf,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FormsModule,
    MatSuffix,
    MatCheckbox,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
  ],
})
export class ElementTabComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog,
  ) {}

  @Input() pcSubject!: Subject<Character>;
  @Input() char!: Character;
  @Input() propertyName!: keyof Character;
  @Input() elementRoute!: string;

  async ngOnInit() {
    this.elementTableCols.push('source');

    if (this.elementRoute == this.requestService.routes.roundReminder) {
      this.elementTableCols.push('reminder', 'reminding');

      this.elementTable.filterPredicate = function (
        data,
        filter: string,
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
        case this.requestService.routes.ability:
          this.elementTableCols.push('uses');
          break;
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
        filter: string,
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
    this.addNestedElements();

    this.elements.sort(function (
      a: { viewPosition: number },
      b: { viewPosition: number },
    ) {
      return a.viewPosition - b.viewPosition;
    });

    if (this.elementRoute == this.requestService.routes.ability) {
      /* this.char.abilities.forEach((x) => {
        this.abilityUsesDebouncers.set(x.id, new Debouncer<string>());

        this.abilityUsesDebouncers
          .get(x.id)!
          .OutputSubject.subscribe((y) => this.updateAbilityUses(x.id, +y));
      }); */
    }

    if (this.elementRoute == this.requestService.routes.counter) {
      /* this.char.counters.forEach((x) => {
        this.counterValueDebouncers.set(x.id, new Debouncer<string>());

        this.counterValueDebouncers
          .get(x.id)!
          .OutputSubject.subscribe((y) => this.updateCounter(x.id, +y));
      }); */
    }

    if (this.elementRoute == this.requestService.routes.item) {
      /* this.char.items.forEach((x) => {
        this.itemAmountDebouncers.set(x.id, new Debouncer<string>());

        this.itemAmountDebouncers
          .get(x.id)!
          .OutputSubject.subscribe((y) => this.updateItemAmount(x.id, +y));
      }); */
    }

    if (this.elementRoute == this.requestService.routes.variable) {
      /* this.char.variables.forEach((x) => {
        this.variableValueDebouncers.set(x.id, new Debouncer<string>());

        this.variableValueDebouncers
          .get(x.id)!
          .OutputSubject.subscribe((y) => this.updateVariable(x.id, +y));
      }); */
    }

    this.elementTable = new MatTableDataSource(this.elements);
  }

  addNestedElements() {
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
      this.char.traits.forEach((trait) => {
        if (trait.abilities.length > 0) {
          trait.abilities.forEach((ability: any) => {
            ability.source = 'Trait "' + trait.name + '"';
            this.elements.push(ability);
          });
        }
      });

      this.char.items.forEach((item) => {
        if (item.abilities.length > 0) {
          item.abilities.forEach((ability: any) => {
            ability.source = 'Item "' + item.name + '"';
            this.elements.push(ability);
          });
        }
      });

      this.char.effects.forEach((effect) => {
        if (effect.abilities.length > 0) {
          effect.abilities.forEach((ability: any) => {
            ability.source = 'Effect "' + effect.name + '"';
            this.elements.push(ability);
          });
        }
      });
    }
  }

  elements: any;
  elementTable = new MatTableDataSource<any>();
  elementTableCols: string[] = [];

  abilityUsesDebouncers = new Map<number, Debouncer<string>>();
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
      },
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
            template.id,
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
      .open(ConfirmationDialog, {
        data: { message: 'Are you sure you want to delete this element?' },
      })
      .afterClosed()
      .subscribe(async (x) => {
        if (x) {
          (await this.requestService.delete(this.elementRoute, id)).subscribe();
        }
      });
  }

  async updateAbilityUses(id: number, uses: number) {
    (
      await this.requestService.patch(
        this.requestService.routes.ability,
        id,
        JSON.stringify({
          uses: uses,
        }),
      )
    ).subscribe();
  }

  async updateCounter(id: number, value: number) {
    (
      await this.requestService.patch(
        this.requestService.routes.counter,
        id,
        JSON.stringify({
          value: value,
        }),
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
        }),
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
        }),
      )
    ).subscribe();
  }

  async updateCheckbox(
    id: number,
    propertyName: string,
    event: MatCheckboxChange,
  ) {
    (
      await this.requestService.patch(
        this.elementRoute,
        id,
        JSON.stringify({
          [propertyName]: event.checked,
        }),
      )
    ).subscribe();
  }
}
