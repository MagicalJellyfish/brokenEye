import { ElementList } from '../elements/ElementList';
import { Bodypart } from './Bodypart';
import { InjuryLevel } from './InjuryLevel';

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
  description: string;
  notes: string;

  money: number;
  c: number;

  hp: number;
  maxHp: number;
  tempHp: number;
  maxTempHp: number;

  deathCounter: DeathCounterModel;

  stats: StatModel[];

  hpImpacts: HpImpactModel[];

  injuries: InjuryModel[];

  elementLists: ElementList[];
}

interface StatModel {
  name: string;
  value: number;
}

interface DeathCounterModel {
  id: number;
  valueFieldId: string;
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
