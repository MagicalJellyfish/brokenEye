import { EffectTemplate } from "../Effects/EffectTemplate";
import { CounterTemplate } from "./CounterTemplate";

export interface EffectCounterTemplate extends CounterTemplate {
  endEffect: Boolean;

  effectTemplatesIds: number[];
  effectTemplates: EffectTemplate[];
}