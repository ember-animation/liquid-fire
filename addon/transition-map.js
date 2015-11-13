import RunningTransition from "./running-transition";
import DSL from "./dsl";
import Ember from "ember";
import Action from "./action";
import internalRules from "./internal-rules";
import Constraints from "./constraints";
import getOwner from 'ember-getowner-polyfill';

var TransitionMap = Ember.Service.extend({
  init: function() {
    this.activeCount = 0;
    this.constraints = new Constraints();
    this.map(internalRules);
    var owner = getOwner(this);
    var config = owner._lookupFactory('transitions:main');
    if (config) {
      this.map(config);
    }
    if (Ember.testing) {
      this._registerWaiter();
    }
  },

  runningTransitions: function() {
    return this.activeCount;
  },

  incrementRunningTransitions: function() {
    this.activeCount++;
  },

  decrementRunningTransitions: function() {
    this.activeCount--;
    Ember.run.next(() => {
      this._maybeResolveIdle();
    });
  },

  waitUntilIdle: function() {
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

  _maybeResolveIdle: function() {
    if (this.activeCount === 0 && this._resolveWaiting) {
      var resolveWaiting = this._resolveWaiting;
      this._resolveWaiting = null;
      this._waitingPromise = null;
      resolveWaiting();
    }
  },

  lookup: function(transitionName) {
    var owner = getOwner(this);
    var handler = owner._lookupFactory('transition:' + transitionName);
    if (!handler) {
      throw new Error("unknown transition name: " + transitionName);
    }
    return handler;
  },

  defaultAction: function() {
    if (!this._defaultAction) {
      this._defaultAction = new Action(this.lookup('default'));
    }
    return this._defaultAction;
  },

  transitionFor: function(conditions) {
    var action;
    if (conditions.use && conditions.firstTime !== 'yes') {
      action = new Action(conditions.use);
      action.validateHandler(this);
    } else {
      var rule = this.constraints.bestMatch(conditions);
      if (rule) {
        action = rule.use;
      } else {
        action = this.defaultAction();
      }
    }

    return new RunningTransition(this, conditions.versions, action);
  },


  map: function(handler) {
    if (handler){
      handler.apply(new DSL(this));
    }
    return this;
  },

  addRule: function(rule) {
    rule.validate(this);
    this.constraints.addRule(rule);
  },

  _registerWaiter: function() {
    var self = this;
    this._waiter = function() {
      return self.runningTransitions() === 0;
    };
    Ember.Test.registerWaiter(this._waiter);
  },

  willDestroy: function() {
    if (this._waiter) {
      Ember.Test.unregisterWaiter(this._waiter);
      this._waiter = null;
    }
  }

});


TransitionMap.reopenClass({
  map: function(handler) {
    var t = TransitionMap.create();
    t.map(handler);
    return t;
  }
});


export default TransitionMap;
