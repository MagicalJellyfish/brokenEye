import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/services/entities/request/request.service';
import { TemplateViewComponent } from '../template-view/template-view.component';

@Component({
  selector: 'app-template-select',
  templateUrl: './template-select.component.html',
  styleUrls: ['./template-select.component.scss'],
})
export class TemplateSelectComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<TemplateSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: string },
  ) {}

  async ngOnInit() {
    (await this.requestService.getAll(this.data.route)).subscribe((x: any) => {
      this.elements = x;
      this.elementTable = new MatTableDataSource(this.elements);
    });

    if (this.data.route != this.requestService.routes.roundReminderTemplate) {
      this.elementTableCols = ['id', 'name', 'description', 'actions'];

      this.elementTable.filterPredicate = function (
        data,
        filter: string,
      ): boolean {
        return data.name.toLowerCase().includes(filter);
      };
    } else {
      this.elementTableCols = ['id', 'reminder', 'reminding', 'actions'];

      this.elementTable.filterPredicate = function (
        data,
        filter: string,
      ): boolean {
        return data.reminder.toLowerCase().includes(filter);
      };
    }
  }

  selectedId: number | undefined;

  elements: any[] = [];
  elementTable = new MatTableDataSource<any>();
  elementTableCols: string[] = ['id'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.elementTable.filter = filterValue.trim().toLowerCase();
  }

  async submitId() {
    this.dialogRef.close(this.elements.find((x) => x.id == this.selectedId));
  }

  viewTemplate(id: number) {
    this.matDialog
      .open(TemplateViewComponent, {
        maxWidth: '90vw',
        data: { id: id, route: this.data.route },
      })
      .afterClosed()
      .subscribe(async (_) => {
        (await this.requestService.getAll(this.data.route)).subscribe(
          (x: any) => {
            this.elements = x;
            this.elementTable = new MatTableDataSource(this.elements);
          },
        );
      });
  }
}
