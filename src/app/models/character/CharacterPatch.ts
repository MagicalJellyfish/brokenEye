export interface CharacterPatch {
  targetProperty: Property;
  value: any;
}

export enum Property {
  Name,
  Experience,
  Notes,
  Description,
  Hp,
  TempHp,
  Age,
  Height,
  Weight,
  IsNPC,
  DefaultShortcut,
  Money,
  C,
}
