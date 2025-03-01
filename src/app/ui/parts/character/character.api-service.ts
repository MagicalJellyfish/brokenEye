import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CharacterPatch } from 'src/app/models/character/CharacterPatch';

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

  patchCharacter(id: number, patches: CharacterPatch[]) {
    patches.forEach((patch) => {
      patch.value = patch.value.toString();
    });
    return this.http.patch('brokenHeart:/character/' + id, patches);
  }

  deleteCharacter(id: number) {
    return this.http.delete('brokenHeart:/character/' + id);
  }
}
