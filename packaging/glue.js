/* global define, require */

define('ember', ["exports"], function(__exports__) {
  __exports__['default'] = window.Ember;
});
define('liquid-fire', ["exports"], function(__exports__) {
  var lf = require('liquid-fire/index');
  Object.keys(lf).forEach(function(key) {
    __exports__[key] = lf[key];
  });
});

window.LiquidFire = require('liquid-fire/index');
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
    require('liquid-fire-shim').initialize(container);
    require('liquid-fire/index').initialize(container);

    window.LiquidFire._deferredDefines.forEach(function(pair){
      container.register('transition:' + pair[0], pair[1]);
    });

    container.register('transitions:main', function() {
      var self = this;
      window.LiquidFire._deferredMaps.forEach(function(m){
        m.apply(self);
      });
    });

  }
});
