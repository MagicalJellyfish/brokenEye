import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterModel } from 'src/app/models/character/CharacterModel';
import { CharacterSearch } from 'src/app/models/character/CharacterSearch';
import { SimpleCharacter } from 'src/app/models/character/SimpleCharacter';

@Injectable({
  providedIn: 'root',
})
export class CharacterViewApiService {
  constructor(private http: HttpClient) {}

  getCharacterListByFilter(search: CharacterSearch) {
    return this.http.request<SimpleCharacter[]>(
      'QUERY',
      'brokenHeart:/characterlist/simple',
      { body: search }
    );
  }

  getCharacterById(id: number) {
    return this.http.get<CharacterModel>('brokenHeart:/character/' + id);
  }
}
