import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {
  this.route("second", {path: "/second/:id"});
  this.route("test-with", {path: "/test-with/:id"});
});

export default Router;
