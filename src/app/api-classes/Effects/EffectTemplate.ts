import { Ability } from '../Abilities/Abilities/Ability';
import { AbilityTemplate } from '../Abilities/Abilities/AbilityTemplate';
import { CharacterTemplate } from '../Characters/CharacterTemplate';
import { EffectCounterTemplate } from '../Counters/EffectCounterTemplate';
import { ModifierTemplate } from '../ModifierTemplate';

export interface EffectTemplate extends ModifierTemplate {
  hp: string;
  maxTempHp: number;
  duration: string;

  effectCounterTemplateId?: number;
  effectCounterTemplate?: EffectCounterTemplate;

  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];

  applyingAbilityTemplatesIds: number[];
  applyingAbilityTemplates: AbilityTemplate[];

  applyingAbilitiesIds: number[];
  applyingAbilities: Ability[];
}
