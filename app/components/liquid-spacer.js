import Ember from "ember";
import Promise from "liquid-fire/promise";
import { measure } from "./liquid-measured";
var capitalize = Ember.String.capitalize;

export default Ember.Component.extend({
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',
  enabled: true,
  
  didInsertElement: function() {
    var child = this.$('> div');
    var measurements = measure(child);
    this.$().css({
      overflow: 'hidden',
      width: measurements.width,
      height: measurements.height
    });
  },

  sizeChange: Ember.observer('measurements', function() {
    if (!this.get('enabled')) { return; }
    var elt = this.$();
    if (!elt || !elt[0]) { return; }
    var want = this.get('measurements');
    var have = measure(this.$());
    Promise.all([
      this.adaptDimension(elt, 'width', have, want),
      this.adaptDimension(elt, 'height', have, want)
    ]);
  }),

  adaptDimension: function(elt, dimension, have, want) {
    var target = {};
    target[dimension] = [
      want['literal'+capitalize(dimension)],
      have['literal'+capitalize(dimension)],
    ];
    return Ember.$.Velocity(elt[0], target, {
      duration: this.durationFor(have[dimension], want[dimension]),
      queue: false,
      easing: this.get('growEasing')      
    });
  },

  durationFor: function(before, after) {
    return Math.min(this.get('growDuration'), 1000*Math.abs(before - after)/this.get('growPixelsPerSecond'));
  }

  
});
