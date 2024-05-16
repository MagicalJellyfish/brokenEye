import { RoundReminderTemplate } from '../RoundReminders/RoundReminderTemplate';
import { ModifierTemplate } from '../ModifierTemplate';
import { CharacterTemplate } from '../Characters/CharacterTemplate';

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
  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}
