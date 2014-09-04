import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {

  /* Interactive Documentation */

  this.resource("helpers-documentation", { path: 'helpers'}, function(){
    this.route('liquid-outlet', function(){
      this.route('other');
    });
    this.route('liquid-with', function(){
      this.route('page', { path: '/:id' });
    });
    this.route('liquid-bind');
    this.route('liquid-if');
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
    this.route('primitives', function(){
      this.route('two');
      this.route('three');
    });
  });

  /* Test Scenarios */

  this.resource('scenarios', function() {
    this.route('inline');
    this.route('inline-serial');
    this.route('empty-if');
  });

});

export default Router;
