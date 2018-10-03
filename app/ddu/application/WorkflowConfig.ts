import { State } from './State';
import { Transistion } from './Transistion';
export class WorkflowConfig {
  states: Map<string, State>;
  transistions: Map<string, Transistion>;
  constructor() {}

  loadConfig(configs) {
    configs.forEach(config => {
      this.configState(config.state);
      this.configTransition(config.state, config.transistions);
    });
  }

  configState(stateConfig) {
    const state = new State(stateConfig);
    this.states.set(stateConfig, state);
  }

  configTransition(stateConfig, transistionsConfig) {
    transistionsConfig.forEach(transistionConfig => {
      const key = this.getKey(stateConfig, transistionConfig.trigger);
      const transistion = new Transistion(
        stateConfig.state,
        transistionConfig.toState,
        transistionConfig.trigger,
        transistionConfig.condition
      );

      this.transistions.set(key, transistion);
    });
  }

  getTransition(fromState, trigger) {
    const key = this.getKey(fromState, trigger);
    return this.transistions.get(key);
  }

  getState(state) {
    return this.states.get(state);
  }

  getStates() {
    return this.states;
  }

  stateFactory(stateName) {
    return this.states.get(stateName);
  }

  getKey(stateName, trigger) {
    return stateName + '_' + trigger;
  }
}
