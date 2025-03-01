import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValueDebouncer } from 'src/app/logic/core/debouncer/debouncer';
import { Property } from 'src/app/models/character/CharacterPatch';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { CharacterApiService } from '../../character.api-service';

@Component({
  selector: 'character-basics',
  templateUrl: './character-basics.component.html',
  styleUrls: ['./character-basics.component.scss'],
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
})
export class CharacterBasicsComponent {
  constructor(private apiService: CharacterApiService) {}

  character = input.required<CharacterView>();

  name = new ValueDebouncer<string>(
    '',
    computed(() => this.character().name),
    (x) => this.saveName(x),
  );
  shortcut = new ValueDebouncer<string>(
    '',
    computed(() => this.character().defaultShortcut),
    (x) => this.saveShortcut(x),
  );
  npc = new ValueDebouncer<boolean>(
    false,
    computed(() => this.character().isNPC),
    (x) => this.saveIsNPC(x),
  );

  saveName(name: string) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.Name, value: name },
      ])
      .subscribe();
  }
  saveShortcut(shortcut: string) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.DefaultShortcut, value: shortcut },
      ])
      .subscribe();
  }
  saveIsNPC(npc: boolean) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.IsNPC, value: npc },
      ])
      .subscribe();
  }
}
