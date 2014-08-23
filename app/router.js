import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {

  this.resource("helpers-documentation", { path: 'helpers'}, function(){
    this.resource('helpers-documentation.liquid-outlet', { path: 'liquid-outlet'}, function(){
      this.route('other');
    });
    this.resource('helpers-documentation.liquid-with', { path: 'liquid-with'}, function(){
      this.route('page', { path: '/:id' });
    });
    this.resource('helpers-documentation.liquid-bind', { path: 'liquid-bind'});
    this.resource('helpers-documentation.liquid-if', { path: 'liquid-if'});
  });

  this.resource('transition-map', function(){
    this.route('route-constraints');
    this.route('model-constraints');
    this.route('dom-constraints');
    this.route('choosing-transitions');
  });
  this.resource('transitions', function(){
    this.route('predefined');
    this.route('defining');
    this.resource('transitions.primitives', { path: 'primitives'}, function(){
      this.route('two');
      this.route('three');
    });
  });
});

export default Router;
