import Ember from "ember";
import MutationObserver from "../libs/liquid-fire/mutation-observer";

export default Ember.Component.extend({
  didInsertElement: function() {
    var self = this;
    self.updateMeasurements();
    this.observer = new MutationObserver(function(){
      self.updateMeasurements();
    });
    this.observer.observe(this.get('element'), {
      attributes: true,
      subtree: true,
      childList: true
    });

    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    this.destroyer = function(){ self.willDestroyElement() };
    window.addEventListener('unload', this.destroyer);
  },

  willDestroyElement: function() {
    if (this.destroyer) {
      window.removeEventListener('unload', this.destroyer);
      this.destroy = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
  
  updateMeasurements: function() {
    var elt = this.$();
    if (!elt && !elt[0]) {
      return;
    }

    // if jQuery sees a zero dimension, it will temporarily modify the
    // element's css to try to make its size measurable. But that's
    // bad for us here, because we'll get an infinite recursion of
    // mutation events. So we trap the zero case without hitting
    // jQuery.

    if (elt[0].offsetWidth === 0) {
      this.set('width', 0);
    } else {
      this.set('width', elt.width());
    }

    if (elt[0].offsetHeight === 0) {
      this.set('height', 0);
    } else {
      this.set('height', elt.height());
    }
  }
});
