'use strict';
var State = function(name) {
  this.name = name || '';
  this.activities = [];
  this.addActivies = function(activities) {
    this.activities = this.activities.concat(activities);
  };

  this.execute = function(context) {
    this.activities.forEach(function(activity) {
      activity.execute(context);
    });
  };
};

var Transistion = function(config) {
  this.state = config.state;
  this.toState = config.toState;
  this.trigger = config.trigger;
  this.condition = config.condition;

  this.move = function(context) {
    if (typeof this.condition !== 'function') {
      return true;
    }
    return this.condition(context);
  };

  this.triggeredBy = function() {
    return this.trigger;
  };

  this.fromState = function() {
    return this.state;
  };

  this.nextState = function() {
    return this.toState;
  };
};

var ActivityContext = function() {
  this.trigger = '';
  this.data = null;
  this.getTrigger = function() {
    return this.trigger;
  };

  this.setTrigger = function(trigger) {
    this.trigger = trigger;
  };

  this.setData = function(data) {
    this.data = data;
  };
};

var WorkflowConfig = function() {
  this.states = [];
  this.transitions = [];

  this.load = function(config) {
    var tmpConfig = config || [];
    var seft = this;

    tmpConfig.forEach(function(stateConfig) {
      seft.configState(stateConfig);
      seft.configTransistion(stateConfig);
    });
  };

  this.configState = function(stateConfig) {
    var state = new State(stateConfig.state, stateConfig.activities);
    state.addActivies(stateConfig.activities);
    this.states.push(state);
  };

  this.configTransistion = function(stateConfig) {
    var seft = this;
    var transitions = stateConfig.transitions || [];

    transitions.forEach(function(tr) {
      var key = seft.getKey(stateConfig.state, tr.trigger);
      seft.transitions[key] = new Transistion({
        state: stateConfig.state,
        toState: tr.toState,
        trigger: tr.trigger,
        condition: tr.condition
      });
    });
  };

  this.getTransistions = function(fromState, trigger) {
    var key = this.getKey(fromState, trigger);
    return this.transitions[key] || null;
  };

  this.getStates = function() {
    return this.states;
  };

  this.stateFactory = function(stateName) {
    return this.states.find(function(state) {
      return state.name === stateName;
    });
  };

  this.getKey = function(state, trigger) {
    return state + '_' + trigger;
  };
};

var Workflow = function() {
  this.currentState = null;
  this.workflowConfig = null;

  this.setConfig = function(config) {
    this.workflowConfig = config;
  };

  this.setCurrentState = function(state) {
    var seft = this;
    this.currentState = this.workflowConfig.states.find(function(stateModel) {
      return stateModel.name === state;
    });
  };

  this.getCurrentState = function() {
    return this.currentState;
  };

  this.run = function(context) {
    var seft = this;
    var transition = this.workflowConfig.getTransistions(
      this.currentState.name,
      context.getTrigger()
    );

    if (transition && transition.move(context)) {
      seft.setCurrentState(transition.nextState());
      var nextState = seft.workflowConfig.stateFactory(transition.nextState());
      nextState.execute(context);
      return;
    }
  };
};

var InitActivity = function() {
  this.name = 'InitActivity';
  this.execute = function(context) {
    console.log('Activity', this.name, context.data);
  };
};

var EnterActivity = function() {
  this.name = 'EnterActivity';
  this.execute = function(context) {
    console.log('Activity', this.name, context.data);
  };
};

var BackActivity = function() {
  this.name = 'BackActivity';
  this.execute = function(context) {
    console.log('Activity', this.name, context.data);
  };
};

var STATELIST = {
  INIT: 'INIT',
  ENTER: 'ENTER',
  BACK: 'BACK',
  ACCEPT: 'ACCEPT',
  CANCEL: 'CANCEL'
};

var DataConfig = [
  {
    state: 'INIT',
    activities: [new InitActivity()],
    transitions: [
      {
        toState: 'ENTER',
        trigger: 'enter',
        condition: function(context) {
          console.log('condition enter', context.data);
          return true;
        }
      }
    ]
  },
  {
    state: 'ENTER',
    activities: [new EnterActivity(), new BackActivity()],
    transitions: [
      {
        toState: 'INIT',
        trigger: 'init',
        condition: function(context) {
          console.log('condition init', context.data);
          return true;
        }
      }
    ]
  }
];

var wfConfig = new WorkflowConfig();
wfConfig.load(DataConfig);

var workflow = new Workflow();
workflow.setConfig(wfConfig);
workflow.setCurrentState(STATELIST.INIT);

var activityContext = new ActivityContext();
activityContext.setTrigger('enter');
activityContext.setData({ code: 200, message: 'Init' });
workflow.run(activityContext);

console.log('getCurrentState', workflow.getCurrentState().name);

var activityContext = new ActivityContext();
activityContext.setTrigger('init');
activityContext.setData({ code: 200, message: 'Enter' });

workflow.run(activityContext);
console.log('getCurrentState', workflow.getCurrentState().name);
