import { PlayerCharacter } from "./Characters/PlayerCharacter";

export interface UserSimplified {
  id: number;
  username: string;

  characters: PlayerCharacter[];
}