import { EffectCounterTemplate } from "../Counters/EffectCounterTemplate";
import { ModifierTemplate } from "../ModifierTemplate";

export interface EffectTemplate extends ModifierTemplate {
  hp: string;
  maxTempHp: number;
  duration: string;

  effectCounterTemplateId?: number;
  effectCounterTemplate?: EffectCounterTemplate;
}