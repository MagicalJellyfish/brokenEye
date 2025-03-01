import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ValueDebouncer } from 'src/app/logic/core/debouncer/debouncer';
import { Property } from 'src/app/models/character/CharacterPatch';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { SignalrService } from 'src/app/services/signalr/signalr.service';
import { CharacterApiService } from '../../character.api-service';

@Component({
  selector: 'character-stats',
  templateUrl: './character-stats.component.html',
  styleUrls: ['./character-stats.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class CharacterStatsComponent {
  constructor(
    private signalrService: SignalrService,
    private apiService: CharacterApiService,
  ) {}

  character = input.required<CharacterView>();

  experience = new ValueDebouncer<string>(
    '',
    computed(() => this.character().experience),
    (x) => this.saveExperience(x),
  );

  protected saveExperience(experience: string) {
    this.apiService
      .patchCharacter(this.character().id, [
        { targetProperty: Property.Experience, value: experience },
      ])
      .subscribe();
  }

  rollStat(statId: number) {
    this.signalrService.RollStat(this.character().id, statId);
  }
}
