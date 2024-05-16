import { Counter } from './Counters/Counter';
import { RoundReminder } from './RoundReminders/RoundReminder';
import { StatValue } from './Stats/StatValue';

export interface Modifier {
  id: number;
  name: string;
  description: string;
  abstract: string;
  maxHp: number;
  movementSpeed: number;
  armor: number;
  evasion: number;

  statIncreasesIds: number[];
  statIncreases: StatValue[];

  countersIds: number[];
  counters: Counter[];

  roundReminderId?: number;
  roundReminder?: RoundReminder;

  viewPosition: number;
}
