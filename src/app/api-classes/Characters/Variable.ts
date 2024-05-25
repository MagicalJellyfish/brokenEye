import { Character } from './Character';

export interface Variable {
  id: number;
  name: string;
  value: number;

  characterId?: number;
  character?: Character;

  viewPosition: number;
}
