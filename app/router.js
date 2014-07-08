import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {
  this.resource("test-outlet", function(){
    this.route('second');
  });
  this.route("test-with", {path: "/test-with/:id"});
});

export default Router;
