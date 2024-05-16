import { Character } from '../Characters/Character';
import { Modifier } from '../Modifier';

export interface Trait extends Modifier {
  active: Boolean;

  characterId?: number;
  character?: Character;
}
