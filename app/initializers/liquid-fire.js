import { initialize } from "liquid-fire";
import Ember from "ember";

var TestWaiter = Ember.Object.extend({
  init: function() {
    this._super();
    var waiter = this;

    this._waiter = function() {
      return waiter.hasRunningTransitions();
    };

    Ember.Test.registerWaiter(this._waiter);
  },

  hasRunningTransitions: function( ) {
    return this.container.lookup('transitions:map').runningTransitions() === 0;
  },

  willDestroy: function() {
    this._super();
    Ember.Test.unregisterWaiter(this._waiter);
  }
});


export default {
  name: 'liquid-fire',

  initialize: function(container, application) {
    if (!Ember.$.Velocity) {
      Ember.warn("Velocity.js is missing");
    } else {
      var version = Ember.$.Velocity.version;
      var recommended = [0, 11, 8];
      if (Ember.compare(recommended, [version.major, version.minor, version.patch]) === 1) {
        Ember.warn("You should probably upgrade Velocity.js, recommended minimum is " + recommended.join('.'));
      }
    }

    initialize(container, container.lookupFactory('transitions:main'));

    if (Ember.testing) {

      application.register('transitions:-liquid-fire-waiter', TestWaiter, {
        singleton: true
      });
      // force it into existence
      // TODO: inject it on something that we know will be instantiated if
      // waiters are used
      container.lookup('transitions:-liquid-fire-waiter');
    }
  }
};
