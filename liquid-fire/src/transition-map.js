import { Promise as EmberPromise } from 'rsvp';
import { next } from '@ember/runloop';
import { getOwner } from '@ember/application';
import Service from '@ember/service';
import RunningTransition from './running-transition';
import DSL from './dsl';
import Action from './action';
import Constraints from './constraints';

export default class TransitionMapService extends Service {
  constructor() {
    super(...arguments);

    this.activeCount = 0;
    this.constraints = new Constraints();
    const owner = getOwner(this);
    this.isTest =
      owner.resolveRegistration('config:environment').environment === 'test';
    let config;
    if (owner.factoryFor) {
      const maybeConfig = owner.factoryFor('transitions:main');
      config = maybeConfig && maybeConfig.class;
    } else {
      config = owner._lookupFactory('transitions:main');
    }
    if (config) {
      this.map(config);
    }
  }

  runningTransitions() {
    return this.activeCount;
  }

  incrementRunningTransitions() {
    this.activeCount++;
  }

  decrementRunningTransitions() {
    this.activeCount--;
    next(() => {
      this._maybeResolveIdle();
    });
  }

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
  }

  _maybeResolveIdle() {
    if (this.activeCount === 0 && this._resolveWaiting) {
      const resolveWaiting = this._resolveWaiting;
      this._resolveWaiting = null;
      this._waitingPromise = null;
      resolveWaiting();
    }
  }

  lookup(transitionName) {
    const owner = getOwner(this);
    let handler;
    if (owner.factoryFor) {
      const maybeHandler = owner.factoryFor('transition:' + transitionName);
      handler = maybeHandler && maybeHandler.class;
    } else {
      handler = owner._lookupFactory('transition:' + transitionName);
    }
    if (!handler) {
      throw new Error('unknown transition name: ' + transitionName);
    }
    return handler;
  }

  defaultAction() {
    if (!this._defaultAction) {
      this._defaultAction = new Action(this.lookup('default'));
    }
    return this._defaultAction;
  }

  constraintsFor(conditions) {
    if (conditions.rules) {
      const constraints = new Constraints();
      this.map(conditions.rules, constraints);
      return constraints;
    } else {
      return this.constraints;
    }
  }

  transitionFor(conditions) {
    let action;
    if (conditions.use && conditions.firstTime !== 'yes') {
      action = new Action(conditions.use);
      action.validateHandler(this);
    } else {
      const rule = this.constraintsFor(conditions).bestMatch(conditions);
      if (rule) {
        action = rule.use;
      } else {
        action = this.defaultAction();
      }
    }
    return new RunningTransition(this, conditions.versions, action);
  }

  map(handler, constraints) {
    if (handler) {
      handler.apply(new DSL(this, constraints || this.constraints));
    }
    return this;
  }
}
