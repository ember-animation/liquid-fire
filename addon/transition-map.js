/* eslint-disable ember/no-legacy-test-waiters */
import { registerWaiter, unregisterWaiter } from '@ember/test';
import { Promise as EmberPromise } from 'rsvp';
import { next } from '@ember/runloop';
import { getOwner } from '@ember/application';
import Service from '@ember/service';
import { DEBUG } from '@glimmer/env';
import RunningTransition from './running-transition';
import DSL from './dsl';
import Action from './action';
import Constraints from './constraints';

let TransitionMap = Service.extend({
  init() {
    this._super(...arguments);

    this.activeCount = 0;
    this.constraints = new Constraints();
    let owner = getOwner(this);
    this.isTest =
      owner.resolveRegistration('config:environment').environment === 'test';
    let config;
    if (owner.factoryFor) {
      let maybeConfig = owner.factoryFor('transitions:main');
      config = maybeConfig && maybeConfig.class;
    } else {
      config = owner._lookupFactory('transitions:main');
    }
    if (config) {
      this.map(config);
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
    next(() => {
      this._maybeResolveIdle();
    });
  },

  waitUntilIdle() {
    if (this._waitingPromise) {
      return this._waitingPromise;
    }
    return (this._waitingPromise = new EmberPromise((resolve) => {
      this._resolveWaiting = resolve;
      next(() => {
        this._maybeResolveIdle();
      });
    }));
  },

  _maybeResolveIdle() {
    if (this.activeCount === 0 && this._resolveWaiting) {
      let resolveWaiting = this._resolveWaiting;
      this._resolveWaiting = null;
      this._waitingPromise = null;
      resolveWaiting();
    }
  },

  lookup(transitionName) {
    let owner = getOwner(this);
    let handler;
    if (owner.factoryFor) {
      let maybeHandler = owner.factoryFor('transition:' + transitionName);
      handler = maybeHandler && maybeHandler.class;
    } else {
      handler = owner._lookupFactory('transition:' + transitionName);
    }
    if (!handler) {
      throw new Error('unknown transition name: ' + transitionName);
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
    let action;
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
    if (handler) {
      handler.apply(new DSL(this, constraints || this.constraints));
    }
    return this;
  },
});

if (DEBUG) {
  TransitionMap.reopen({
    init() {
      this._super(...arguments);

      if (this.isTest) {
        this._waiter = () => {
          return this.runningTransitions() === 0;
        };
        registerWaiter(this._waiter);
      }
    },

    willDestroy() {
      if (this._waiter) {
        unregisterWaiter(this._waiter);
        this._waiter = null;
      }

      this._super(...arguments);
    },
  });
}

TransitionMap.reopenClass({
  map(handler) {
    let t = TransitionMap.create();
    t.map(handler);
    return t;
  },
});

export default TransitionMap;
