import { Bodypart } from './Bodypart';
import { Character } from './Character';

export interface BodypartCondition {
  id: number;

  bodypartId: number;
  bodypart: Bodypart;

  character: Character;

  injuryLevel: InjuryLevel;
}

export enum InjuryLevel {
  None,
  Minor,
  Medium,
  Major,
  Dismember,
}
