/* global ranTransition, noTransitionsYet */
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { injectTransitionSpies,
         classFound,
         clickWithoutWaiting } from '../helpers/integration';

var App;

module('Acceptance: Demos', {
  setup: function() {
    App = startApp();
    // Conceptually, integration tests shouldn't be digging around in
    // the container. But animations are slippery, and it's easier to
    // just spy on them to make sure they're being run than to try to
    // observe their behavior more directly.
    injectTransitionSpies(App);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit every link in sidebar', function() {
  var lastRouteName = 'modal-documentation.component';
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
    noTransitionsYet();
  });
  click('.demo-container a');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-outlet.other');
    equal(find('.demo-container a').text(), 'Go back!');
    ranTransition('toLeft');
  });
  click('.demo-container a');
  andThen(function(){
    equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
    equal(find('.demo-container a').text(), 'Click me!');
    ranTransition('toRight');
  });
});

test('liquid with demo', function() {
  visit('/helpers/liquid-with');
  andThen(function(){
    ok(/\b1\b/.test(find('.demo-container').text()), 'Has 1');
    noTransitionsYet();
  });
  click('.demo-container button');
  andThen(function(){
    ranTransition('rotateBelow');
    ok(/\b2\b/.test(find('.demo-container').text()), 'Has 2');
  });
});

test('liquid bind demo', function() {
  var first, second, self = this;
  function clock() {
    var m = /(\d\d)\s*:\s*(\d\d)\s*:\s*(\d\d)/.exec($('#liquid-bind-demo').text());
    ok(m, "Read the clock");
    return parseInt(m[3]);
  }

  visit('/helpers/liquid-bind');
  andThen(function(){
    first = clock();
  });
  click('#force-tick');
  andThen(function(){
    second = clock();
    notEqual(first, second, "clock readings differ, " + first + ", " + second);
    ranTransition('toUp');
  });
});

test('liquid if demo', function() {
  visit('/helpers/liquid-if');
  andThen(function(){
    noTransitionsYet();
    equal(find('#liquid-box-demo input[type=checkbox]').length, 1, "found checkbox");
    equal(find('#liquid-box-demo input[type=text]').length, 0, "no text input");
    find('select').val('car').trigger('change');
  });
  andThen(function(){
    ranTransition('toLeft');
    equal(find('#liquid-box-demo input[type=checkbox]').length, 0, "no more checkbox");
    equal(find('#liquid-box-demo input[type=text]').length, 1, "has text input");
    find('select').val('bike').trigger('change');
  });
  andThen(function(){
    ranTransition('crossFade');
  });
});


test('interruption demo, normal transition', function() {
  visit('/transitions/primitives');
  andThen(function(){
    noTransitionsYet();
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  });
  andThen(function(){
    ranTransition('fade');
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
    }, 150);
  });
  andThen(function(){
    classFound('three');
  });
});

test('modal demo', function() {
  visit('/modals');
  click('#basic-modal-demo button');
  andThen(function(){
    findWithAssert('.hello-modal');
    click('.hello-modal button.change');
  });
  andThen(function(){
    ok(find('.hello-modal').text().match(/Hello/), "Salutation has changed");
  });
  andThen(function(){
    click('.hello-modal button.done');
  });
  andThen(function(){
    equal(find('.hello-modal').length, 0, "dismissed hello-modal");
  });
});

test('modal demo with bound otherParams', function() {
  visit('/modals');
  click('#basic-modal-demo button');
  andThen(function(){
    fillIn('.modal-input', 'some new text');
  });
  andThen(function(){
    ok(find('.template-input').val() === 'some new text', "Bound value has updated");
  });
});

test('warn-popup - dismiss with overlay', function() {
  visit('/modals?warn=1');
  andThen(function(){
    findWithAssert('#warn-popup');
    click('.lf-overlay');
  });
  andThen(function(){
    equal(find('#warn-popup').length, 0, "dismissed popup");
  });
});

test('warn-popup - dismiss with url', function() {
  visit('/modals?warn=1');
  andThen(function(){
    findWithAssert('#warn-popup');
    visit('/');
  });
  andThen(function(){
    equal(find('#warn-popup').length, 0, "dismissed popup");
  });
});
