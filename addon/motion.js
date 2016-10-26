import $ from 'jquery';
import { task } from 'ember-concurrency';
import Ember from 'ember';
import rAF from './raf-promise';

export default Ember.Object.extend({
  init() {
    this._super(...arguments);

    // Public properties
    // this.element = element;
    // this.initial = initial; // { width, height, x, y }
    // this.final = final;     // { width, height, x, y }
    // this.opts = opts;

    this._setupMotionList();
  },

  // --- Begin Hooks you should Implement ---

  // In the measure hook, you can read from the DOM but should not
  // modify it. This allows all concurrent Motions to read before
  // writing without thrasing. Note that you don't need to do anything
  // here to measure your own element's position -- you already have
  // initial and final geometry on `this`.
  measure() {},

  // If any other motions exist for this element, the first hook
  // called will be `interrupt`. Here you can inspect the other
  // running motions if you want and save any state on `this` in order
  // to influence your own animation, and you can call `cancel` on the
  // other animations, or you can call `cancel` on on yourself, in
  // case you discover the running motions are just fine.
  //
  // May return a Promise if you want to block. Your starting hook
  // will not run until it resolves.
  interrupting: task(function * (motions) {
    // Default implementation stops all other motions on this elemnt.
    motions.forEach(m => m.cancel());
    yield null;
  }),

  // Start your animation here. It should be a cancelable task if you
  // want to be able to interrupt it.
  starting: task(function * () {
    yield null;
  }),


  // --- Begin public methods you may call ---

  cancel() {
    this.get('_run').cancelAll();
  },

  run() {
    return this.get('_run').perform();
  },

  // --- Begin private methods ---

  _setupMotionList() {
    let $elt = $(this.element);
    let motionList = $elt.data('lfMotions');
    if (!motionList) {
      $elt.data('lfMotions', motionList = []);
    }
    motionList.unshift(this);
    this._motionList = motionList;
  },

  _run: task(function * (){
    this.measure();
    yield rAF();
    try {
      let others = this._motionList.filter(m => m !== this);
      if (others.length > 0) {
        yield this.get('interrupting').perform(others);
      }
      yield this.get('starting').perform();
    } finally {
      let index = this._motionList.indexOf(this);
      this._motionList.splice(index, 1);
      if (this._motionList.length === 0) {
        $(this.element).data('lfMotions', null);
      }
    }
  })
});
