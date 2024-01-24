import { BodypartCondition } from "./BodypartCondition";

export interface Bodypart {
  id: number;
  name: string;

  bodypartConditions: BodypartCondition[];
}