import { Counter } from "../Counters/Counter";
import { Effect } from "../Effects/Effect";
import { Item } from "../Items/Item";
import { Trait } from "../Traits/Trait";
import { BodypartCondition } from "./BodypartCondition";
import { RoundReminder } from "../RoundReminders/RoundReminder";
import { StatValue } from "../Stats/StatValue";
import { UserSimplified } from "../UserSimplified";

export interface Character {
  id: number;
  name: string;
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

  itemsIds: number[];
  items: Item[];

  traitsIds: number[];
  traits: Trait[];

  effectsIds: number[];
  effects: Effect[];

  countersIds: number[];
  counters: Counter[];

  roundRemindersIds: number[];
  roundReminders: RoundReminder[];

  age: number;
  notes: string;
  experience: string;
  
  image: number[]

  isPlayerCharacter: boolean;
  ownerId?: number;
  owner?: UserSimplified;
}