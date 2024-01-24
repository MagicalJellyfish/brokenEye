import { UserSimplified } from "../UserSimplified";
import { Character } from "./Character";

export interface PlayerCharacter extends Character {
  age: number;
  notes: string;
  experience: string;
  
  image: number[]

  ownerId?: number;
  owner?: UserSimplified;
  
  viewPosition: number;
}