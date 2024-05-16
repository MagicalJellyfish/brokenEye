import { Character } from '../Characters/Character';
import { Modifier } from '../Modifier';
import { ModifierTemplate } from '../ModifierTemplate';
import { Stat } from './Stat';

export interface StatValue {
  id: number;
  value: number;

  statId?: number;
  stat?: Stat;

  modifierId?: number;
  modifier?: Modifier;
  modifierTemplateId?: number;
  modifierTemplate?: ModifierTemplate;
  characterId?: number;
  character?: Character;
}
