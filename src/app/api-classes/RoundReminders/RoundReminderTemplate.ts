import { CounterTemplate } from "../Counters/CounterTemplate";
import { ModifierTemplate } from "../ModifierTemplate";

export interface RoundReminderTemplate {
  id: number;
  reminding: boolean;
  reminder: string;

  counterTemplatesIds: number[]
  counterTemplates: CounterTemplate[];
  modifierTemplatesIds: number[];
  modifierTemplates: ModifierTemplate[];
}