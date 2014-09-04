import Ember from "ember";
import Promise from "./promise";
import { animate, stop } from "./animate";

export default Ember.Mixin.create({
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',
  enableGrowth: true,

  cacheSize: function() {
    var elt = this.$();
    if (elt) {
      // Measure original size.
      this._cachedSize = {
        width: elt.width(),
        height: elt.height()
      };
    }
  },

  unlockSize: function() {
    var self = this;
    function doUnlock(){
      var elt = self.$();
      if (elt) {
        elt.css({width: '', height: ''});
      }
    }
    if (this._scaling) {
      this._scaling.then(doUnlock);
    } else {
      doUnlock();
    }
  },

  _durationFor: function(before, after) {
    return Math.min(this.get('growDuration'), 1000*Math.abs(before - after)/this.get('growPixelsPerSecond'));
  },

  _adaptDimension: function(dimension, before, after) {
    if (before === after || !this.get('enableGrowth')) {
      var elt = this.$();
      if (elt) {
        elt[dimension](after);
      }
      return Promise.cast();
    } else {
      var target = {};
      target[dimension] = [after, before];
      return animate(this, target, {
        duration: this._durationFor(before, after),
        queue: false,
        easing: this.get('growEasing')
      });
    }
  },

  adaptSize: function() {
    stop(this);

    var elt = this.$();
    if (!elt) { return; }

    // Measure new size.
    var newSize = {
      width: elt.width(),
      height: elt.height()
    };
    if (typeof(this._cachedSize) === 'undefined') {
      this._cachedSize = newSize;
    }

    // Now that measurements have been taken, lock the size
    // before the invoking the scaling transition.
    elt.width(this._cachedSize.width);
    elt.height(this._cachedSize.height);

    this._scaling = Promise.all([
      this._adaptDimension('width', this._cachedSize.width, newSize.width),
      this._adaptDimension('height', this._cachedSize.height, newSize.height),
    ]);
  }

});
