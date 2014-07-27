/* global define, require */

define('ember', ["exports"], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.LiquidFire = require('vendor/liquid-fire');
window.LiquidFire._deferredMaps = [];

window.LiquidFire.map = function(handler) {
  window.LiquidFire._deferredMaps.push(handler);
};

window.Ember.Application.initializer({
  name: 'liquid-fire-standalone',
  initialize: function(container) {
    require('vendor/liquid-fire').initialize(container, function(){
      var self = this;
      console.log("loading maps", window.LiquidFire._deferredMaps.length);
      window.LiquidFire._deferredMaps.forEach(function(m){
        m.apply(self);
      });
    });
    require('vendor/liquid-fire-shim').initialize(container);
  }
});
