import Ember from 'ember';
import layout from '../templates/components/animated-container';
import Resize from '../motions/resize';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  layout,
  classNames: ['animated-container'],

  animate: task(function * ($elt, initial, final) {
    let motion = new Resize({
      element: $elt[0],
      initial: { width: initial.width, height: initial.height },
      final: { width: final.width, height: final.height },
      opts: {}
    });
    yield motion.run();
  }),

  actions: {
    lock() {
      let $elt = this.$();
      let rect = $elt[0].getBoundingClientRect();
      $elt.outerWidth(rect.width);
      $elt.outerHeight(rect.height);
    },
    measure() {
      let $elt = this.$();
      let rect = $elt[0].getBoundingClientRect();
      $elt.css({width: '', height: ''});
      let final = $elt[0].getBoundingClientRect();
      $elt.outerWidth(rect.width);
      $elt.outerHeight(rect.height);
      return this.get('animate').perform($elt, rect, final);
    },
    unlock() {
      let $elt = this.$();
      $elt.css({width: '', height: ''});
    }
  }
});
