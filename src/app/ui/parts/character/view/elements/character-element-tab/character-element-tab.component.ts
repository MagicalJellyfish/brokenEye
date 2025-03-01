import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ElementList } from 'src/app/models/elements/ElementList';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ElementDialog } from 'src/app/ui/views/elements/dialogs/element-dialog/element.dialog';
import { ReorderDialog } from 'src/app/ui/views/elements/dialogs/reorder-dialog/reorder.dialog';
import { ElementListComponent } from '../../../../element/element-list/element-list.component';
import { CharacterApiService } from '../../../character.api-service';

@Component({
  selector: 'character-element-tab',
  templateUrl: './character-element-tab.component.html',
  styleUrls: ['./character-element-tab.component.scss'],
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
export class CharacterElementTabComponent {
  constructor(
    private dialog: MatDialog,
    private apiService: CharacterApiService,
  ) {}

  characterId = input.required<number>();
  elementList = input.required<ElementList>();
  type = input.required<ElementType>();

  openReorderDialog() {
    let elements: { id: number; name: string }[];
    if (this.type() == ElementType.Reminder) {
      elements = this.elementList().elements.map((x) => {
        return { id: x.id, name: x.reminder };
      });
    } else {
      elements = this.elementList().elements.map((x) => {
        return { id: x.id, name: x.name };
      });
    }

    this.dialog.open(ReorderDialog, {
      data: {
        type: this.type(),
        elements: elements,
      },
    });
  }

  createElement() {
    this.apiService
      .createElement(this.type(), this.characterId())
      .subscribe((x) =>
        this.dialog.open(ElementDialog, { data: { type: this.type(), id: x } }),
      );
  }
}
