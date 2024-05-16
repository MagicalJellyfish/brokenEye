import { Ability } from './Abilities/Ability';
import { AbilityTemplate } from './Abilities/AbilityTemplate';

export interface Roll {
  id: number;
  name: string;
  instruction: string;

  abilityId?: number;
  ability?: Ability;

  abilityTemplateId?: number;
  abilityTemplate?: AbilityTemplate;
}
