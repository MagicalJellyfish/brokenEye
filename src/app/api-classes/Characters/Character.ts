import { Counter } from '../Counters/Counter';
import { Effect } from '../Effects/Effect';
import { Item } from '../Items/Item';
import { Trait } from '../Traits/Trait';
import { BodypartCondition } from './BodypartCondition';
import { RoundReminder } from '../RoundReminders/RoundReminder';
import { StatValue } from '../Stats/StatValue';
import { UserSimplified } from '../UserSimplified';
import { Ability } from '../Abilities/Abilities/Ability';

export interface Character {
  id: number;
  name: string;
  defaultShortcut?: string;
  description: string;
  height: number;
  weight: number;
  money: number;
  maxHp: number;
  hp: number;
  maxTempHp: number;
  tempHp: number;
  movementSpeed: number;
  armor: number;
  evasion: number;

  stats: StatValue[];
  bodypartConditions: BodypartCondition[];

  abilitiesIds: number[];
  abilities: Ability[];

  itemsIds: number[];
  items: Item[];

  traitsIds: number[];
  traits: Trait[];

  effectsIds: number[];
  effects: Effect[];

  injuryEffectsIds: number[];
  injuryEffects: Effect[];

  countersIds: number[];
  counters: Counter[];

  roundRemindersIds: number[];
  roundReminders: RoundReminder[];

  age: number;
  notes: string;
  experience: string;

  image: number[];

  isNPC: boolean;
  ownerId?: number;
  owner?: UserSimplified;
}
