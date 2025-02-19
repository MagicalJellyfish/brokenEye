import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SimpleCharacter } from 'src/app/models/character/SimpleCharacter';
import { ApiUrlService } from 'src/app/services/api/apiUrl/api-url.service';
import { CharacterApiService } from '../character.api-service';

@Component({
  selector: 'character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  imports: [MatGridList, MatGridTile, MatButton, MatIcon, NgOptimizedImage],
})
export class CharacterListComponent {
  constructor(
    protected apiUrlService: ApiUrlService,
    private router: Router,
    private apiService: CharacterApiService,
  ) {}

  characters = input.required<SimpleCharacter[]>();
  showCreateButton = input<boolean>(false);

  protected failedImages: number[] = [];

  select(id: number) {
    this.router.navigate(['/character/' + id]);
  }

  create() {
    this.apiService.createCharacter().subscribe((x) => {
      this.router.navigate(['/character/' + x]);
    });
  }
}
