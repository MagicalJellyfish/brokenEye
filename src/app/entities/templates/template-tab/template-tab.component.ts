import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CharacterTemplate } from 'src/app/api-classes/Characters/CharacterTemplate';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { TemplateEditComponent } from '../template-edit/template-edit.component';
import { TemplateViewComponent } from '../template-view/template-view.component';
import { TemplateSelectComponent } from '../template-select/template-select.component';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss'],
})
export class TemplateTabComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog
  ) {}

  @Input() charTemplate!: CharacterTemplate;
  @Input() propertyName!: keyof CharacterTemplate;
  @Input() elementRoute!: string;
  @Input() changeSubject!: Subject<void>;

  async ngOnInit() {
    this.elementTableCols.push('source');

    if (this.elementRoute == this.requestService.routes.roundReminderTemplate) {
      this.elementTableCols.push('reminder');

      this.elementTable.filterPredicate = function (
        data,
        filter: string
      ): boolean {
        return data.reminder.toLowerCase().includes(filter);
      };
    } else {
      this.elementTableCols.push('name');

      let routeList = [
        this.requestService.routes.traitTemplate,
        this.requestService.routes.itemTemplate,
        this.requestService.routes.effectTemplate,
      ];
      if (routeList.includes(this.elementRoute)) {
        this.elementTableCols.push('abstract');
      } else if (this.elementRoute != this.requestService.routes.variable) {
        this.elementTableCols.push('description');
      }

      switch (this.elementRoute) {
        case this.requestService.routes.itemTemplate:
          this.elementTableCols.push('amount');
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
  }

  update() {
    this.elements = this.charTemplate[this.propertyName];
    this.addNestedElements();
    this.elementTable = new MatTableDataSource(this.elements);
    this.changeSubject.next();
  }

  addNestedElements() {
    if (this.elementRoute == this.requestService.routes.counterTemplate) {
      this.charTemplate.traitTemplates.forEach((traitTemplate) => {
        if (traitTemplate.counterTemplates.length > 0) {
          traitTemplate.counterTemplates.forEach((counter: any) => {
            counter.source = 'Trait "' + traitTemplate.name + '"';
            this.elements.push(counter);
          });
        }
      });

      this.charTemplate.itemTemplates.forEach((itemTemplate) => {
        if (itemTemplate.counterTemplates.length > 0) {
          itemTemplate.counterTemplates.forEach((counter: any) => {
            counter.source = 'Item "' + itemTemplate.name + '"';
            this.elements.push(counter);
          });
        }
      });

      this.charTemplate.effectTemplates.forEach((effectTemplate) => {
        if (effectTemplate.counterTemplates.length > 0) {
          effectTemplate.counterTemplates.forEach((counter: any) => {
            counter.source = 'Effect "' + effectTemplate.name + '"';
            this.elements.push(counter);
          });
        }
        if (effectTemplate.effectCounterTemplate != undefined) {
          let effectCounterTemplate: any = effectTemplate.effectCounterTemplate;
          effectCounterTemplate.source =
            'Effect-Counter of Effect  "' + effectTemplate.name + '"';
          this.elements.push(effectCounterTemplate);
        }
      });
    } else if (
      this.elementRoute == this.requestService.routes.roundReminderTemplate
    ) {
      this.charTemplate.traitTemplates.forEach((traitTemplate) => {
        if (traitTemplate.roundReminderTemplate != undefined) {
          let roundReminder: any = traitTemplate.roundReminderTemplate;
          roundReminder.source = 'Trait "' + traitTemplate.name + '"';
          this.elements.push(roundReminder);
        }

        if (traitTemplate.counterTemplates.length > 0) {
          traitTemplate.counterTemplates.forEach((counterTemplate) => {
            if (counterTemplate.roundReminderTemplate != undefined) {
              let roundReminderTemplate: any =
                counterTemplate.roundReminderTemplate;
              roundReminderTemplate.source =
                'Counter "' +
                counterTemplate.name +
                '" on Trait "' +
                traitTemplate.name +
                '"';
              this.elements.push(roundReminderTemplate);
            }
          });
        }
      });

      this.charTemplate.itemTemplates.forEach((itemTemplate) => {
        if (itemTemplate.roundReminderTemplate != undefined) {
          let roundReminderTemplate: any = itemTemplate.roundReminderTemplate;
          roundReminderTemplate.source = 'Item "' + itemTemplate.name + '"';
          this.elements.push(roundReminderTemplate);
        }

        if (itemTemplate.counterTemplates.length > 0) {
          itemTemplate.counterTemplates.forEach((counterTemplate) => {
            if (counterTemplate.roundReminderTemplate != undefined) {
              let roundReminderTemplate: any =
                counterTemplate.roundReminderTemplate;
              roundReminderTemplate.source =
                'Counter "' +
                counterTemplate.name +
                '" on Item "' +
                itemTemplate.name +
                '"';
              this.elements.push(roundReminderTemplate);
            }
          });
        }
      });

      this.charTemplate.effectTemplates.forEach((effectTemplate) => {
        if (effectTemplate.roundReminderTemplate != undefined) {
          let roundReminderTemplate: any = effectTemplate.roundReminderTemplate;
          roundReminderTemplate.source = 'Effect "' + effectTemplate.name + '"';
          this.elements.push(roundReminderTemplate);
        }

        if (effectTemplate.counterTemplates.length > 0) {
          effectTemplate.counterTemplates.forEach((counterTemplate) => {
            if (counterTemplate.roundReminderTemplate != undefined) {
              let roundReminderTemplate: any =
                counterTemplate.roundReminderTemplate;
              roundReminderTemplate.source =
                'Counter "' +
                counterTemplate.name +
                '" on Effect "' +
                effectTemplate.name +
                '"';
              this.elements.push(roundReminderTemplate);
            }
          });
        }
      });

      if (this.charTemplate.counterTemplates.length > 0) {
        this.charTemplate.counterTemplates.forEach((counterTemplate) => {
          if (counterTemplate.roundReminderTemplate != undefined) {
            let roundReminderTemplate: any =
              counterTemplate.roundReminderTemplate;
            roundReminderTemplate.source =
              'Counter "' + counterTemplate.name + '"';
            this.elements.push(roundReminderTemplate);
          }
        });
      }
    } else if (
      this.elementRoute == this.requestService.routes.abilityTemplate
    ) {
      this.charTemplate.traitTemplates.forEach((traitTemplate) => {
        if (traitTemplate.abilityTemplates.length > 0) {
          traitTemplate.abilityTemplates.forEach((abilityTemplate: any) => {
            abilityTemplate.source = 'Trait "' + traitTemplate.name + '"';
            this.elements.push(abilityTemplate);
          });
        }
      });

      this.charTemplate.itemTemplates.forEach((itemTemplate) => {
        if (itemTemplate.abilityTemplates.length > 0) {
          itemTemplate.abilityTemplates.forEach((abilityTemplate: any) => {
            abilityTemplate.source = 'Item "' + itemTemplate.name + '"';
            this.elements.push(abilityTemplate);
          });
        }
      });

      this.charTemplate.effectTemplates.forEach((effectTemplate) => {
        if (effectTemplate.abilityTemplates.length > 0) {
          effectTemplate.abilityTemplates.forEach((abilityTemplate: any) => {
            abilityTemplate.source = 'Effect "' + effectTemplate.name + '"';
            this.elements.push(abilityTemplate);
          });
        }
      });
    }
  }

  elements: any;
  elementTable = new MatTableDataSource<any>();
  elementTableCols: string[] = [];

  boxProperty: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  async createElement() {
    let newElement: any = this.objectService.newAny(this.elementRoute);
    if (this.elementRoute != this.requestService.routes.variable) {
      newElement.characterTemplatesIds = [this.charTemplate.id];
    } else {
      newElement.characterTemplateId = this.charTemplate.id;
    }

    (await this.requestService.create(this.elementRoute, newElement)).subscribe(
      (x: any) => {
        this.matDialog
          .open(TemplateEditComponent, {
            maxWidth: '90vw',
            data: { id: x.id, route: this.elementRoute },
          })
          .afterClosed()
          .subscribe(async (_) => {
            (await this.requestService.get(this.elementRoute, x.id)).subscribe(
              (edited) => {
                this.elements.push(edited);
                this.update();
              }
            );
          });
      }
    );
  }

  addTemplate() {
    this.matDialog
      .open(TemplateSelectComponent, { data: { route: this.elementRoute } })
      .afterClosed()
      .subscribe(async (template) => {
        (
          await this.requestService.fullPatch(this.elementRoute, template.id, [
            {
              op: 'add',
              path: '/characterTemplatesIds/-',
              value: this.charTemplate.id,
            },
          ])
        ).subscribe((x) => {
          this.elements.push(x);
          this.update();
        });
      });
  }

  viewElement(id: number) {
    this.matDialog
      .open(TemplateViewComponent, {
        maxWidth: '90vw',
        data: { id: id, route: this.elementRoute },
      })
      .afterClosed()
      .subscribe(async (deleted) => {
        if (deleted) {
          this.elements = this.elements.filter(
            (x: { id: number }) => x.id != id
          );
          this.update();
        } else {
          (await this.requestService.get(this.elementRoute, id)).subscribe(
            (edited) => {
              for (let i = 0; i < this.elements.length; i++) {
                if (this.elements[i].id == id) {
                  this.elements[i] = edited;
                }
              }
              this.update();
            }
          );
        }
      });
  }

  async removeElement(id: number) {
    if (this.elementRoute != this.requestService.routes.variable) {
      (
        await this.requestService.fullPatch(this.elementRoute, id, [
          {
            op: 'remove',
            path: '/characterTemplatesIds/' + this.charTemplate.id,
          },
        ])
      ).subscribe((_) => {
        this.elements = this.elements.filter((x: { id: number }) => x.id != id);
        this.update();
      });
    } else {
      this.matDialog
        .open(ConfirmationDialogComponent, {
          data: { message: 'Are you sure you want to delete this element?' },
        })
        .afterClosed()
        .subscribe(async (x) => {
          if (x) {
            (await this.requestService.delete(this.elementRoute, id)).subscribe(
              (_) => {
                this.elements = this.elements.filter(
                  (x: { id: number }) => x.id != id
                );
                this.update();
              }
            );
          }
        });
    }
  }
}
