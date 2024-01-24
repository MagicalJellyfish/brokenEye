import { RoundReminderTemplate } from "../RoundReminders/RoundReminderTemplate";
import { ModifierTemplate } from "../ModifierTemplate";

export interface CounterTemplate {
  id: number;
  name: string;
  description: string;
  max: number;
  roundBased: Boolean;

  roundReminderTemplateId?: number;
  roundReminderTemplate?: RoundReminderTemplate;
  modifierTemplatesIds: number[];
  modifierTemplates: ModifierTemplate[];
} 