import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {
  this.resource("test-outlet", function(){
    this.route('second');
    this.route('third', {path: '/third/:id'});
  });
  this.route("test-with", {path: "/test-with/:id"});
  this.route("test-bind", {path: "/test-bind"});
  this.route("test-measure", {path: "/test-measure"});  
});

export default Router;
