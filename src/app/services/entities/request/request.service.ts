import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from '../../api/apiUrl/api-url.service';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
    this.apiUrl = apiUrlService.url() + '/api/';
  }

  routes = {
    constant: 'Constants',
    character: 'Characters',
    characterTemplate: 'CharacterTemplates',
    counter: 'Counters',
    counterTemplate: 'CounterTemplates',
    effectCounter: 'EffectCounters',
    effectCounterTemplate: 'EffectCounterTemplates',
    effect: 'Effects',
    effectTemplate: 'EffectTemplates',
    item: 'Items',
    itemTemplate: 'ItemTemplates',
    roundReminder: 'RoundReminders',
    roundReminderTemplate: 'RoundReminderTemplates',
    statValue: 'StatValues',
    rolls: 'Rolls',
    trait: 'Traits',
    traitTemplate: 'TraitTemplates',
    ability: 'Abilities',
    abilityTemplate: 'AbilityTemplates',
    variable: 'Variables',
    characterImage: 'CharacterImages',
  };

  elementToTemplateRoute(elementRoute: string) {
    if (elementRoute == this.routes.ability) {
      return this.routes.abilityTemplate;
    }
    return elementRoute.slice(0, -1) + 'Templates';
  }

  apiUrl: string;

  getAll(route: string) {
    return this.http.get(this.apiUrl + route, this.contentTypeHeader());
  }

  get(route: string, id: any) {
    return this.http.get(
      this.apiUrl + route + '/' + id,
      this.contentTypeHeader()
    );
  }

  create(route: string, object?: object) {
    return this.http.post(
      this.apiUrl + route,
      object,
      this.contentTypeHeader()
    );
  }

  delete(route: string, id: number) {
    return this.http.delete(
      this.apiUrl + route + '/' + id,
      this.contentTypeHeader()
    );
  }

  patch(route: string, id: number, patchJson: string) {
    var patchObject = JSON.parse(patchJson);
    var patch = [];

    for (let i = 0; i < Object.keys(patchObject).length; i++) {
      patch.push({
        op: 'replace',
        path: '/' + Object.keys(patchObject)[i],
        value: Object.values(patchObject)[i],
      });
    }

    return this.http.patch(
      this.apiUrl + route + '/' + id,
      patch,
      this.contentTypeHeader(true)
    );
  }

  fullPatch(route: string, id: any, patch: object | null) {
    return this.http.patch(
      this.apiUrl + route + '/' + id,
      patch,
      this.contentTypeHeader(true)
    );
  }

  contentTypeHeader(patch: boolean = false) {
    var headers = new HttpHeaders();
    if (!patch) {
      headers = headers.append('Content-Type', 'application/json');
    } else {
      headers = headers.append('Content-Type', 'application/json-patch+json');
    }

    return { headers: headers };
  }
}
