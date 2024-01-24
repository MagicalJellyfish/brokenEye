import { Character } from "../Characters/Character";
import { EffectCounter } from "../Counters/EffectCounter";
import { Modifier } from "../Modifier";

export interface Effect extends Modifier {
  hp: string;
  maxTempHp: number;
  duration: string;

  effectCounterId?: number;
  effectCounter?: EffectCounter;

  characterId?: number;
  character?: Character;
}