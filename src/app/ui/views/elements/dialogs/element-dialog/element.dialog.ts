import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ElementView,
  EnumType,
  Field,
  FieldType,
  RelationType,
  RollRelationItem,
  StatRelationItem,
} from 'src/app/models/elements/ElementView';
import { ReplenishType } from 'src/app/models/elements/models/ReplenishType';
import { TargetType } from 'src/app/models/elements/models/TargetType';
import { ElementUpdate } from 'src/app/models/elements/saves/ElementUpdate';
import { ElementParentType } from 'src/app/models/elements/types/ElementParentType';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ConfirmationDialog } from 'src/app/ui/core/confirmation-dialog/confirmation.dialog';
import { ElementApiService } from '../../element.api-service';
import { RollDialog } from '../roll-dialog/roll.dialog';
import { StatDialog } from '../stat-dialog/stat.dialog';

@Component({
  templateUrl: './element.dialog.html',
  styleUrls: ['./element.dialog.scss'],
  imports: [
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    NgClass,
  ],
})
export class ElementDialog {
  constructor(
    private apiService: ElementApiService,
    private dialog: MatDialog,
  ) {
    this.getElement();
  }

  data: { type: ElementType; id: number } = inject(MAT_DIALOG_DATA);
  readonly elementTypes = ElementType;
  readonly dialogRef = inject(MatDialogRef<ElementDialog>);
  readonly fieldTypes = FieldType;
  readonly relationTypes = RelationType;

  element!: ElementView;

  getElement() {
    this.apiService.getElement(this.data.type, this.data.id).subscribe((x) => {
      this.element = x as ElementView;
    });
  }

  enumOptions(type: EnumType) {
    let targetEnum = EnumTypeDefinitions.find((x) => x.type == type)!.enum;

    let enumValues: number[] = Object.keys(targetEnum)
      .filter((x) => !isNaN(Number(x)))
      .map((x) => Number(x));

    let options: { value: number; name: any }[] = [];
    enumValues.forEach((value) => {
      options.push({ value: value, name: targetEnum[value] });
    });

    return options;
  }

  relationColumns(type: RelationType) {
    let columns = ['name'];

    switch (type) {
      case RelationType.Roll:
        columns.push('roll');
        break;
      case RelationType.Stats:
        columns.push('value');
    }

    return columns;
  }

  openNestedDialog(id: number, type: ElementType) {
    this.dialog
      .open(ElementDialog, { data: { type: type, id: id } })
      .afterClosed()
      .subscribe((_) => this.getElement());
  }

  openRollEditDialog(rolls: RollRelationItem[]) {
    this.dialog
      .open(RollDialog, { data: { parentId: this.data.id, rolls: rolls } })
      .afterClosed()
      .subscribe((_) => this.getElement());
  }

  openStatEditDialog(stats: StatRelationItem[]) {
    this.dialog
      .open(StatDialog, {
        data: {
          parentId: this.data.id,
          stats: stats,
        },
      })
      .afterClosed()
      .subscribe((_) => this.getElement());
  }

  listIsElementType(type: RelationType) {
    return (
      type == RelationType.SingleElement ||
      type == RelationType.MultipleElements
    );
  }

  createNestedElement(type: ElementType) {
    let parentType: ElementParentType;
    switch (this.data.type) {
      case ElementType.Trait:
      case ElementType.Item:
      case ElementType.Effect:
        parentType = ElementParentType.Modifier;
        break;
      case ElementType.Counter:
        parentType = ElementParentType.Counter;
        break;
      default:
        throw new Error('Parent type of element could not be determined.');
    }

    this.apiService
      .createElement(type, parentType, this.data.id)
      .subscribe((x) => {
        this.openNestedDialog(x, type);
      });
  }

  deleteElement() {
    this.dialog
      .open(ConfirmationDialog, {
        data: { message: 'Are you sure you want to delete this element?' },
      })
      .afterClosed()
      .subscribe((x) => {
        if (x) {
          this.apiService
            .deleteElement(this.data.type, this.data.id)
            .subscribe((_) => this.dialogRef.close());
        }
      });
  }

  saveElement() {
    let updates: ElementUpdate[] = [];

    this.element.texts.forEach((x) => {
      updates.push({ fieldId: x.fieldId, value: x.content });
    });
    this.element.fields.forEach((x) => {
      switch (x.type) {
        case FieldType.Enum:
          updates.push({ fieldId: x.fieldId, value: x.content.value });
          break;
        case FieldType.Multi:
          x.content.fields.forEach((y: Field) => {
            updates.push({ fieldId: y.fieldId, value: y.content });
          });
          break;
        default:
          updates.push({ fieldId: x.fieldId, value: x.content });
          break;
      }
    });

    this.apiService
      .updateElement(this.data.type, this.data.id, updates)
      .subscribe((_) => this.dialogRef.close());
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

const EnumTypeDefinitions: { type: EnumType; enum: any }[] = [
  { type: EnumType.TargetType, enum: TargetType },
  { type: EnumType.ReplenishType, enum: ReplenishType },
];
