import Ember from "ember";
import Promise from "liquid-fire/promise";

export default Ember.Component.extend({
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',
  
  didInsertElement: function() {
    var child = this.$('> div');
    this.$().css({
      overflow: 'hidden',
      width: child.width(),
      height: child.height()
    });
  },

  sizeChange: Ember.observer('width', 'height', function() {
    var elt = this.$();
    return Promise.all([
      this.adaptDimension(elt, 'width'),
      this.adaptDimension(elt, 'height')
    ]);
  }),

  adaptDimension: function(elt, dimension) {
    var have = elt[dimension]();
    var want = this.get(dimension);
    var target = {};
    target[dimension] = want;

    return Ember.$.Velocity(elt[0], target, {
      duration: this.durationFor(have, want),
      queue: false,
      easing: this.get('growEasing')      
    });
  },

  durationFor: function(before, after) {
    return Math.min(this.get('growDuration'), 1000*Math.abs(before - after)/this.get('growPixelsPerSecond'));
  },

  
});
