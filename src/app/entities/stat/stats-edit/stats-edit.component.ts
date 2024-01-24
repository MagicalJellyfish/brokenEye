import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { RequestService } from 'src/app/services/entities/request/request.service';

@Component({
  selector: 'app-stats-edit',
  templateUrl: './stats-edit.component.html',
  styleUrls: ['./stats-edit.component.scss']
})
export class StatsEditComponent {

  constructor(private requestService: RequestService,
    private dialogRef: MatDialogRef<StatsEditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { statValues: StatValue[] }) 
    { }

  async ngOnInit() {
    (await this.requestService.getAll(this.requestService.routes.constant + "/Stats")).subscribe((stats: any) => {
      for(let i = 0; i < stats.length; i++) {
        let statValue: StatValue = {
          id: 0,
          value: 0,
          statId: stats[i].id,
          stat: stats[i],
        }

        this.data.statValues.forEach(statIncrease => {
          if(stats[i].id == statIncrease.stat?.id) {
            statValue.id = statIncrease.id
            statValue.value = statIncrease.value
          }
        });

        this.statValues.push(statValue)
      }
      this.statValueTable = new MatTableDataSource(this.statValues)
    })
  }

  statValues: StatValue[] = []
  statValueTableCols: string[] = ['name', 'value']
  statValueTable = new MatTableDataSource<StatValue>()

  async save() {
    this.dialogRef.close(this.statValues)
  }
}
