import { Character } from '../../Characters/Character';
import { EffectTemplate } from '../../Effects/EffectTemplate';
import { Modifier } from '../../Modifier';
import { Roll } from '../Roll';
import { TargetType } from './TargetType';

export interface Ability {
  id: number;
  name: string;
  description: string;

  shortcut: string;
  targetType: TargetType;

  canInjure: boolean;
  self?: string;
  target?: string;
  damage?: string;

  range?: string;

  rollsIds: number[];
  rolls: Roll[];

  appliedEffectTemplatesIds: number[];
  appliedEffectTemplates: EffectTemplate[];

  modifierId?: number;
  modifier?: Modifier;

  characterId?: number;
  character?: Character;

  viewPosition: number;
}
