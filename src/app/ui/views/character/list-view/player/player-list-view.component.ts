import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SimpleCharacter } from 'src/app/models/character/SimpleCharacter';
import { UserService } from 'src/app/services/user/user.service';
import { CharacterListComponent } from '../../../../parts/character/list/character-list.component';
import { CharacterViewApiService } from '../../character-view.api-service';

@Component({
  templateUrl: './player-list-view.component.html',
  styleUrls: ['./player-list-view.component.scss'],
  imports: [MatCardModule, CharacterListComponent],
})
export class PlayerListViewComponent {
  constructor(
    private apiService: CharacterViewApiService,
    private userService: UserService,
  ) {
    apiService
      .getCharacterListByFilter({
        isNPC: false,
        ownedBy: userService.username!,
      })
      .subscribe((x) => (this.ownedCharacters = x));

    apiService
      .getCharacterListByFilter({
        isNPC: false,
        notOwnedBy: userService.username!,
      })
      .subscribe((x) => (this.allCharacters = x));
  }

  protected ownedCharacters: SimpleCharacter[] | undefined;
  protected allCharacters: SimpleCharacter[] | undefined;
}
