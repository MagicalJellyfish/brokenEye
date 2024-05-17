import { Ability } from '../Abilities/Abilities/Ability';
import { Character } from '../Characters/Character';
import { Modifier } from '../Modifier';

export interface Item extends Modifier {
  equipped: Boolean;
  amount: number;
  unit: string;

  abilitiesIds: number[];
  abilities: Ability[];

  characterId?: number;
  character?: Character;
}
