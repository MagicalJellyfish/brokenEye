import { ElementType } from './types/ElementType';

export interface ElementList {
  title: string;
  subTabs: boolean;
  type: ElementType;
  elementColumns: ElementColumn[];
  elements: any[];
}

interface ElementColumn {
  title: string;
  fieldId: number;
  property: string;
  propertyOf: string | null;
  columnType: ElementColumnType;
}

export enum ElementColumnType {
  Text,
  Input,
  InputOf,
  Checkbox,
}
