import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RollModel } from 'src/app/models/elements/models/RollModel';
import { StatValueModel } from 'src/app/models/elements/models/StatValueModel';
import { ElementReorder } from 'src/app/models/elements/saves/ElementReorder';
import { ElementUpdate } from 'src/app/models/elements/saves/ElementUpdate';
import { ElementParentType } from 'src/app/models/elements/types/ElementParentType';
import { ElementType } from 'src/app/models/elements/types/ElementType';

@Injectable({
  providedIn: 'root',
})
export class ElementApiService {
  constructor(private http: HttpClient) {}

  getElement(type: ElementType, id: number) {
    return this.http.get<unknown>('brokenHeart:/element/' + type + '/' + id);
  }

  getStats() {
    return this.http.get<unknown>('brokenHeart:/stat');
  }

  updateElement(type: ElementType, id: number, updates: ElementUpdate[]) {
    updates.forEach((update) => {
      update.value = update.value.toString();
    });
    return this.http.put('brokenHeart:/element/' + type + '/' + id, updates);
  }

  deleteElement(type: ElementType, id: number) {
    return this.http.delete('brokenHeart:/element/' + type + '/' + id);
  }

  createElement(
    type: ElementType,
    parentType: ElementParentType,
    parentId: number,
  ) {
    return this.http.post<number>('brokenHeart:/element/' + type, {
      parentType: parentType,
      parentId: parentId,
    });
  }

  reorderElements(type: ElementType, reorders: ElementReorder[]) {
    return this.http.put('brokenHeart:/element/reorder/' + type, reorders);
  }

  saveStats(id: number, stats: StatValueModel[]) {
    return this.http.put('brokenHeart:/modifier/stats/' + id, stats);
  }

  saveRolls(id: number, stats: RollModel[]) {
    return this.http.put('brokenHeart:/ability/rolls/' + id, stats);
  }
}
