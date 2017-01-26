import RunningTransition from "./running-transition";
import DSL from "./dsl";
import Ember from "ember";
import Action from "./action";
import Constraints from "./constraints";

var TransitionMap = Ember.Service.extend({
  init() {
    this._super(...arguments);

    this.activeCount = 0;
    this.constraints = new Constraints();
    var owner = Ember.getOwner(this);
    var config;
    if (owner.factoryFor) {
      let maybeConfig = owner.factoryFor('transitions:main');
      config = maybeConfig && maybeConfig.class;
    } else {
      config = owner._lookupFactory('transitions:main');
    }
    if (config) {
      this.map(config);
    }
    if (Ember.testing) {
      this._registerWaiter();
    }
  },

  runningTransitions() {
    return this.activeCount;
  },

  incrementRunningTransitions() {
    this.activeCount++;
  },

  decrementRunningTransitions() {
    this.activeCount--;
    Ember.run.next(() => {
      this._maybeResolveIdle();
    });
  },

  waitUntilIdle() {
    if (this._waitingPromise) {
      return this._waitingPromise;
    }
    return this._waitingPromise = new Ember.RSVP.Promise((resolve) => {
      this._resolveWaiting = resolve;
      Ember.run.next(() => {
        this._maybeResolveIdle();
      });
    });
  },

  _maybeResolveIdle() {
    if (this.activeCount === 0 && this._resolveWaiting) {
      var resolveWaiting = this._resolveWaiting;
      this._resolveWaiting = null;
      this._waitingPromise = null;
      resolveWaiting();
    }
  },

  lookup(transitionName) {
    var owner = Ember.getOwner(this);
    var handler;
    if (owner.factoryFor) {
      let maybeHandler = owner.factoryFor('transition:' + transitionName);
      handler = maybeHandler && maybeHandler.class;
    } else {
      handler = owner._lookupFactory('transition:' + transitionName);
    }
    if (!handler) {
      throw new Error("unknown transition name: " + transitionName);
    }
    return handler;
  },

  defaultAction() {
    if (!this._defaultAction) {
      this._defaultAction = new Action(this.lookup('default'));
    }
    return this._defaultAction;
  },

  constraintsFor(conditions) {
    if (conditions.rules) {
      let constraints = new Constraints();
      this.map(conditions.rules, constraints);
      return constraints;
    } else {
      return this.constraints;
    }
  },

  transitionFor(conditions) {
    var action;
    if (conditions.use && conditions.firstTime !== 'yes') {
      action = new Action(conditions.use);
      action.validateHandler(this);
    } else {
      let rule = this.constraintsFor(conditions).bestMatch(conditions);
      if (rule) {
        action = rule.use;
      } else {
        action = this.defaultAction();
      }
    }
    return new RunningTransition(this, conditions.versions, action);
  },


  map(handler, constraints) {
    if (handler){
      handler.apply(new DSL(this, constraints || this.constraints));
    }
    return this;
  },

  _registerWaiter() {
    var self = this;
    this._waiter = function() {
      return self.runningTransitions() === 0;
    };
    Ember.Test.registerWaiter(this._waiter);
  },

  willDestroy() {
    if (this._waiter) {
      Ember.Test.unregisterWaiter(this._waiter);
      this._waiter = null;
    }
  }

});


TransitionMap.reopenClass({
  map(handler) {
    var t = TransitionMap.create();
    t.map(handler);
    return t;
  }
});


export default TransitionMap;
