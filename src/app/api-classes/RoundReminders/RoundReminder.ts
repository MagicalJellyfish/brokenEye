import { Character } from "../Characters/Character";
import { Counter } from "../Counters/Counter";
import { Modifier } from "../Modifier";

export interface RoundReminder {
  id: number;
  reminding: boolean;
  reminder: string;
  
  viewPosition: number;

  characterId?: number;
  character?: Character;
  counterId?: number;
  counter?: Counter;
  modifierId?: number;
  modifier?: Modifier;
}