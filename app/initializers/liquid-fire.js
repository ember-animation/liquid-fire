import { initialize } from "liquid-fire";
import Ember from "ember";

var minEmberVersion = [1, 11];
var minVelocityVersion = [0, 11, 8];

function emberVersion() {
  var m = /^(\d+)\.(\d+)/.exec(Ember.VERSION);
  if (!m) {
    return [ 0, 0 ];
  }
  return [ parseInt(m[1]), parseInt(m[2]) ];
}

export default {
  name: 'liquid-fire',

  initialize: function(container, application) {
    if (Ember.compare(minEmberVersion, emberVersion()) === 1) {
      Ember.warn(`This version of liquid fire requires Ember ${ minEmberVersion.join('.') } or newer`);
    }

    if (!Ember.$.Velocity) {
      Ember.warn("Velocity.js is missing");
    } else {
      var version = Ember.$.Velocity.version;
      if (Ember.compare(minVelocityVersion, [version.major, version.minor, version.patch]) === 1) {
        Ember.warn("You should probably upgrade Velocity.js, recommended minimum is " + minVelocityVersion.join('.'));
      }
    }

    initialize(application);
  }
};
