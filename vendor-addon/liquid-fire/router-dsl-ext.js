import Ember from "ember";
var Router = Ember.Router;
var proto = Ember.RouterDSL.prototype;

var currentMap = null;

proto.modal = function(name, options) {
  currentMap.push({
    route: this.parent,
    name: name,
    options: options
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
