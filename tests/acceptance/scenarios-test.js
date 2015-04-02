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

test('Test width does not change when re-measuring', function() {
  visit('/scenarios/spacer');
  andThen(function(){
    Ember.run.later(function(){
      var initialWidth = find('#spacer-test-2 .ember-view:nth-child(2)').outerWidth();
      andThen(function(){
          click('.ember-checkbox');
          andThen(function(){
              equal(find('#spacer-test-2 .ember-view:nth-child(2)').outerWidth(), initialWidth, "Width has changed during re-calculation");
          });
      });
    }, 30);
  });
});

test('inner nested liquid-outlets can animate', function() {
  visit('/scenarios/nested-outlets/middle/inner');
  visit('/scenarios/nested-outlets/middle');
  andThen(function(){
    ranTransition('fade');
  });
});


test('modal with remapped parameters receives them', function() {
  expect(2);
  visit('/scenarios/remapped-modal');
  andThen(function(){
    click('a:contains(Go)');
  });
  andThen(function(){
    findWithAssert('.lf-dialog:contains(Hi Tomster)');
    ok(true);
    click('button:contains(Thanks)');
  });
  andThen(function(){
    equal(find('.lf-dialog').length, 0, "expected dialog to be dismissed");
  });
});
