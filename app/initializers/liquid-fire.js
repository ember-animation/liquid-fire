import { initialize } from "liquid-fire";
import Ember from "ember";

export default {
  name: 'liquid-fire',

  initialize: function(container) {
    if (!Ember.$.Velocity) {
      Ember.warn("Velocity.js is missing");
    } else {
      var version = Ember.$.Velocity.version;
      var recommended = [0, 11, 8];
      if (Ember.compare(recommended, [version.major, version.minor, version.patch]) === 1) {
        Ember.warn("You should probably upgrade Velocity.js, recommended minimum is " + recommended.join('.'));
      }
    }

    initialize(container);
  }
};
