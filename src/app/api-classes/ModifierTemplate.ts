import { AbilityTemplate } from './Abilities/Abilities/AbilityTemplate';
import { CounterTemplate } from './Counters/CounterTemplate';
import { RoundReminderTemplate } from './RoundReminders/RoundReminderTemplate';
import { StatValue } from './Stats/StatValue';

export interface ModifierTemplate {
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

  abilityTemplatesIds: number[];
  abilityTemplates: AbilityTemplate[];

  counterTemplatesIds: number[];
  counterTemplates: CounterTemplate[];

  roundReminderTemplateId?: number;
  roundReminderTemplate?: RoundReminderTemplate;
}
