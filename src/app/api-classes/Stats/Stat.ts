import { StatValue } from "./StatValue";

export interface Stat {
  id: number;
  name: string;

  statValues: StatValue[];
}