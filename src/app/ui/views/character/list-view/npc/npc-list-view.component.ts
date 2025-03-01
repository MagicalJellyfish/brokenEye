import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Debouncer } from 'src/app/logic/core/debouncer/debouncer';
import { SimpleCharacter } from 'src/app/models/character/SimpleCharacter';
import { CharacterListComponent } from '../../../../parts/character/list/character-list.component';
import { CharacterViewApiService } from '../../character-view.api-service';

@Component({
  templateUrl: './npc-list-view.component.html',
  styleUrls: ['./npc-list-view.component.scss'],
  imports: [
    MatCardModule,
    CharacterListComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class NpcListViewComponent {
  constructor(private apiService: CharacterViewApiService) {
    apiService
      .getCharacterListByFilter({ isNPC: true })
      .subscribe((x) => (this.characters = x));
  }

  protected characters: SimpleCharacter[] | undefined;

  nameDebouncer = new Debouncer<string>(this.searchCharacters, 750);

  protected searchCharacters(name: string) {
    this.apiService
      .getCharacterListByFilter({ isNPC: true, name: name })
      .subscribe((x) => (this.characters = x));
  }
}
