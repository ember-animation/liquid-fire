import Ember from 'ember';
import layout from '../templates/components/animated-container';
import Resize from '../motions/resize';
import { task } from 'ember-concurrency';
import { Promise } from '../concurrency-helpers';
import Sprite from '../sprite';

export default Ember.Component.extend({
  layout,
  classNames: ['animated-container'],

  init() {
    this._super();
    this._signals = null;
    this._signalWaiter = null;
  },

  animate: task(function * () {
    let sprite = new Sprite(this.element, this);
    this.sprite = sprite;
    this.resetSignals();
    try {
      sprite.measureInitialBounds();
      sprite.lockDimensions();
      yield this.waitForSignal('measured');
      yield Resize.create(sprite, { duration: 500 }).run();
      yield this.waitForSignal('unlock');
    } finally {
      sprite.unlock();
    }
  }).restartable(),

  resetSignals() {
    this._signals = [];
  },

  receivedSignal(name) {
    this._signals.push(name);
    let s = this._signalWaiter;
    this._signalWaiter = null;
    if (s) {
      s();
    }
  },

  waitForSignal: function * (name) {
    while (this._signals.indexOf(name) > -1) {
      if (!this._signalWaiter) {
        yield new Promise(resolve => {
          this._signalWaiter = resolve;
        });
      } else {
        yield this._signalWaiter;
      }
    }
  },

  actions: {
    lock() {
      this.get('animate').perform();
    },
    measure() {
      this.sprite.unlock();
      this.sprite.measureFinalBounds();
      this.sprite.lockDimensions();
      this.receivedSignal('measured');
    },
    unlock() {
      this.receivedSignal('unlock');
    }
  }
});
