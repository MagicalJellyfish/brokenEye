import { CharacterTemplate } from "../Characters/CharacterTemplate";
import { ModifierTemplate } from "../ModifierTemplate";

export interface ItemTemplate extends ModifierTemplate {
  
  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}