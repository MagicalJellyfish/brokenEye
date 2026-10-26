import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { SimpleCharacter } from 'src/app/models/character/SimpleCharacter';
import { CharacterViewApiService } from 'src/app/ui/views/character/character-view.api-service';

@Component({
  templateUrl: './transfer.dialog.html',
  styleUrls: ['./transfer.dialog.scss'],
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
  ],
})
export class TransferDialog {
  constructor(private characterApiService: CharacterViewApiService) {
    characterApiService
      .getCharacterListByFilter({ isNPC: false })
      .subscribe((x) => (this.players = x));
    characterApiService
      .getCharacterListByFilter({ isNPC: true })
      .subscribe((x) => (this.npcs = x));
  }

  data: { name: string; amount: number; unit: string } =
    inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<TransferDialog>);

  players: SimpleCharacter[] = [];
  npcs: SimpleCharacter[] = [];

  search = '';
  characterId: number | null = null;
  amount = this.data.amount;

  get amountValid() {
    return (
      Number.isInteger(this.amount) &&
      this.amount >= 1 &&
      this.amount <= this.data.amount
    );
  }

  filter(characters: SimpleCharacter[]) {
    let search = this.search.toLowerCase();
    return characters.filter((x) => x.name.toLowerCase().includes(search));
  }

  selectCharacter(character: SimpleCharacter) {
    this.search = character.name;
    this.characterId = character.id;
  }

  give() {
    this.dialogRef.close({ characterId: this.characterId, amount: this.amount });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
