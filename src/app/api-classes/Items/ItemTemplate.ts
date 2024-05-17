import { AbilityTemplate } from '../Abilities/Abilities/AbilityTemplate';
import { CharacterTemplate } from '../Characters/CharacterTemplate';
import { ModifierTemplate } from '../ModifierTemplate';

export interface ItemTemplate extends ModifierTemplate {
  amount: number;
  unit: string;

  abilityTemplatesIds: number[];
  abilityTemplates: AbilityTemplate[];

  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}
