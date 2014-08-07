/* global define, require */

define('ember', ["exports"], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.LiquidFire = require('vendor/liquid-fire');
window.LiquidFire._deferredMaps = [];
window.LiquidFire._deferredDefines = [];

window.LiquidFire.map = function(handler) {
  window.LiquidFire._deferredMaps.push(handler);
};

window.LiquidFire.defineTransition = function(name, implementation) {
  window.LiquidFire._deferredDefines.push([name, implementation]);
};

window.Ember.Application.initializer({
  name: 'liquid-fire-standalone',
  initialize: function(container) {
    require('vendor/liquid-fire').initialize(container, function(){
      var self = this;
      window.LiquidFire._deferredMaps.forEach(function(m){
        m.apply(self);
      });
      window.LiquidFire._deferredDefines.forEach(function(pair){
        container.register('transition:' + pair[0], pair[1]);
      });
    });
    require('vendor/liquid-fire-shim').initialize(container);
  }
});
