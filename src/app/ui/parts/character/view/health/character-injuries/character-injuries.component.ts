import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ValueDebouncer } from 'src/app/logic/core/debouncer/debouncer';
import { Bodypart } from 'src/app/models/character/Bodypart';
import {
  CharacterView,
  InjuryModel,
} from 'src/app/models/character/CharacterView';
import { InjuryLevel } from 'src/app/models/character/InjuryLevel';
import { CharacterApiService } from '../../../character.api-service';

@Component({
  selector: 'character-injuries',
  templateUrl: './character-injuries.component.html',
  styleUrls: ['./character-injuries.component.scss'],
  imports: [MatCardModule, MatButtonModule, NgClass],
})
export class CharacterInjuriesComponent {
  constructor(private apiService: CharacterApiService) {}

  character = input.required<CharacterView>();

  injuries = new ValueDebouncer<InjuryModel[]>(
    [],
    computed(() => this.character().injuries, {
      equal: (x, y) => {
        if (x.length != y.length) {
          return false;
        }

        for (let i = 0; i < x.length; i++) {
          if (
            x[i].bodypart != y[i].bodypart ||
            x[i].injuryLevel != y[i].injuryLevel
          ) {
            return false;
          }
        }
        return true;
      },
    }),
    (x) => this.saveInjuries(x),
  );

  readonly Bodyparts = Bodypart;

  raiseInjury(bodypart: Bodypart) {
    const injuries = [...this.injuries.value()];
    const injury = injuries.find((x) => x.bodypart == bodypart)!;

    if (injury.injuryLevel == InjuryLevel.Dismember) {
      injury.injuryLevel = InjuryLevel.None;
    } else {
      injury.injuryLevel += 1;
    }

    this.injuries.value.set(injuries);
  }

  lowerInjury(event: Event, bodypart: Bodypart) {
    event.preventDefault();

    const injuries = [...this.injuries.value()];
    const injury = injuries.find((x) => x.bodypart == bodypart)!;

    if (injury.injuryLevel == InjuryLevel.None) {
      injury.injuryLevel = InjuryLevel.Dismember;
    } else {
      injury.injuryLevel -= 1;
    }

    this.injuries.value.set(injuries);
  }

  getInjuryColor(bodypart: Bodypart) {
    const injury = this.injuries.value().find((x) => x.bodypart == bodypart)!;

    switch (injury.injuryLevel) {
      case InjuryLevel.None:
        return 'healthy';
      case InjuryLevel.Minor:
        return 'minorInjury';
      case InjuryLevel.Medium:
        return 'mediumInjury';
      case InjuryLevel.Major:
        return 'majorInjury';
      case InjuryLevel.Dismember:
        return 'dismembered';
    }
  }

  saveInjuries(injuries: InjuryModel[]) {
    this.apiService.saveInjuries(this.character().id, injuries).subscribe();
  }
}
