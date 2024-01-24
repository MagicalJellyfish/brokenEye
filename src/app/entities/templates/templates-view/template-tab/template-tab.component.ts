import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ObjectService } from 'src/app/services/entities/object/object.service';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { TemplateEditComponent } from '../../template-edit/template-edit.component';
import { TemplateViewComponent } from '../../template-view/template-view.component';

@Component({
  selector: 'app-template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss']
})
export class TemplateTabComponent implements OnInit {

  constructor(private requestService: RequestService, private objectService: ObjectService,
    private matDialog: MatDialog) { }

  @Input() elementRoute!: string

  async ngOnInit() {
    (await this.requestService.getAll(this.elementRoute)).subscribe((x: any) => {
      this.elements = x
      this.elementTable = new MatTableDataSource(this.elements)
    })

    if(this.elementRoute == this.requestService.routes.roundReminderTemplate) {
      this.elementTableCols.push('reminder', 'reminding')

      this.elementTable.filterPredicate = function(data, filter: string): boolean {
        return data.reminder.toLowerCase().includes(filter);
      };
    }
    else {
      this.elementTableCols.push('name', 'description')

      if(this.elementRoute == this.requestService.routes.counterTemplate) {
        this.elementTableCols.push('count')
      }

      this.elementTable.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
      };
    }

    this.elementTableCols.push('actions')
  }

  elements: any[] = []
  elementTable = new MatTableDataSource<any>()
  elementTableCols: string[] = ['id']

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  async createElement() {
    let newElement: any =  this.objectService.newAny(this.elementRoute);

    (await this.requestService.create(this.elementRoute, newElement)).subscribe((x: any) => {
      this.matDialog.open(TemplateEditComponent, { maxWidth: '90vw', data: { id: x.id, route: this.elementRoute }})
      this.elements.push(x)
      this.elementTable = new MatTableDataSource(this.elements)
    })
  }

  viewElement(id: number) {
    this.matDialog.open(TemplateViewComponent, { maxWidth: '90vw', data: { id: id, route: this.elementRoute }}).afterClosed().subscribe(async _ => {
      (await this.requestService.getAll(this.elementRoute)).subscribe((x: any) => {
        this.elements = x
        this.elementTable = new MatTableDataSource(this.elements)
      })
    })
  }
}