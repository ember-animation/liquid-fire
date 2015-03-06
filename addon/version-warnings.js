import Ember from "ember";

function emberVersion() {
  var m = /^(\d+)\.(\d+)/.exec(Ember.VERSION);
  if (!m) {
    return [ 0, 0 ];
  }
  return [ parseInt(m[1]), parseInt(m[2]) ];
}

export default function(args) {

  if (Ember.compare(args.minEmberVersion, emberVersion()) === 1) {
    Ember.warn(`This version of liquid fire requires Ember ${ args.minEmberVersion.join('.') } or newer`);
  }

  if (!Ember.$.Velocity) {
    Ember.warn("Velocity.js is missing");
  } else {
    var version = Ember.$.Velocity.version;
    if (Ember.compare(args.minVelocityVersion, [version.major, version.minor, version.patch]) === 1) {
      Ember.warn("You should probably upgrade Velocity.js, recommended minimum is " + args.minVelocityVersion.join('.'));
    }
  }
}
