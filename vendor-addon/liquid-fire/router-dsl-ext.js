import Ember from "ember";
var Router = Ember.Router;
var proto = Ember.RouterDSL.prototype;

var currentMap = null;

proto.modal = function(componentName, opts) {

  Ember.assert('modal("' + componentName + '",...) needs a `withParams` argument', opts && opts.withParams);

  opts = Ember.copy(opts);

  if (!Ember.isArray(opts.withParams)) {
    opts.withParams = [opts.withParams];
  }

  if (typeof(opts.dismissWithOutsideClick) === 'undefined') {
    opts.dismissWithOutsideClick = true;
  }

  if (typeof(opts.dismissWithEscape) === 'undefined') {
    opts.dismissWithEscape = true;
  }

  currentMap.push({
    route: this.parent,
    name: componentName,
    options: opts
  });
};

var origMap = Router.map;

Router.reopenClass({
  map: function() {
    currentMap = [];
    var output = origMap.apply(this, arguments);
    this.router.modals = currentMap;
    return output;
  }
});
