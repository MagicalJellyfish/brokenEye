import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StatValue } from 'src/app/api-classes/Stats/StatValue';
import { ParentData } from '../../ParentData';
import { MatDialog } from '@angular/material/dialog';
import { StatsEditComponent } from '../stats-edit/stats-edit.component';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stat-dialog-tab',
  templateUrl: './stat-dialog-tab.component.html',
  styleUrls: ['./stat-dialog-tab.component.scss']
})
export class StatDialogTabComponent {

  constructor(private requestService: RequestService, private matDialog: MatDialog) { }

  @Input() parentData!: ParentData
  @Input() template!: boolean
  @Input() statValues!: StatValue[]

  @Input() parent: any
  @Input() elementName!: string
  @Input() elementSubject!: Subject<any>

  ngOnInit() {
    this.elementSubject.subscribe(x => {
      this.statValues = x[this.elementName]
      this.statValueTable = new MatTableDataSource(this.statValues)
    })

    this.statValues = this.parent[this.elementName]
    this.statValueTable = new MatTableDataSource(this.statValues)

    this.statValues.sort(function(a, b){
      return a.statId! - b.statId!;
    });
  }

  statValueTable: MatTableDataSource<StatValue> = new MatTableDataSource()
  statValueTableCols: string[] = ["name", "value"]

  openStatEdit() {
    this.matDialog.open(StatsEditComponent, { data: { statValues: this.statValues } })
      .afterClosed().subscribe(async (statValues: StatValue[]) => { 

        for(let i = statValues.length-1; i > -1; i--) {

          if(!this.template) {
            statValues[i].modifierId = this.parentData.parentId
          }
          else {
            statValues[i].modifierTemplateId = this.parentData.parentId
          }

          if(statValues[i].id == 0 && statValues[i].value != 0) {
            let requestStatValue = structuredClone(statValues[i])
            requestStatValue.stat = undefined;
            (await this.requestService.create(this.requestService.routes.statValue, requestStatValue)).subscribe((x: any) => {
              statValues[statValues.findIndex(y => { return y.statId == x.statId })] = x
            });
          }
    
          if(statValues[i].id != 0 && (statValues[i].value == 0 || statValues[i].value.toString() == "")) {
            (await this.requestService.delete(this.requestService.routes.statValue, statValues[i].id)).subscribe()
            statValues.splice(i, 1)
            continue
          }
          else if(statValues[i].id != 0 && statValues[i].value != this.statValues.find(x => x.statId == statValues[i].statId)?.value) {
            (await this.requestService.patch(this.requestService.routes.statValue, statValues[i].id, JSON.stringify({
              "value": statValues[i].value
            }))).subscribe()
          }
    
          if(statValues[i].id == 0 && statValues[i].value == 0) {
            statValues.splice(i, 1)
          }
        }

        this.statValues = statValues
        this.statValueTable = new MatTableDataSource(this.statValues)
    });
  }
}
