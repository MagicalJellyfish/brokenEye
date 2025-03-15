import { Injectable } from '@angular/core';
import { ElementType } from '../models/elements/types/ElementType';

@Injectable({
  providedIn: 'root',
})
export class ElementTypeService {
  getTemplateTypeFromElement(type: ElementType) {
    switch (type) {
      case ElementType.Ability:
        return ElementType.AbilityTemplate;
      case ElementType.Trait:
        return ElementType.TraitTemplate;
      case ElementType.Item:
        return ElementType.ItemTemplate;
      case ElementType.Effect:
        return ElementType.EffectTemplate;
      case ElementType.Counter:
        return ElementType.CounterTemplate;
      case ElementType.EffectCounter:
        return ElementType.EffectCounterTemplate;
      case ElementType.Reminder:
        return ElementType.ReminderTemplate;
      default:
        throw new Error(
          'Mapping from Element ' +
            type.toString() +
            ' to Template is not configured.',
        );
    }
  }
}
