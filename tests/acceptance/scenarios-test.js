import { click, findAll, visit } from '@ember/test-helpers';
/* global ranTransition */
import { later } from '@ember/runloop';
import { injectTransitionSpies } from '../helpers/integration';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

function visibility(selector) {
  return window.getComputedStyle(find(selector)[0]).visibility;
}

module('Acceptance: Scenarios', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    injectTransitionSpies(this.application);
  });

  test('nested liquid-outlets wait for their ancestors to animate', async function(assert) {
    await visit('/scenarios/nested-outlets/middle/inner');
    await visit('/scenarios/nested-outlets/middle2');
    later(function(){
      assert.dom('#inner-index').exists({ count: 1 }, "inner view exists during animation");
    }, 30);
  });

  test('inner nested liquid-outlets can animate', async function(assert) {
    await visit('/scenarios/nested-outlets/middle/inner');
    await visit('/scenarios/nested-outlets/middle');
    ranTransition(assert, 'fade');
  });

  test('liquid-outlet animate by outlet name', async function(assert) {
    await visit('/scenarios/in-test-outlet');
    ranTransition(assert, 'toLeft');
  });


  test('model-dependent transitions are matching correctly', async function(assert) {
    await visit('/scenarios/model-dependent-rule/1');
    ranTransition(assert, 'toLeft');
    await click('a:contains(Previous)');
    ranTransition(assert, 'toRight');
  });

  test('nested transitions with explode properly hide children', async function(assert) {
    await visit('/scenarios/nested-explode-transition');
    await click('button:contains(Toggle One/Two)');
    later(function() {
      assert.dom('.child-one-b').exists({ count: 2 }, 'explode transition clones child-one');
      assert.equal(visibility('.child-one-b:first'), 'hidden', 'even nested children are hidden');
      assert.equal(visibility('.child-one-b:last'), 'visible', 'nested children of clone are visible');

      assert.dom('.child-two').exists({ count: 2 }, 'explode transition clones child-two');
      assert.equal(visibility('.child-two:first'), 'hidden', 'original child-two is hidden');
      assert.equal(visibility('.child-two:last'), 'visible', 'cloned child-two is visible');
    }, 50);
  });
});
