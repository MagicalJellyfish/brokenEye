import {
  Component,
  WritableSignal,
  computed,
  effect,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Debouncer } from 'src/app/logic/core/debouncer/debouncer';
import {
  ElementColumnType,
  ElementList,
} from 'src/app/models/elements/ElementList';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ElementDialog } from 'src/app/ui/views/elements/dialogs/element-dialog/element.dialog';
import { ElementApiService } from 'src/app/ui/views/elements/element.api-service';

@Component({
  selector: 'element-list',
  templateUrl: './element-list.component.html',
  styleUrls: ['./element-list.component.scss'],
  imports: [
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ElementListComponent {
  constructor(
    private dialog: MatDialog,
    private apiService: ElementApiService,
  ) {
    effect(() => {
      this.elements().forEach((element) => {
        if (!this.debouncers.find((x) => x.itemId == element.id)) {
          let fields: FieldDebouncer[] = [];
          this.columns().forEach((column) => {
            fields.push({
              fieldId: column.fieldId,
              signal: linkedSignal(
                () =>
                  this.elements().find((x) => x.id == element.id)![
                    column.property
                  ],
              ),
              debouncer: new Debouncer<string>((x) =>
                this.saveInput(element.id, column.fieldId, x),
              ),
            });
          });

          this.debouncers.push({ itemId: element.id, fields: fields });
        }
      });
    });
  }

  elementList = input.required<ElementList>();
  type = input.required<ElementType>();

  selectionColumn = input<boolean>(false);
  selection = output<number>();

  // TODO: Temporary until SignalR notification is implemented
  closedDialog = output<void>();

  columns = computed(() => this.elementList().elementColumns);
  columnNames = computed(() => {
    let columnNames = this.columns().map((x) => x.property);
    if (this.selectionColumn()) {
      columnNames.push('selection');
    }

    return columnNames;
  });

  elements = computed(() => this.elementList().elements);

  readonly ColumnTypes = ElementColumnType;

  debouncers: InputDebouncer[] = [];

  getDebouncer(elementId: number, columnFieldId: string) {
    return this.debouncers
      .find((x) => x.itemId == elementId)!
      .fields.find((x) => x.fieldId == columnFieldId)!
      .signal();
  }

  setDebouncer(elementId: number, columnFieldId: string, value: string) {
    let fieldDebouncer = this.debouncers
      .find((x) => x.itemId == elementId)!
      .fields.find((x) => x.fieldId == columnFieldId)!;

    fieldDebouncer.debouncer.input(value);
    fieldDebouncer.signal.set(value);
  }

  openElementDialog(id: number) {
    this.dialog
      .open(ElementDialog, { data: { type: this.type(), id: id } })
      .afterClosed()
      .subscribe((_) => this.closedDialog.emit());
  }

  saveInput(itemId: number, fieldId: string, value: string) {
    this.apiService
      .updateElement(this.type(), itemId, [{ fieldId: fieldId, value: value }])
      .subscribe();
  }

  select(id: number) {
    this.selection.emit(id);
  }
}

interface InputDebouncer {
  itemId: number;
  fields: FieldDebouncer[];
}

interface FieldDebouncer {
  fieldId: string;
  signal: WritableSignal<string>;
  debouncer: Debouncer<string>;
}
