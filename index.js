'use strict';
var State = function(name, activities) {
  this.name = name || '';
  this.activities = activities || [];
  function addActivies(activities) {
    this.activities = this.activities.concat(activities);
  }
  function execute(context) {
    this.activities.forEach(function(activity) {
      activity.execute(context);
    });
  }
};

var Transistion = function(config) {
  this.fromState = config.state;
  this.toState = config.toState;
  this.trigger = config.trigger;
  this.action = config.action;

  this.move = function(context) {
    // this.move();
    typeof this.action === 'function' && this.action(context);
  };
  this.triggeredBy = function() {
    return this.trigger;
  };

  this.fromState = function() {
    return this.fromState;
  };
  this.nextState = function() {
    return this.toState;
  };
};

var ActivityContext = function() {
  this.trigger = '';
  this.getTrigger = function() {
    return this.trigger;
  };
  this.setTrigger = function(trigger) {
    this.trigger = trigger;
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

  this.configTransistion = function(stateConfig) {
    var transitions = stateConfig.transitions || [];
    this.transitions = transitions.map(function(tr) {
      return {
        fromState: stateConfig.name,
        toState: tr.to,
        trigger: tr.condition
      };
    });
  };

  this.configState = function(stateConfig) {
    var state = new State(stateConfig.name, stateConfig.activities);
    this.states.push(state);
  };

  this.getTransistion = function(fromState, trigger) {
    var transition = this.transitions.find(function(state) {
      if (state.fromState === fromState.name) {
        return state.transition;
      }
    });
  };

  this.getStates = function() {
    return this.states;
  };
};

var Workflow = function() {
  this.currentState = null;
  this.workflowConfig = null;

  this.setConfig = function(config) {
    this.workflowConfig = config;
  };

  this.run = function(context) {
    var transition = this.workflowConfig.getTransistion(
      this.currentState,
      context.getTrigger()
    );
  };

  this.setCurrentState = function(stateName) {
    var seft = this;
    this.currentState = this.workflowConfig.states.find(function(state) {
      return state.name === stateName;
    });
  };
};

var CalcActivity = function() {
  this.name = 'CalcActivity';
  this.execute = function(context) {};
};

var DataConfig = [
  {
    name: 'STATE_COMPANY',
    activities: [new CalcActivity()],
    transitions: [
      {
        to: 'STATE_DEPARTMENT',
        trigger: 'down_company_deparment',
        condition: function() {
          console.log('STATE_DEPARTMENT');
          return true;
        }
      },
      {
        to: 'STATE_TEAM',
        trigger: 'down_company_team',
        condition: function() {
          console.log('STATE_TEAM');
          return true;
        }
      },
      {
        to: 'STATE_INDIVIDUAL',
        trigger: 'down_company_individual',
        condition: function() {
          console.log('STATE_INDIVIDUAL');
          return true;
        }
      }
    ]
  }
];

var activityContext = new ActivityContext();
activityContext.setTrigger('down_company_deparment');

var wfConfig = new WorkflowConfig();
wfConfig.load(DataConfig);

var workflow = new Workflow();

workflow.setConfig(wfConfig);
workflow.setCurrentState('STATE_COMPANY');
workflow.run(activityContext);
