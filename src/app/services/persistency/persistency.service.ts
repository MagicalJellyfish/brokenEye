import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistencyService {

  constructor() { }

  dialogTab: DialogTab = DialogTab.RoundReminder
  dialogSubTab: DialogSubTab = DialogSubTab.EffectCounter
}

enum DialogTab {
  RoundReminder,
  Counter,
  Stat
}

enum DialogSubTab {
  Counter,
  EffectCounter
}
