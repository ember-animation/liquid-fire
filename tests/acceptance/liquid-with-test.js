import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: LiquidWith', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /liquid-with', function() {
  visit('/test-with/1');

  andThen(function() {
    equal(currentPath(), 'test-with');
  });
});
