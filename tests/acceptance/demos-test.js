import { click, findAll, currentRouteName, find, visit } from '@ember/test-helpers';
/* global ranTransition, noTransitionsYet */
import { later } from '@ember/runloop';
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

test('visit every link in sidebar', async function(assert) {
  let lastRouteName = 'transitions.primitives.index';
  assert.expect(1);

  async function navigateForward() {
    let forward = find('.page-item.forward a');
    if (forward.length > 0) {
      await click('.page-item.forward a');
      await navigateForward();
    } else {
      assert.equal(currentRouteName(), lastRouteName);
    }
  }

  await visit('/');
  await navigateForward();
});

test('liquid outlet demo', async function(assert) {
  await visit('/helpers/liquid-outlet');
  assert.equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
  assert.dom('.demo-container a').hasText('Click me!');
  noTransitionsYet(assert);
  await click('.demo-container a');
  assert.equal(currentRouteName(), 'helpers-documentation.liquid-outlet.other');
  assert.dom('.demo-container a').hasText('Go back!');
  ranTransition(assert, 'toLeft');
  await click('.demo-container a');
  assert.equal(currentRouteName(), 'helpers-documentation.liquid-outlet.index');
  assert.dom('.demo-container a').hasText('Click me!');
  ranTransition(assert, 'toRight');
});

test('liquid bind block-form demo', async function(assert) {
  await visit('/helpers/liquid-bind-block');
  assert.ok(/\b1\b/.test(find('.demo-container').textContent), 'Has 1');
  noTransitionsYet(assert);
  await click('.demo-container button');
  ranTransition(assert, 'rotateBelow');
  assert.ok(/\b2\b/.test(find('.demo-container').textContent), 'Has 2');
});

test('liquid bind demo', async function(assert) {
  let first, second;
  function clock() {
    let m = /(\d\d)\s*:\s*(\d\d)\s*:\s*(\d\d)/.exec($('#liquid-bind-demo').text());
    assert.ok(m, "Read the clock");
    return parseInt(m[3]);
  }

  await visit('/helpers/liquid-bind');
  first = clock();
  await click('#force-tick');
  second = clock();
  assert.notEqual(first, second, "clock readings differ, " + first + ", " + second);
  ranTransition(assert, 'toUp');
});

test('liquid if demo', async function(assert) {
  await visit('/helpers/liquid-if');
  noTransitionsYet(assert);
  assert.dom('#liquid-box-demo input[type=checkbox]').exists({ count: 1 }, "found checkbox");
  assert.dom('#liquid-box-demo input[type=text]').doesNotExist("no text input");
  find('select').val('car').trigger('change');
  ranTransition(assert, 'toLeft');
  assert.dom('#liquid-box-demo input[type=checkbox]').doesNotExist("no more checkbox");
  assert.dom('#liquid-box-demo input[type=text]').exists({ count: 1 }, "has text input");
  find('select').val('bike').trigger('change');
  ranTransition(assert, 'crossFade');
});


test('interruption demo, normal transition', async function(assert) {
  await visit('/transitions/primitives');
  noTransitionsYet(assert);
  classFound(assert, 'one');
  clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  ranTransition(assert, 'fade');
  classFound(assert, 'two');
});

skip('interruption demo, early interruption', async function(assert) {
  await visit('/transitions/primitives');
  classFound(assert, 'one');
  clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  later(function(){
    isPartiallyOpaque(assert, '.one');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
    later(function(){
      isTransparent(assert, '.one');
      isHidden(assert, '.two');
      isPartiallyOpaque(assert, '.three');
    }, 50);

  }, 50);
  classFound(assert, 'three');
});

skip('interruption demo, two early interruptions', async function(assert) {
  await visit('/transitions/primitives');
  classFound(assert, 'one');
  clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
  later(function(){
    isPartiallyOpaque(assert, '.one');
    isHidden(assert, '.two');
    isHidden(assert, '.three');
    later(function(){
      isTransparent(assert, '.one');
      isHidden(assert, '.two');
      isPartiallyOpaque(assert, '.three');
    }, 100);
  }, 40);
  classFound(assert, 'three');
});


skip('interruption demo, late interruption', async function(assert) {
  await visit('/transitions/primitives');
  classFound(assert, 'one');
  clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  later(function(){
    isPartiallyOpaque(assert, '.two');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
    later(function() {
      isTransparent(assert, '.one');
      isTransparent(assert, '.two');
      isPartiallyOpaque(assert, '.three');
    }, 100);
  }, 150);
  classFound(assert, 'three');
});

skip('interruption demo, two late interruptions', async function(assert) {
  await visit('/transitions/primitives');
  classFound(assert, 'one');
  clickWithoutWaiting('#interrupted-fade-demo a', 'Two');
  later(function(){
    isPartiallyOpaque(assert, '.two');
    clickWithoutWaiting('#interrupted-fade-demo a', 'Three');
    later(function() {
      isPartiallyOpaque(assert, '.three');
      clickWithoutWaiting('#interrupted-fade-demo a', 'One');
      later(function() {
        isTransparent(assert, '.three');
        isTransparent(assert, '.two');
        isPartiallyOpaque(assert, '.one');
      }, 100);
    }, 100);
  }, 150);
  classFound(assert, 'one');
});


test('explode demo 1', async function(assert) {
  await visit('/transitions/explode');
  assert.equal(findAll('h3:contains(Welcome)').length, 1, "first state");
  await click('button:contains(Toggle Detail View)');
  assert.equal(findAll('h3:contains(Detail)').length, 1, "second state");
  ranTransition(assert, 'explode');
});

test('explode demo 2', async function(assert) {
  let ids;
  await visit('/transitions/explode');
  ids = find('#explode-demo-2 img').toArray().map((elt) => {
    return $(elt).attr('data-photo-id');
  });
  await click('button:contains(Shuffle)');
  let newIds = find('#explode-demo-2 img').toArray().map((elt) => {
    return $(elt).attr('data-photo-id');
  });
  assert.notDeepEqual(ids, newIds);
  assert.deepEqual(ids.sort(), newIds.sort());
  ranTransition(assert, 'explode');
});

function isPartiallyOpaque(assert, selector) {
  let opacity = parseFloat(findWithAssert(selector).parent().css('opacity'));
  assert.ok(opacity > 0 && opacity < 1, `${selector} opacity: ${opacity} should be partially opaque`);
}

function isTransparent(assert, selector) {
  let opacity = parseFloat(findWithAssert(selector).parent().css('opacity'));
  assert.ok(opacity === 0, `${selector} opacity: ${opacity} should be 0`);
}

function isHidden(assert, selector) {
  assert.equal(findWithAssert(selector).parent().css('visibility'), 'hidden', `${selector} hidden`);
}
