import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ElementList } from 'src/app/models/elements/ElementList';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ElementListComponent } from 'src/app/ui/parts/element/element-list/element-list.component';
import { ElementDialog } from 'src/app/ui/views/elements/dialogs/element-dialog/element.dialog';
import { ElementApiService } from 'src/app/ui/views/elements/element.api-service';

@Component({
  selector: 'template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss'],
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ElementListComponent,
  ],
})
export class TemplateTabComponent {
  constructor(
    private dialog: MatDialog,
    private apiService: ElementApiService,
  ) {}

  elementList = input.required<ElementList>();
  type = input.required<ElementType>();

  // TODO: Temporary until SignalR notification is implemented
  reload = output<void>();
  triggerReload() {
    this.reload.emit();
  }

  createElement() {
    this.apiService.createElement(this.type(), null, null).subscribe((x) =>
      this.dialog
        .open(ElementDialog, { data: { type: this.type(), id: x } })
        .afterClosed()
        .subscribe((_) => this.reload.emit()),
    );
  }
}
