import { Effect } from '../Effects/Effect';
import { Counter } from './Counter';

export interface EffectCounter extends Counter {
  endEffect: Boolean;

  effectId?: number;
  effect?: Effect;
}
