export interface CharacterView {
  id: number;
  name: string;

  isNPC: boolean;
  defaultShortcut: string;

  age: number;
  height: number;
  weight: number;

  movementSpeed: number;
  evasion: number;
  armor: number;
  defense: number;
}
