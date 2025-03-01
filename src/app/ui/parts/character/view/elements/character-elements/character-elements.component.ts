import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ValueDebouncer } from 'src/app/logic/core/debouncer/debouncer';
import { Property } from 'src/app/models/character/CharacterPatch';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { ElementType } from 'src/app/models/elements/types/ElementType';
import { CharacterApiService } from '../../../character.api-service';
import { CharacterElementTabComponent } from '../character-element-tab/character-element-tab.component';

@Component({
  selector: 'character-elements',
  templateUrl: './character-elements.component.html',
  styleUrls: ['./character-elements.component.scss'],
  imports: [
    FormsModule,
    MatCardModule,
    MatTabsModule,
    CharacterElementTabComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class CharacterElementsComponent {
  constructor(private apiService: CharacterApiService) {}

  character = input.required<CharacterView>();

  money = new ValueDebouncer<number>(
    0,
    computed(() => this.character().money),
    (x) => this.saveMoney(x),
  );
  c = new ValueDebouncer<number>(
    0,
    computed(() => this.character().c),
    (x) => this.saveC(x),
  );

  readonly ElementTypes = ElementType;

  saveMoney(money: number) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.Money, value: money },
      ])
      .subscribe();
  }

  saveC(c: number) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.C, value: c },
      ])
      .subscribe();
  }
}
