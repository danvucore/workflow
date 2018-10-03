import { WorkflowConfig } from './WorkflowConfig';
import { STATE_LIST, State } from './State';
import { Context } from './Context';

export class Workflow {
  currentState: State = null;
  workflowConfig: WorkflowConfig = null;

  setConfig(config) {
    this.workflowConfig = config;
  }

  setCurrentState(state) {
    this.currentState = this.workflowConfig.getState(state);
  }

  getCurrentState() {
    return this.currentState;
  }

  run(context: Context) {
    const transition = this.workflowConfig.getTransition(
      this.currentState.name,
      context.getTrigger()
    );
    if (transition && transition.do(context)) {
      this.setCurrentState(transition.getFromState());
      const nextState = this.workflowConfig.stateFactory(
        transition.getNextState()
      );
      nextState.execute(context);
      return;
    }
  }
}
