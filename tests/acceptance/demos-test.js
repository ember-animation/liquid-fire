/* global ranTransition, noTransitionsYet, notDeepEqual */
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { skip } from 'qunit';
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
  var lastRouteName = 'modal-documentation.animation';
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

test('liquid bind block-form demo', function() {
  visit('/helpers/liquid-bind-block');
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
  var first, second;
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

skip('interruption demo, early interruption', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
    Ember.run.later(function(){
      isPartiallyOpaque(assert, '.one');
      clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
      Ember.run.later(function(){
        isTransparent(assert, '.one');
        isHidden(assert, '.two');
        isPartiallyOpaque(assert, '.three');
      }, 50);

    }, 50);
  });
  andThen(function(){
    classFound('three');
  });
});

skip('interruption demo, two early interruptions', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
    Ember.run.later(function(){
      isPartiallyOpaque(assert, '.one');
      isHidden(assert, '.two');
      isHidden(assert, '.three');
      Ember.run.later(function(){
        isTransparent(assert, '.one');
        isHidden(assert, '.two');
        isPartiallyOpaque(assert, '.three');
      }, 100);
    }, 40);
  });
  andThen(function(){
    classFound('three');
  });
});


skip('interruption demo, late interruption', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
    Ember.run.later(function(){
      isPartiallyOpaque(assert, '.two');
      clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
      Ember.run.later(function() {
        isTransparent(assert, '.one');
        isTransparent(assert, '.two');
        isPartiallyOpaque(assert, '.three');
      }, 100);
    }, 150);
  });
  andThen(function(){
    classFound('three');
  });
});

skip('interruption demo, two late interruptions', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound('one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
    Ember.run.later(function(){
      isPartiallyOpaque(assert, '.two');
      clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
      Ember.run.later(function() {
        isPartiallyOpaque(assert, '.three');
        clickWithoutWaiting('#interrupted-fade-demo a', 'One');
        Ember.run.later(function() {
          isTransparent(assert, '.three');
          isTransparent(assert, '.two');
          isPartiallyOpaque(assert, '.one');
        }, 100);
      }, 100);
    }, 150);
  });
  andThen(function(){
    classFound('one');
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
    click('.lm-container');
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

test('modal demo after navigation', function() {
  visit('/');
  visit('/modals');
  click('#basic-modal-demo button');
  andThen(function(){
    findWithAssert('.hello-modal');
    click('.hello-modal button.done');
  });
  andThen(function(){
    equal(find('.hello-modal').length, 0, "dismissed hello-modal");
  });
});


test('explode demo 1', function() {
  visit('/transitions/explode');
  andThen(function(){
    equal(find('h3:contains(Welcome)').length, 1, "first state");
    click('button:contains(Toggle Detail View)');
  });
  andThen(function(){
    equal(find('h3:contains(Detail)').length, 1, "second state");
    ranTransition('explode');
  });
});

test('explode demo 2', function() {
  var ids;
  visit('/transitions/explode');
  andThen(function(){
    ids = find('#explode-demo-2 img').toArray().map((elt) => {
      return $(elt).attr('data-photo-id');
    });
    click('button:contains(Shuffle)');
  });
  andThen(function(){
    var newIds = find('#explode-demo-2 img').toArray().map((elt) => {
      return $(elt).attr('data-photo-id');
    });
    notDeepEqual(ids, newIds);
    deepEqual(ids.sort(), newIds.sort());
    ranTransition('explode');
  });
});

function isPartiallyOpaque(assert, selector) {
  var opacity = parseFloat(findWithAssert(selector).parent().css('opacity'));
  assert.ok(opacity > 0 && opacity < 1, `${selector} opacity: ${opacity} should be partially opaque`);
}

function isTransparent(assert, selector) {
  var opacity = parseFloat(findWithAssert(selector).parent().css('opacity'));
  assert.ok(opacity === 0, `${selector} opacity: ${opacity} should be 0`);
}

function isHidden(assert, selector) {
  assert.equal(findWithAssert(selector).parent().css('visibility'), 'hidden', `${selector} hidden`);
}
