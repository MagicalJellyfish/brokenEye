import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterPatch } from 'src/app/models/character/CharacterPatch';
import { InjuryModel } from 'src/app/models/character/CharacterView';
import { RestType } from 'src/app/models/character/RestType';
import { ElementParentType } from 'src/app/models/elements/types/ElementParentType';
import { ElementType } from 'src/app/models/elements/types/ElementType';

@Injectable({
  providedIn: 'root',
})
export class CharacterApiService {
  constructor(private http: HttpClient) {}

  uploadImage(id: number, image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);

    return this.http.put('brokenHeart:/image/character/' + id, formData);
  }

  removeImage(id: number) {
    return this.http.delete('brokenHeart:/image/character/' + id);
  }

  createCharacter() {
    return this.http.post<number>('brokenHeart:/character', null);
  }

  rest(id: number, restType: RestType) {
    return this.http.post(
      'brokenHeart:/character/' + id + '/rest/' + restType,
      null,
    );
  }

  patchCharacter(id: number, patches: CharacterPatch[]) {
    patches.forEach((patch) => {
      patch.value = patch.value.toString();
    });
    return this.http.patch('brokenHeart:/character/' + id, patches);
  }

  deleteCharacter(id: number) {
    return this.http.delete('brokenHeart:/character/' + id);
  }

  saveInjuries(id: number, injuries: InjuryModel[]) {
    return this.http.put(
      'brokenHeart:/character/' + id + '/injuries',
      injuries,
    );
  }

  createElement(type: ElementType, parentId: number) {
    return this.http.post<number>('brokenHeart:/element/' + type, {
      parentType: ElementParentType.Character,
      parentId: parentId,
    });
  }
}
