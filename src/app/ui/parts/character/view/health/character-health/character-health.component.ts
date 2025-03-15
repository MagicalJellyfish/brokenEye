import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ValueDebouncer } from 'src/app/logic/core/debouncer/debouncer';
import { Property } from 'src/app/models/character/CharacterPatch';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { ElementDialog } from 'src/app/ui/views/elements/dialogs/element-dialog/element.dialog';
import { ElementApiService } from 'src/app/ui/views/elements/element.api-service';
import { CharacterApiService } from '../../../character.api-service';
import { CharacterInjuriesComponent } from '../character-injuries/character-injuries.component';

@Component({
  selector: 'character-health',
  templateUrl: './character-health.component.html',
  styleUrls: ['./character-health.component.scss'],
  imports: [
    MatDividerModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    CharacterInjuriesComponent,
    MatRippleModule,
  ],
})
export class CharacterHealthComponent {
  constructor(
    private dialog: MatDialog,
    private apiService: CharacterApiService,
    private elementApiService: ElementApiService,
  ) {}

  character = input.required<CharacterView>();

  hp = new ValueDebouncer<number>(
    0,
    computed(() => this.character().hp),
    (x) => this.saveHp(x),
  );
  tempHp = new ValueDebouncer<number>(
    0,
    computed(() => this.character().tempHp),
    (x) => this.saveTempHp(x),
  );

  deathCountDebouncer = new ValueDebouncer<boolean[]>(
    [],
    computed(
      () => {
        let resultList: boolean[] = [];
        let counter = this.character().deathCounter;

        for (let i = 0; i < counter.value; i++) {
          resultList.push(true);
        }

        for (let i = counter.value; i < counter.max; i++) {
          resultList.push(false);
        }

        return resultList;
      },
      {
        equal: (x, y) => {
          if (x.length != y.length) {
            return false;
          }

          for (let i = 0; i < x.length; i++) {
            if (x[i] != y[i]) {
              return false;
            }
          }
          return true;
        },
      },
    ),
    (x) => this.saveDeathCount(x),
  );

  saveDeathCount(states: boolean[]) {
    let count = states.filter((x) => x == true).length;
    let counter = this.character().deathCounter;

    this.elementApiService
      .updateElement(ElementType.Counter, counter.id, [
        { fieldId: counter.valueFieldId, value: count.toString() },
      ])
      .subscribe();
  }

  saveHp(hp: number) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.Hp, value: hp },
      ])
      .subscribe();
  }

  saveTempHp(tempHp: number) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.TempHp, value: tempHp },
      ])
      .subscribe();
  }

  updateDeathCount(index: number, value: boolean) {
    this.deathCountDebouncer.value.update((x) => {
      const newArray = [...x];
      newArray[index] = value;
      return newArray;
    });

    const deathCountLength = this.deathCountDebouncer.value().length;
    for (let i = 1; i < deathCountLength; i++) {
      if (
        this.deathCountDebouncer.value()[i] &&
        !this.deathCountDebouncer.value()[i - 1]
      ) {
        this.deathCountDebouncer.value()[i] = false;
      }
    }
  }

  openDeathCounterDialog() {
    this.dialog.open(ElementDialog, {
      data: { type: ElementType.Counter, id: this.character().deathCounter.id },
    });
  }
}
