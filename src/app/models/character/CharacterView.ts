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

  experience: string;

  hp: number;
  maxHp: number;
  tempHp: number;
  maxTempHp: number;

  deathCounter: DeathCounterModel;

  stats: StatModel[];
}

interface StatModel {
  name: string;
  value: number;
}
