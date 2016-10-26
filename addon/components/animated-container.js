import Ember from 'ember';
import layout from '../templates/components/animated-container';
import Resize from '../motions/resize';

export default Ember.Component.extend({
  layout,
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
      return new Resize({
        element: $elt[0],
        initial: { width: rect.width, height: rect.height },
        final: { width: final.width, height: final.height },
        opts: {}
      });
    },
    unlock() {
      let $elt = this.$();
      $elt.css({width: '', height: ''});
    }
  }
});
