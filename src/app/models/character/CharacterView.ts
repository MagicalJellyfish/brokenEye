import { ElementList } from '../elements/ElementList';

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

  money: number;
  c: number;

  hp: number;
  maxHp: number;
  tempHp: number;
  maxTempHp: number;

  stats: StatModel[];

  elementLists: ElementList[];
}

interface StatModel {
  name: string;
  value: number;
}

interface DeathCounterModel {
  id: number;
  value: number;
  max: number;
}

interface HpImpactModel {
  name: string;
  value: string;
}

export interface InjuryModel {
  bodypart: Bodypart;
  injuryLevel: InjuryLevel;
}
