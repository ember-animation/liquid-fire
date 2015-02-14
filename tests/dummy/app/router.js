import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
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
    this.route('liquid-spacer');
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

  this.resource("modal-documentation", { path: 'modals'}, function(){
    this.route('modal');
    this.route('component');

    // BEGIN-SNIPPET hello-modal-map
    this.modal('hello-modal', {
      withParams: ['salutation', 'person'],
      otherParams: {
        modalMessage: "message"
      },
      actions: {
        changeSalutation: "changeSalutation"
      }
    });
    // END-SNIPPET

  });

  this.modal('warning-popup', {
    withParams: 'warn'
  });

  /* Test Scenarios */

  this.resource('scenarios', function() {
    this.route('inline');
    this.route('inline-serial');
    this.route('empty-if');
    this.route('growable-with');
    this.route('growable-flexboxes');
    this.route('nested-outlets', function(){
      this.route('middle', function(){
        this.route('inner');
        this.route('inner2');
      });
      this.route('middle2');
    });
    this.route('table-row');
    this.route('remapped-modal');
    this.modal('hello-modal', {
      withParams: {
        testSalutation : 'salutation',
        testPerson : 'person'
      }
    });
    this.route('spacer');
  });

});

export default Router;
