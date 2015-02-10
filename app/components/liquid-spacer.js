import Ember from "ember";
import Promise from "liquid-fire/promise";

export default Ember.Component.extend({
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',
  lockWidth: false,
  lockHeight: false,
  
  didInsertElement: function() {
    var child = this.$('> div');
    child.css({
      position: 'absolute'
    });
    var css = {
      position: 'relative',
      overflow: 'hidden'
    };
    if (!this.get('lockWidth')) {
      css.width = child.width();
    }
    if (!this.get('lockHeight')) {
      css.height = child.height();
    }
    this.$().css(css);
  },

  sizeChange: Ember.observer('width', 'height', function() {
    var elt = this.$();
    var actions = [];
    if (!this.get('lockWidth')) {
      actions.push(this.adaptDimension(elt, 'width'));
    }
    if (!this.get('lockHeight')) {
      actions.push(this.adaptDimension(elt, 'height'));
    }
    return Promise.all(actions);
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
