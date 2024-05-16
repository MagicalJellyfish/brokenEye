import { Character } from '../Characters/Character';
import { Modifier } from '../Modifier';

export interface Item extends Modifier {
  equipped: Boolean;
  amount: number;
  unit: string;

  characterId?: number;
  character?: Character;
}
