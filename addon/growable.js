import Ember from "ember";
import Promise from "liquid-fire/promise";
var capitalize = Ember.String.capitalize;

export default Ember.Mixin.create({
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',

  transitionMap: Ember.inject.service('liquid-fire-transitions'),

  animateGrowth: function(elt, have, want) {
    this.get('transitionMap').incrementRunningTransitions();
    return Promise.all([
      this._adaptDimension(elt, 'width', have, want),
      this._adaptDimension(elt, 'height', have, want)
    ]).then(()=>{
      this.get('transitionMap').decrementRunningTransitions();
    });
  },

  _adaptDimension: function(elt, dimension, have, want) {
    if (have[dimension] === want[dimension]) {
      return Promise.resolve();
    }
    var target = {};
    target['outer'+capitalize(dimension)] = [
      want[dimension],
      have[dimension],
    ];
    return Ember.$.Velocity(elt[0], target, {
      duration: this._durationFor(have[dimension], want[dimension]),
      queue: false,
      easing: this.get('growEasing') || this.constructor.prototype.growEasing
    });
  },

  _durationFor: function(before, after) {
    return Math.min(this.get('growDuration') || this.constructor.prototype.growDuration, 1000*Math.abs(before - after)/(this.get('growPixelsPerSecond') || this.constructor.prototype.growPixelsPerSecond));
  }

});
