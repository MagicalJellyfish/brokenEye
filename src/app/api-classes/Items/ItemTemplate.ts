import { CharacterTemplate } from "../Characters/CharacterTemplate";
import { ModifierTemplate } from "../ModifierTemplate";

export interface ItemTemplate extends ModifierTemplate {
  amount: number;
  unit: string;
  
  characterTemplatesIds: number[];
  characterTemplates: CharacterTemplate[];
}