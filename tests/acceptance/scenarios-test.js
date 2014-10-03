/* global ranTransition, noTransitionsYet */
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { injectTransitionSpies,
         classFound,
         clickWithoutWaiting } from '../helpers/integration';

var App;

module('Acceptance: Scenarios', {
  setup: function() {
    App = startApp();
    injectTransitionSpies(App);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('nested liquid-outlets wait for their ancestors to animate', function() {
  visit('/scenarios/nested-outlets/middle/inner');
  andThen(function(){
    visit('/scenarios/nested-outlets/middle2');
    Ember.run.later(function(){
      equal(find('#inner-index').length, 1, "inner view exists during animation");
    }, 30);
  });
});
