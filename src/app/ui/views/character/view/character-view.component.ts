import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CharacterView } from 'src/app/models/character/CharacterView';
import { SignalrService } from 'src/app/services/signalr/signalr.service';
import { CharacterBasicsComponent } from '../../../parts/character/view/basics/character-basics.component';
import { CharacterViewApiService } from '../character-view.api-service';

@Component({
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.scss'],
  imports: [FormsModule, CharacterBasicsComponent],
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
