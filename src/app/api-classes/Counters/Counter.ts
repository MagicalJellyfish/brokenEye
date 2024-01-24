import { Character } from "../Characters/Character";
import { RoundReminder } from "../RoundReminders/RoundReminder";
import { Modifier } from "../Modifier";

export interface Counter {
  id: number;
  name: string;
  description: string;
  value: number;
  max: number;
  roundBased: Boolean;

  roundReminder?: RoundReminder;
  
  viewPosition: number;

  characterId?: number;
  character?: Character;
  modifierId?: number;
  modifier?: Modifier;
}