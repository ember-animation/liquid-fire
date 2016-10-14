(function() {
  function vendorModule() {
    'use strict';
    // Velocity tries to register on jQuery first, if it's not present, then it registers itself globally
    var Velocity = self.Velocity || self.Ember.$.Velocity;
    return { 'default': Velocity };
  }

  define('velocity', [], vendorModule);
})();
