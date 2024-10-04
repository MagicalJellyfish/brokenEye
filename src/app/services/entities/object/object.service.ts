import { Injectable } from '@angular/core';
import { Counter } from 'src/app/api-classes/Counters/Counter';
import { CounterTemplate } from 'src/app/api-classes/Counters/CounterTemplate';
import { EffectCounter } from 'src/app/api-classes/Counters/EffectCounter';
import { EffectCounterTemplate } from 'src/app/api-classes/Counters/EffectCounterTemplate';
import { Effect } from 'src/app/api-classes/Effects/Effect';
import { EffectTemplate } from 'src/app/api-classes/Effects/EffectTemplate';
import { Item } from 'src/app/api-classes/Items/Item';
import { ItemTemplate } from 'src/app/api-classes/Items/ItemTemplate';
import { RoundReminder } from 'src/app/api-classes/RoundReminders/RoundReminder';
import { RoundReminderTemplate } from 'src/app/api-classes/RoundReminders/RoundReminderTemplate';
import { Trait } from 'src/app/api-classes/Traits/Trait';
import { TraitTemplate } from 'src/app/api-classes/Traits/TraitTemplate';
import { RequestService } from '../request/request.service';
import { Character } from 'src/app/api-classes/Characters/Character';
import { CharacterTemplate } from 'src/app/api-classes/Characters/CharacterTemplate';
import { Ability } from 'src/app/api-classes/Abilities/Abilities/Ability';
import { AbilityTemplate } from 'src/app/api-classes/Abilities/Abilities/AbilityTemplate';
import { TargetType } from 'src/app/api-classes/Abilities/Abilities/TargetType';
import { Variable } from 'src/app/api-classes/Characters/Variable';
import { ReplenishType } from 'src/app/api-classes/Abilities/Abilities/ReplenishType';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  constructor(private requestService: RequestService) {}

  groupKeys: string[] = [
    'roundReminder',
    'counters',
    'counter',
    'effectCounter',
    'effect',
    'statIncreases',
    'character',
    'modifier',
    'characterInjury',
    'abilities',
    'rolls',
    'roundReminderTemplate',
    'counterTemplates',
    'effectCounterTemplate',
    'effectTemplates',
    'statIncreases',
    'modifierTemplates',
    'characterTemplates',
    'abilityTemplates',
    'itemTemplates',
    'applyingAbilities',
    'applyingAbilityTemplates',
    'appliedEffectTemplates',
  ];

  newAny(route: string) {
    let routes = this.requestService.routes;
    switch (route) {
      case routes.character:
        return this.newCharacter();
      case routes.counter:
        return this.newCounter();
      case routes.counterTemplate:
        return this.newCounterTemplate();
      case routes.effectCounter:
        return this.newEffectCounter();
      case routes.effectCounterTemplate:
        return this.newEffectCounterTemplate();
      case routes.effect:
        return this.newEffect();
      case routes.effectTemplate:
        return this.newEffectTemplate();
      case routes.item:
        return this.newItem();
      case routes.itemTemplate:
        return this.newItemTemplate();
      case routes.roundReminder:
        return this.newRoundReminder();
      case routes.roundReminderTemplate:
        return this.newRoundReminderTemplate();
      case routes.trait:
        return this.newTrait();
      case routes.traitTemplate:
        return this.newTraitTemplate();
      case routes.ability:
        return this.newAbility();
      case routes.abilityTemplate:
        return this.newAbilityTemplate();
      case routes.variable:
        return this.newVariable();
    }

    return;
  }

  newCharacter() {
    let c: Character = {
      age: 0,
      notes: '',
      experience: '',
      id: 0,
      name: 'unnamed',
      description: '',
      height: 0,
      weight: 0,
      money: 0,
      maxHp: 0,
      hp: 0,
      maxTempHp: 0,
      tempHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      stats: [],
      bodypartConditions: [],
      itemsIds: [],
      items: [],
      traitsIds: [],
      traits: [],
      effectsIds: [],
      effects: [],
      injuryEffectsIds: [],
      injuryEffects: [],
      countersIds: [],
      counters: [],
      roundRemindersIds: [],
      roundReminders: [],
      isNPC: false,
      abilitiesIds: [],
      abilities: [],
      variablesIds: [],
      variables: [],
      imageId: 0,
      image: { id: 0, bytes: [] },
    };

    return c;
  }

  newAbility() {
    let ability: Ability = {
      id: 0,
      name: 'unnamed',
      description: '',
      shortcut: 'undefined',
      canInjure: false,
      rollsIds: [],
      rolls: [],
      appliedEffectTemplatesIds: [],
      appliedEffectTemplates: [],
      targetType: TargetType.None,
      viewPosition: 0,
      replenishType: ReplenishType.None,
    };

    return ability;
  }

  newEffect() {
    let effect: Effect = {
      hp: '',
      maxTempHp: 0,
      duration: '',
      id: 0,
      name: 'unnamed',
      description: '',
      abstract: '',
      maxHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      statIncreasesIds: [],
      statIncreases: [],
      countersIds: [],
      counters: [],
      viewPosition: 0,
      abilitiesIds: [],
      abilities: [],
    };

    return effect;
  }

  newItem() {
    let item: Item = {
      equipped: true,
      id: 0,
      name: 'unnamed',
      description: '',
      abstract: '',
      maxHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      amount: 1,
      unit: '',
      statIncreasesIds: [],
      statIncreases: [],
      countersIds: [],
      counters: [],
      abilitiesIds: [],
      abilities: [],
      viewPosition: 0,
    };

    return item;
  }

  newRoundReminder() {
    let reminder: RoundReminder = {
      id: 0,
      reminding: true,
      reminder: 'undefined',
      viewPosition: 0,
    };

    return reminder;
  }

  newTrait() {
    let trait: Trait = {
      active: true,
      id: 0,
      name: 'unnamed',
      description: '',
      abstract: '',
      maxHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      statIncreasesIds: [],
      statIncreases: [],
      countersIds: [],
      counters: [],
      viewPosition: 0,
      abilitiesIds: [],
      abilities: [],
    };

    return trait;
  }

  newEffectCounter() {
    let effectCounter: EffectCounter = {
      endEffect: false,
      id: 0,
      name: 'unnamed',
      description: '',
      value: 0,
      max: 0,
      roundBased: true,
      viewPosition: 0,
    };

    return effectCounter;
  }

  newCounter() {
    let counter: Counter = {
      id: 0,
      name: 'unnamed',
      description: '',
      value: 0,
      max: 0,
      roundBased: true,
      viewPosition: 0,
    };

    return counter;
  }

  newVariable() {
    let variable: Variable = {
      id: 0,
      name: 'unnamed',
      value: 0,
      viewPosition: 0,
    };

    return variable;
  }

  newCharacterTemplate() {
    let ct: CharacterTemplate = {
      id: 0,
      name: 'unnamed',
      description: '',
      money: 0,
      notes: '',
      experience: '',
      itemTemplatesIds: [],
      itemTemplates: [],
      traitTemplatesIds: [],
      traitTemplates: [],
      effectTemplatesIds: [],
      effectTemplates: [],
      counterTemplatesIds: [],
      counterTemplates: [],
      roundReminderTemplatesIds: [],
      roundReminderTemplates: [],
      image: [],
      isNPC: true,
      abilityTemplatesIds: [],
      abilityTemplates: [],
      variablesIds: [],
      variables: [],
    };

    return ct;
  }

  newAbilityTemplate() {
    let abilityTemplate: AbilityTemplate = {
      id: 0,
      name: 'unnamed',
      description: '',
      canInjure: false,
      rollsIds: [],
      rolls: [],
      characterTemplatesIds: [],
      characterTemplates: [],
      targetType: TargetType.None,
      appliedEffectTemplatesIds: [],
      appliedEffectTemplates: [],
      modifierTemplatesIds: [],
      modifierTemplates: [],
      replenishType: ReplenishType.None,
    };

    return abilityTemplate;
  }

  newRoundReminderTemplate() {
    let reminderTemplate: RoundReminderTemplate = {
      id: 0,
      reminding: true,
      reminder: 'undefined',
      counterTemplates: [],
      modifierTemplatesIds: [],
      modifierTemplates: [],
      counterTemplatesIds: [],
      characterTemplatesIds: [],
      characterTemplates: [],
    };

    return reminderTemplate;
  }

  newCounterTemplate() {
    let counterTemplate: CounterTemplate = {
      id: 0,
      name: 'unnamed',
      description: '',
      max: 0,
      roundBased: true,
      modifierTemplatesIds: [],
      modifierTemplates: [],
      characterTemplatesIds: [],
      characterTemplates: [],
    };

    return counterTemplate;
  }

  newTraitTemplate() {
    let traitTemplate: TraitTemplate = {
      id: 0,
      name: 'unnamed',
      description: '',
      abstract: '',
      maxHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      statIncreasesIds: [],
      statIncreases: [],
      counterTemplatesIds: [],
      counterTemplates: [],
      characterTemplatesIds: [],
      characterTemplates: [],
      abilityTemplatesIds: [],
      abilityTemplates: [],
    };

    return traitTemplate;
  }

  newItemTemplate() {
    let itemTemplate: ItemTemplate = {
      id: 0,
      name: 'unnamed',
      description: '',
      abstract: '',
      maxHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      amount: 1,
      unit: '',
      statIncreasesIds: [],
      statIncreases: [],
      counterTemplatesIds: [],
      counterTemplates: [],
      characterTemplatesIds: [],
      characterTemplates: [],
      abilityTemplatesIds: [],
      abilityTemplates: [],
    };

    return itemTemplate;
  }

  newEffectTemplate() {
    let effectTemplate: EffectTemplate = {
      id: 0,
      name: 'unnamed',
      hp: '',
      maxTempHp: 0,
      duration: '',
      description: '',
      abstract: '',
      maxHp: 0,
      movementSpeed: 0,
      armor: 0,
      evasion: 0,
      statIncreasesIds: [],
      statIncreases: [],
      counterTemplatesIds: [],
      counterTemplates: [],
      characterTemplatesIds: [],
      characterTemplates: [],
      abilityTemplatesIds: [],
      abilityTemplates: [],
      applyingAbilityTemplatesIds: [],
      applyingAbilityTemplates: [],
      applyingAbilitiesIds: [],
      applyingAbilities: [],
    };

    return effectTemplate;
  }

  newEffectCounterTemplate() {
    let effectCounterTemplate: EffectCounterTemplate = {
      id: 0,
      name: 'unnamed',
      endEffect: false,
      effectTemplatesIds: [],
      effectTemplates: [],
      description: '',
      max: 0,
      roundBased: true,
      modifierTemplatesIds: [],
      modifierTemplates: [],
      characterTemplatesIds: [],
      characterTemplates: [],
    };

    return effectCounterTemplate;
  }
}
