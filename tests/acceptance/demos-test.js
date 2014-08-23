import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Demos', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit every link in sidebar', function() {
  var lastRouteName = 'transitions.primitives.index';
  expect(1);

  function navigateForward() {
    var forward = find('.nav-link.forward a');
    if (forward.length > 0) {
      click('.nav-link.forward a');
      andThen(navigateForward);
    } else {
      equal(currentRouteName(), lastRouteName);
    }
  }

  visit('/');
  andThen(navigateForward);
});

test('liquid outlet demo', function() {
  visit('/helpers/liquid-outlet');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
    equal(find('.demo-container a').text(), 'Click me!');
  });
  click('.demo-container a');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-outlet.other');
    equal(find('.demo-container a').text(), 'Go back!');
  });
  click('.demo-container a');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
    equal(find('.demo-container a').text(), 'Click me!');
  });
});

test('liquid with demo', function() {
  visit('/helpers/liquid-with');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-with.page');
    ok(/\b1\b/.test(find('.demo-container').text()), 'Has 1');
  });
  click('.demo-container button');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-with.page');
    ok(/\b2\b/.test(find('.demo-container').text()), 'Has 2');
  });
});

test('liquid bind demo', function() {
  var first, second;
  function clock() {
    var m = /(\d\d)\s*:\s*(\d\d)\s*:\s*(\d\d)/.exec($('#liquid-bind-demo').text());
    ok(m, "Read the clock");
    return parseInt(m[3]);
  }

  visit('/helpers/liquid-bind');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-bind');
    first = clock();
    Ember.run(function(){
      Ember.run.later(function(){
        second = clock();
        notEqual(first, second, "clock readings differ, " + first + ", " + second);
      }, 2000);
    });
  });
});
