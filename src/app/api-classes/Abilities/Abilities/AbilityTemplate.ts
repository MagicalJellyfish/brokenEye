import { CharacterTemplate } from '../../Characters/CharacterTemplate';
import { EffectTemplate } from '../../Effects/EffectTemplate';
import { ItemTemplate } from '../../Items/ItemTemplate';
import { Roll } from '../Roll';
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

  rollsIds: number[];
  rolls: Roll[];

  effectTemplatesIds: number[];
  effectTemplates: EffectTemplate[];

  itemTemplatesIds: number[];
  itemTemplates: ItemTemplate[];

  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}
