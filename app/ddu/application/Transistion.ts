import { Context } from './Context';
export class Transistion {
  trigger: string;
  fromState: string;
  toState: string;
  condition: any;
  constructor(fromState, toState, trigger, condition) {
    this.fromState = fromState;
    this.toState = toState;
    this.trigger = trigger;
    this.condition = condition;
  }

  do(context: Context) {
    if (typeof this.condition !== 'function') {
      return true;
    }
    return this.condition(context);
  }

  triggeredBy() {
    return this.trigger;
  }

  getFromState() {
    return this.fromState;
  }

  getNextState() {
    return this.toState;
  }
}
