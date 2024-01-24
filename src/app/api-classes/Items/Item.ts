import { Character } from "../Characters/Character";
import { Modifier } from "../Modifier";

export interface Item extends Modifier {
  equipped: Boolean;

  characterId?: number;
  character?: Character;
}