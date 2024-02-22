import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiSettingsService } from '../../api/apiSettings/api-settings.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private apiSettings: ApiSettingsService) { }

  routes = {
    constant: "Constants",
    character: "Characters",
    characterTemplate: "CharacterTemplates",
    counter: "Counters",
    counterTemplate: "CounterTemplates",
    effectCounter: "EffectCounters",
    effectCounterTemplate: "EffectCounterTemplates",
    effect: "Effects",
    effectTemplate: "EffectTemplates",
    item: "Items",
    itemTemplate: "ItemTemplates",
    roundReminder: "RoundReminders",
    roundReminderTemplate: "RoundReminderTemplates",
    statValue: "StatValues",
    rolls: "Rolls",
    trait: "Traits",
    traitTemplate: "TraitTemplates",
    ability: "Abilities",
    abilityTemplate: "AbilityTemplates"
  }

  elementToTemplateRoute(elementRoute: string) {
    if(elementRoute == this.routes.ability) {
      return this.routes.abilityTemplate
    }
    return elementRoute.slice(0, -1) + "Templates"
  }

  apiUrl: string = 'https://localhost:7029/api/'

  async getAll(route: string) {
    return this.http.get(this.apiUrl + route, await this.apiSettings.getHttpHeaders(false, true));
  }

  async get(route: string, id: any) {
    return this.http.get(this.apiUrl + route + "/" + id, await this.apiSettings.getHttpHeaders(false, true));
  }

  async create(route: string, object: object) {
    return this.http.post(this.apiUrl + route, object, await this.apiSettings.getHttpHeaders(false, true));
  }

  async delete(route: string, id: number) {
    return this.http.delete(this.apiUrl + route + "/" + id, await this.apiSettings.getHttpHeaders(false, true));
  }

  async patch(route: string, id: number, patchJson: string) {
    var patchObject = JSON.parse(patchJson)
    var patch = []

    for(let i = 0; i < Object.keys(patchObject).length; i++) {
      patch.push({
        "op": "replace",
        "path": "/" + Object.keys(patchObject)[i],
        "value": Object.values(patchObject)[i]
      })
    }

    return this.http.patch(this.apiUrl + route + "/" + id, patch, await this.apiSettings.getHttpHeaders(true, true));
  }

  async fullPatch(route: string, id: any, patch: object | null) {
    return this.http.patch(this.apiUrl + route + "/" + id, patch, await this.apiSettings.getHttpHeaders(true, true));
  }
}
