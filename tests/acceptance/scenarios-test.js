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

test('modal with remapped parameters receives them', function() {
  visit('/scenarios/remapped-modal');
  andThen(function(){
    click('a:contains(Go)');
  });
  andThen(function(){
    find('.lf-dialog:contains(Hi Tomstah)');
  });
});
