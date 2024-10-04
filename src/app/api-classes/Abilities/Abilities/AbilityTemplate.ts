import { CharacterTemplate } from '../../Characters/CharacterTemplate';
import { EffectTemplate } from '../../Effects/EffectTemplate';
import { ModifierTemplate } from '../../ModifierTemplate';
import { Roll } from '../Roll';
import { ReplenishType } from './ReplenishType';
import { TargetType } from './TargetType';

export interface AbilityTemplate {
  id: number;
  name: string;
  description: string;

  targetType: TargetType;

  canInjure: boolean;
  self?: string;
  target?: string;
  damage?: string;

  range?: string;

  maxUses?: number;
  replenishType: ReplenishType;

  rollsIds: number[];
  rolls: Roll[];

  appliedEffectTemplatesIds: number[];
  appliedEffectTemplates: EffectTemplate[];

  modifierTemplatesIds: number[];
  modifierTemplates: ModifierTemplate[];

  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}
