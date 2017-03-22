/* global ranTransition, noTransitionsYet */
import Ember from 'ember';
import { test, skip } from 'qunit';
import moduleForAcceptance from '../helpers/module-for-acceptance';
import { injectTransitionSpies,
         classFound,
         clickWithoutWaiting } from '../helpers/integration';
import $ from 'jquery';

moduleForAcceptance('Acceptance: Demos', {
  beforeEach() {
    // Conceptually, integration tests shouldn't be digging around in
    // the container. But animations are slippery, and it's easier to
    // just spy on them to make sure they're being run than to try to
    // observe their behavior more directly.
    injectTransitionSpies(this.application);
  }
});

test('visit every link in sidebar', function(assert) {
  var lastRouteName = 'transitions.primitives.index';
  assert.expect(1);

  function navigateForward() {
    var forward = find('.nav-link.forward a');
    if (forward.length > 0) {
      click('.nav-link.forward a');
      andThen(navigateForward);
    } else {
      assert.equal(currentRouteName(), lastRouteName);
    }
  }

  visit('/');
  andThen(navigateForward);
});

test('liquid outlet demo', function(assert) {
  visit('/helpers/liquid-outlet');
  andThen(function(){
    assert.equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
    assert.equal(find('.demo-container a').text(), 'Click me!');
    noTransitionsYet(assert);
  });
  click('.demo-container a');
  andThen(function(){
    assert.equal(currentRouteName(), 'helpers-documentation.liquid-outlet.other');
    assert.equal(find('.demo-container a').text(), 'Go back!');
    ranTransition(assert, 'toLeft');
  });
  click('.demo-container a');
  andThen(function(){
    assert.equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
    assert.equal(find('.demo-container a').text(), 'Click me!');
    ranTransition(assert, 'toRight');
  });
});

test('liquid bind block-form demo', function(assert) {
  visit('/helpers/liquid-bind-block');
  andThen(function(){
    assert.ok(/\b1\b/.test(find('.demo-container').text()), 'Has 1');
    noTransitionsYet(assert);
  });
  click('.demo-container button');
  andThen(function(){
    ranTransition(assert, 'rotateBelow');
    assert.ok(/\b2\b/.test(find('.demo-container').text()), 'Has 2');
  });
});

test('liquid bind demo', function(assert) {
  var first, second;
  function clock() {
    var m = /(\d\d)\s*:\s*(\d\d)\s*:\s*(\d\d)/.exec($('#liquid-bind-demo').text());
    assert.ok(m, "Read the clock");
    return parseInt(m[3]);
  }

  visit('/helpers/liquid-bind');
  andThen(function(){
    first = clock();
  });
  click('#force-tick');
  andThen(function(){
    second = clock();
    assert.notEqual(first, second, "clock readings differ, " + first + ", " + second);
    ranTransition(assert, 'toUp');
  });
});

test('liquid if demo', function(assert) {
  visit('/helpers/liquid-if');
  andThen(function(){
    noTransitionsYet(assert);
    assert.equal(find('#liquid-box-demo input[type=checkbox]').length, 1, "found checkbox");
    assert.equal(find('#liquid-box-demo input[type=text]').length, 0, "no text input");
    find('select').val('car').trigger('change');
  });
  andThen(function(){
    ranTransition(assert, 'toLeft');
    assert.equal(find('#liquid-box-demo input[type=checkbox]').length, 0, "no more checkbox");
    assert.equal(find('#liquid-box-demo input[type=text]').length, 1, "has text input");
    find('select').val('bike').trigger('change');
  });
  andThen(function(){
    ranTransition(assert, 'crossFade');
  });
});


test('interruption demo, normal transition', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    noTransitionsYet(assert);
    classFound(assert, 'one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  });
  andThen(function(){
    ranTransition(assert, 'fade');
    classFound(assert, 'two');
  });
});

skip('interruption demo, early interruption', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound(assert, 'one');
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
    classFound(assert, 'three');
  });
});

skip('interruption demo, two early interruptions', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound(assert, 'one');
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
    classFound(assert, 'three');
  });
});


skip('interruption demo, late interruption', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound(assert, 'one');
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
    classFound(assert, 'three');
  });
});

skip('interruption demo, two late interruptions', function(assert) {
  visit('/transitions/primitives');
  andThen(function(){
    classFound(assert, 'one');
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
    classFound(assert, 'one');
  });
});


test('explode demo 1', function(assert) {
  visit('/transitions/explode');
  andThen(function(){
    assert.equal(find('h3:contains(Welcome)').length, 1, "first state");
    click('button:contains(Toggle Detail View)');
  });
  andThen(function(){
    assert.equal(find('h3:contains(Detail)').length, 1, "second state");
    ranTransition(assert, 'explode');
  });
});

test('explode demo 2', function(assert) {
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
    assert.notDeepEqual(ids, newIds);
    assert.deepEqual(ids.sort(), newIds.sort());
    ranTransition(assert, 'explode');
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
