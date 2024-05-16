import { CharacterTemplate } from '../Characters/CharacterTemplate';
import { ModifierTemplate } from '../ModifierTemplate';

export interface TraitTemplate extends ModifierTemplate {
  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}
