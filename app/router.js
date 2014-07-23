import Ember from 'ember';

var Router = Ember.Router.extend({
  location: LiquidFireENV.locationType
});

Router.map(function() {

  this.resource("helpers", function(){
    this.resource('helpers.liquid-outlet', { path: 'liquid-outlet'}, function(){
      this.route('other');
    });
    this.resource('helpers.liquid-with', { path: 'liquid-with'}, function(){
      this.route('page', { path: '/:id' });
    });
    this.resource('helpers.liquid-bind', { path: 'liquid-bind'});
    this.resource('helpers.liquid-if', { path: 'liquid-if'});
    this.resource('helpers.liquid-measure', { path: 'liquid-measure'});
    this.resource('helpers.liquid-box', { path: 'liquid-box'});
  });
});

export default Router;
