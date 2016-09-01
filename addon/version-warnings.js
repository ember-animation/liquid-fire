import Ember from "ember";

export default function(args) {

  if (!Ember.$.Velocity) {
    Ember.warn("Velocity.js is missing");
  } else {
    var version = Ember.$.Velocity.version;
    if (Ember.compare(args.minVelocityVersion, [version.major, version.minor, version.patch]) === 1) {
      Ember.warn("You should probably upgrade Velocity.js, recommended minimum is " + args.minVelocityVersion.join('.'));
    }
  }
}
