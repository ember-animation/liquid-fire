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

function classFound(name) {
  equal(find('.'+name).length, 1, 'found ' + name);
}

function clickWithoutWaiting(selector, text) {
  find(selector).filter(function() {
    return $(this).text() === text;
  }).click();
}

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
    ok(/\b1\b/.test(find('.demo-container').text()), 'Has 1');
  });
  click('.demo-container button');
  andThen(function(){
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
    first = clock();
    Ember.run.later(function(){
      second = clock();
      notEqual(first, second, "clock readings differ, " + first + ", " + second);
    }, 2000);
  });
});

test('liquid if demo', function() {
  visit('/helpers/liquid-if');
  andThen(function(){
    equal(find('#liquid-box-demo input[type=checkbox]').length, 1, "found checkbox");
    equal(find('#liquid-box-demo input[type=text]').length, 0, "no text input");
    find('select').val('car').trigger('change');
  });
  andThen(function(){
    equal(find('#liquid-box-demo input[type=checkbox]').length, 0, "no more checkbox");
    equal(find('#liquid-box-demo input[type=text]').length, 1, "has text input");
  });
});


test('interruption demo, normal transition', function() {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  });
  andThen(function(){
    classFound('two');
  });
});

test('interruption demo, early interruption', function() {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
    Ember.run.later(function(){
      clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
    }, 300);
  });
  andThen(function(){
    classFound('three');
  });
});

test('interruption demo, late interruption', function() {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
    Ember.run.later(function(){
      classFound('two');
      clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
    }, 1800);
  });
  andThen(function(){
    classFound('three');
  });
});
