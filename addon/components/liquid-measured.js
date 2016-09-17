import MutationObserver from "liquid-fire/mutation-observer";
import Ember from "ember";
import layout from "liquid-fire/templates/components/liquid-measured";

export default Ember.Component.extend({
  layout,

  init() {
    this._super(...arguments);
    this._destroyOnUnload = this._destroyOnUnload.bind(this);
  },

  didInsertElement: function() {
    var self = this;

    // This prevents margin collapse
    this.$().css({
      overflow: 'auto'
    });

    this.didMutate();

    this.observer = new MutationObserver(function(mutations) { self.didMutate(mutations); });
    this.observer.observe(this.get('element'), {
      attributes: true,
      subtree: true,
      childList: true,
      characterData: true
    });
    this.$().bind('webkitTransitionEnd', function() { self.didMutate(); });
    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    window.addEventListener('unload', this._destroyOnUnload);
  },

  willDestroyElement: function() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('unload', this._destroyOnUnload);
  },

  transitionMap: Ember.inject.service('liquid-fire-transitions'),

  didMutate: function() {
    // by incrementing the running transitions counter here we prevent
    // tests from falling through the gap between the time they
    // triggered mutation the time we may actually animate in
    // response.
    var tmap = this.get('transitionMap');
    tmap.incrementRunningTransitions();
    Ember.run.next(this, function() {
      this._didMutate();
      tmap.decrementRunningTransitions();
    });
  },

  _didMutate: function() {
    var elt = this.$();
    if (!elt || !elt[0]) { return; }
    this.set('measurements', measure(elt));
  },

  _destroyOnUnload() {
    this.willDestroyElement();
  }
});

export function measure($elt) {
  return $elt[0].getBoundingClientRect();
}
