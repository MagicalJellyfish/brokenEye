import { ItemTemplate } from '../Items/ItemTemplate';
import { TraitTemplate } from '../Traits/TraitTemplate';
import { EffectTemplate } from '../Effects/EffectTemplate';
import { CounterTemplate } from '../Counters/CounterTemplate';
import { RoundReminderTemplate } from '../RoundReminders/RoundReminderTemplate';
import { AbilityTemplate } from '../Abilities/Abilities/AbilityTemplate';

export interface CharacterTemplate {
  id: number;
  name: string;
  description: string;
  height?: number;
  weight?: number;
  money: number;
  age?: number;
  notes: string;
  experience: string;

  abilityTemplatesIds: number[];
  abilityTemplates: AbilityTemplate[];

  itemTemplatesIds: number[];
  itemTemplates: ItemTemplate[];

  traitTemplatesIds: number[];
  traitTemplates: TraitTemplate[];

  effectTemplatesIds: number[];
  effectTemplates: EffectTemplate[];

  counterTemplatesIds: number[];
  counterTemplates: CounterTemplate[];

  roundReminderTemplatesIds: number[];
  roundReminderTemplates: RoundReminderTemplate[];

  image: number[];
  isNPC: boolean;
}
