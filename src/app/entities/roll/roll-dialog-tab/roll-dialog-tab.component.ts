import { Component, Input } from '@angular/core';
import { ParentData } from '../../ParentData';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Roll } from 'src/app/api-classes/Abilities/Roll';
import { MatTableDataSource } from '@angular/material/table';
import { RollsEditComponent } from '../rolls-edit/rolls-edit.component';

@Component({
  selector: 'app-roll-dialog-tab',
  templateUrl: './roll-dialog-tab.component.html',
  styleUrls: ['./roll-dialog-tab.component.scss'],
})
export class RollDialogTabComponent {
  constructor(
    private requestService: RequestService,
    private matDialog: MatDialog,
  ) {}

  @Input() parentData!: ParentData;
  @Input() template!: boolean;
  @Input() rolls!: Roll[];

  @Input() parent: any;
  @Input() elementName!: string;
  @Input() elementSubject!: Subject<any>;

  ngOnInit() {
    this.elementSubject.subscribe((x) => {
      this.rolls = x[this.elementName];
      this.rollTable = new MatTableDataSource(this.rolls);
    });

    this.rolls = this.parent[this.elementName];
    this.rollTable = new MatTableDataSource(this.rolls);
  }

  rollTable: MatTableDataSource<Roll> = new MatTableDataSource();
  rollTableCols: string[] = ['name', 'instruction'];

  openRollEdit() {
    this.matDialog
      .open(RollsEditComponent, { data: { rolls: this.rolls } })
      .afterClosed()
      .subscribe(async (rolls: Roll[]) => {
        for (let i = rolls.length - 1; i > -1; i--) {
          if (!this.template) {
            rolls[i].abilityId = this.parentData.parentId;
          } else {
            rolls[i].abilityTemplateId = this.parentData.parentId;
          }

          if (rolls[i].id == 0) {
            (
              await this.requestService.create(
                this.requestService.routes.rolls,
                rolls[i],
              )
            ).subscribe((x: any) => {
              rolls[i] = x;
            });
          } else {
            this.rolls.forEach(async (x) => {
              if (
                x.id == rolls[i].id &&
                (x.instruction != rolls[i].instruction ||
                  x.name != rolls[i].name)
              ) {
                (
                  await this.requestService.patch(
                    this.requestService.routes.rolls,
                    rolls[i].id,
                    JSON.stringify({
                      name: rolls[i].name,
                      instruction: rolls[i].instruction,
                    }),
                  )
                ).subscribe();
              }
            });
          }
        }

        this.rolls.forEach(async (origRoll) => {
          if (!rolls.some((newRoll) => newRoll.id == origRoll.id)) {
            (
              await this.requestService.delete(
                this.requestService.routes.rolls,
                origRoll.id,
              )
            ).subscribe();
          }
        });

        this.rolls = rolls;
        this.rollTable = new MatTableDataSource(this.rolls);
      });
  }
}
