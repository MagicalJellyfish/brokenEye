import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ElementList } from 'src/app/models/elements/ElementList';
import { ElementType } from 'src/app/models/elements/types/ElementType';

@Injectable({
  providedIn: 'root',
})
export class TemplateApiService {
  constructor(private http: HttpClient) {}

  getTemplateView() {
    return this.http.get<ElementList[]>('brokenHeart:/template/view');
  }

  getTemplateSelection(type: ElementType) {
    return this.http.get<ElementList>(
      'brokenHeart:/template/selection/' + type,
    );
  }

  relateTemplate(
    id: number,
    type: ElementType,
    parentType: ElementType,
    parentId: number,
  ) {
    return this.http.patch<number>(
      `brokenHeart:/template/${type}/${id}/relate/${parentType}/${parentId}`,
      null,
    );
  }

  unrelateTemplate(
    id: number,
    type: ElementType,
    parentType: ElementType,
    parentId: number,
  ) {
    return this.http.patch<number>(
      `brokenHeart:/template/${type}/${id}/unrelate/${parentType}/${parentId}`,
      null,
    );
  }

  instantiateTemplate(
    id: number,
    type: ElementType,
    parentType: ElementType,
    parentId: number,
  ) {
    return this.http.post<number>(
      `brokenHeart:/template/${type}/${id}/instantiate/${parentType}/${parentId}`,
      null,
    );
  }
}
