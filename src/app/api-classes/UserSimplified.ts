import { Character } from "./Characters/Character";

export interface UserSimplified {
  id: number;
  username: string;
  discordId: number;

  characters: Character[];
}