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

@Component({
  selector: 'app-template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss']
})
export class TemplateTabComponent implements OnInit {

  constructor(private requestService: RequestService, private objectService: ObjectService,
    private matDialog: MatDialog) { }

  @Input() charTemplate!: CharacterTemplate
  @Input() propertyName!: keyof CharacterTemplate
  @Input() elementRoute!: string
  @Input() changeSubject!: Subject<void>

  async ngOnInit() {
    if(this.elementRoute == this.requestService.routes.roundReminder) {
      this.elementTableCols.push('reminder', 'reminding')

      this.elementTable.filterPredicate = function(data, filter: string): boolean {
        return data.reminder.toLowerCase().includes(filter);
      };
    }
    else {
      this.elementTableCols.push('name', 'description')

      this.elementTable.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter);
      };
    }
    this.elementTableCols.push('actions')

    this.update()
  }

  update() {
    this.elements = this.charTemplate[this.propertyName]
    this.elementTable = new MatTableDataSource(this.elements)
    this.changeSubject.next()
  }

  elements: any
  elementTable = new MatTableDataSource<any>()
  elementTableCols: string[] = []

  boxProperty: string = ""

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  async createElement() {
    let newElement: any =  this.objectService.newAny(this.elementRoute);
    newElement.characterTemplatesIds = [ this.charTemplate.id ];

    (await this.requestService.create(this.elementRoute, newElement)).subscribe((x: any) => {
      this.matDialog.open(TemplateEditComponent, { maxWidth: '90vw', data: { id: x.id, route: this.elementRoute }}).afterClosed().subscribe(async _ => {
        (await this.requestService.get(this.elementRoute, x.id)).subscribe(edited => {
          this.elements.push(edited)
          this.update()
        })
      })
    })
  }

  addTemplate() {
    this.matDialog.open(TemplateSelectComponent, { data: { route: this.elementRoute }}).afterClosed().subscribe(async template => {
      (await this.requestService.fullPatch(this.elementRoute, template.id, [{
        "op": "add",
        "path": "/characterTemplatesIds/-",
        "value": this.charTemplate.id
      }])).subscribe(x => {
        this.elements.push(x)
        this.update()
      })
    })
  }

  viewElement(id: number) {
    this.matDialog.open(TemplateViewComponent, { maxWidth: '90vw', data: { id: id, route: this.elementRoute }}).afterClosed().subscribe(async _ => {
      (await this.requestService.get(this.elementRoute, id)).subscribe(edited => {
        this.elements.forEach((element: any) => {
          if(element.id == id) {
            element = edited
          }
        });
        this.update()
      })
    })
  }

  async removeElement(id: number) {
    (await this.requestService.fullPatch(this.elementRoute, id, [{
      "op": "remove",
      "path": "/characterTemplatesIds/" + this.charTemplate.id,
    }])).subscribe(_ => {
      this.elements.forEach((element: any, index: any) => {
        if(element.id == id) this.elements.splice(index,1);
      });
      this.update()
    })
  }
}