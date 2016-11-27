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
    yield* this.waitForSignal('measured');
    yield (this.motion || Resize).create(this.sprite, { duration: 500 }).run();
    yield* this.waitForSignal('unlock');
    this.sprite.unlock();
  }).restartable(),

  resetSignals() {
    this._signals = [];
  },

  receivedSignal(name) {
    if (!this._signals) { return; }
    this._signals.push(name);
    let s = this._signalWaiter;
    this._signalWaiter = null;
    if (s) {
      s();
    }
  },

  waitForSignal: function * (name) {
    while (this._signals.indexOf(name) < 0) {
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
      let sprite = new Sprite(this.element, this);
      this.sprite = sprite;
      this.resetSignals();
      sprite.measureInitialBounds();
      sprite.lockDimensions();
      this.get('animate').perform();
    },
    measure() {
      if (this.sprite) {
        this.sprite.unlock();
        this.sprite.measureFinalBounds();
        this.sprite.lockDimensions();
      }
      this.receivedSignal('measured');
    },
    unlock() {
      this.receivedSignal('unlock');
    }
  }
});
