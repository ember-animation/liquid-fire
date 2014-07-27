import Ember from "ember";
import MutationObserver from "vendor/liquid-fire/mutation-observer";

export default Ember.Component.extend({
  attributeBindings: ['style'],
  style: "display: inline-block;",

  didInsertElement: function() {
    var self = this;
    this.updateMeasurements();
    this.observer = new MutationObserver(function(){
      self.updateMeasurements();
    });
    this.observer.observe(this.get('element'), {
      attributes: true,
      subtree: true,
      childList: true
    });

    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    this.destroyer = function(){ self.willDestroyElement(); };
    window.addEventListener('unload', this.destroyer);
  },

  willDestroyElement: function() {
    if (this.destroyer) {
      window.removeEventListener('unload', this.destroyer);
      this.destroyer = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  updateMeasurements: function() {
    var elt = this.$(), dim;
    if (!elt && !elt[0]) {
      return;
    }

    switch (this.get('method')) {
    case 'biggestChild':
      dim = this._measureBiggestChild(elt);
      break;
    case 'lastChild':
      dim = this._measureLastChild(elt);
      break;
    default:
      dim = this._measure(elt);
    }
    this.setProperties(dim);
  },

  _measure: function(elt) {
    // if jQuery sees a zero dimension, it will temporarily modify the
    // element's css to try to make its size measurable. But that's
    // bad for us here, because we'll get an infinite recursion of
    // mutation events. So we trap the zero case without hitting
    // jQuery.
    var width, height;
    if (elt[0].offsetWidth === 0) {
      width = 0;
    } else {
      width = elt.width();
    }

    if (elt[0].offsetHeight === 0) {
      height = 0;
    } else {
      height = elt.height();
    }
    return {width: width, height: height };
  },

  _measureBiggestChild: function(elt) {
    var self = this, dim = {width: 0, height: 0};
    elt.children().each(function(){
      var d = self._measure(Ember.$(this));
      if (d.width > dim.width) {
        dim.width = d.width;
      }
      if (d.height > dim.height) {
        dim.height = d.height;
      }
    });
    return dim;
  },

  _measureLastChild: function(elt) {
    return this._measure(elt.children().not('script').last());
  }


});
