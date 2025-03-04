import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { SignalrService } from 'src/app/services/signalr/signalr.service';
import { CharacterElementsComponent } from 'src/app/ui/parts/character/view/elements/character-elements/character-elements.component';
import { CharacterBasicsComponent } from '../../../parts/character/view/basics/character-basics.component';
import { CharacterHealthComponent } from '../../../parts/character/view/health/character-health/character-health.component';
import { CharacterStatsComponent } from '../../../parts/character/view/stats/character-stats.component';
import { CharacterViewApiService } from '../character-view.api-service';

@Component({
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss'],
  imports: [
    FormsModule,
    CharacterBasicsComponent,
    CharacterStatsComponent,
    CharacterElementsComponent,
    CharacterHealthComponent,
  ],
})
export class CharacterViewComponent {
  constructor(
    private route: ActivatedRoute,
    private apiService: CharacterViewApiService,
    private signalRService: SignalrService
  ) {
    this.getCharacter();

    signalRService.RegisterForCharChange(this.routeId, () => {
      this.getCharacter();
    });
  }

  routeId = +this.route.snapshot.paramMap.get('id')!;

  getCharacter() {
    this.apiService
      .getCharacterById(this.routeId)
      .subscribe((x) => (this.character = x));
  }

  character: CharacterView | undefined;
}
