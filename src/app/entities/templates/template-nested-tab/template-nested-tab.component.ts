import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CharacterTemplate } from 'src/app/api-classes/Characters/CharacterTemplate';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { TemplateViewComponent } from '../template-view/template-view.component';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-template-nested-tab',
  templateUrl: './template-nested-tab.component.html',
  styleUrls: ['./template-nested-tab.component.scss'],
})
export class TemplateNestedTabComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private objectService: ObjectService,
    private matDialog: MatDialog
  ) {}

  @Input() charTemplate!: CharacterTemplate;
  @Input() elementRoute!: string;
  @Input() changeSubject!: Subject<void>;

  async ngOnInit() {
    this.changeSubject.subscribe((_) => {
      this.update();
    });

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

      if (this.elementRoute != this.requestService.routes.abilityTemplate) {
        let routeList = [
          this.requestService.routes.traitTemplate,
          this.requestService.routes.itemTemplate,
          this.requestService.routes.effectTemplate,
        ];
        if (routeList.includes(this.elementRoute)) {
          this.elementTableCols.push('abstract');
        } else {
          this.elementTableCols.push('description');
        }
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
    this.elements = [];
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

    this.elementTable = new MatTableDataSource(this.elements);
  }

  elements: any;
  elementTable = new MatTableDataSource<any>();
  elementTableCols: string[] = ['source'];

  boxProperty: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  viewElement(id: number) {
    this.matDialog.open(TemplateViewComponent, {
      maxWidth: '90vw',
      data: { id: id, route: this.elementRoute },
    });
  }
}
