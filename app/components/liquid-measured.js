import MutationObserver from "liquid-fire/mutation-observer";
import Ember from "ember";

export default Ember.Component.extend({

  didInsertElement: function() {
    var self = this;

    // This prevents margin collapse
    this.$().css({
      border: '1px solid transparent',
      margin: '-1px'
    });

    this.didMutate();

    this.observer = new MutationObserver(function(mutations) { self.didMutate(mutations); });
    this.observer.observe(this.get('element'), {
      attributes: true,
      subtree: true,
      childList: true
    });
    this.$().bind('webkitTransitionEnd', function() { self.didMutate(); });
    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    window.addEventListener('unload', function(){ self.willDestroyElement(); });
  },

  willDestroyElement: function() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  didMutate: function() {
    Ember.run.next(this, function() { this._didMutate(); });
  },

  _didMutate: function() {
    var elt = this.$();
    if (!elt || !elt[0]) { return; }

    // if jQuery sees a zero dimension, it will temporarily modify the
    // element's css to try to make its size measurable. But that's bad
    // for us here, because we'll get an infinite recursion of mutation
    // events. So we trap the zero case without hitting jQuery.

    if (elt[0].offsetWidth === 0) {
      this.set('width', 0);
    } else {
      this.set('width', elt.outerWidth());
    }
    if (elt[0].offsetHeight === 0) {
      this.set('height', 0);
    } else {
      this.set('height', elt.outerHeight());
    }
  }  

});
