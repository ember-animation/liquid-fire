import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {

  this.resource("helpers", function(){
    this.resource('helpers.liquid-outlet', { path: 'liquid-outlet'});
    this.resource('helpers.liquid-with', { path: 'liquid-with'});
    this.resource('helpers.liquid-bind', { path: 'liquid-bind'});
    this.resource('helpers.liquid-if', { path: 'liquid-if'});
    this.resource('helpers.liquid-measure', { path: 'liquid-measure'});
    this.resource('helpers.liquid-box', { path: 'liquid-box'});
  });

  this.resource("test-outlet", function(){
    this.route('second');
    this.route('third', {path: '/third/:id'});
  });
  this.route("test-with", {path: "/test-with/:id"});
  this.route("test-bind", {path: "/test-bind"});
  this.route("test-measure", {path: "/test-measure"});
  this.route("test-box", {path: "/test-box"});
  this.route("test-if", {path: "/test-if"});
});

export default Router;
