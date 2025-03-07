import { ElementType } from './types/ElementType';

export interface ElementView {
  texts: Text[];
  fields: Field[];
  relations: Relation[];
}

export interface Text {
  fieldId: number;
  title: string;
  content: string;
}

export interface Field {
  fieldId: number;
  title: string;
  type: FieldType;
  content: any;
}

export enum EnumType {
  TargetType,
  ReplenishType,
}

export enum FieldType {
  String,
  Number,
  Boolean,
  Multi,
  Enum,
  Fixed,
}

export interface Relation {
  title: string;
  relationType: RelationType;
  relationItems: any;
  elementType: ElementType;
}

export interface RollRelationItem {
  id: number;
  name: string;
  roll: string;
}

export interface StatRelationItem {
  id: number;
  statId: number;
  name: string;
  value: number;
}

export enum RelationType {
  SingleElement,
  MultipleElements,
  Stats,
  Roll,
}
