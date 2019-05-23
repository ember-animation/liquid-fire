import { click, visit } from '@ember/test-helpers';
import { later } from '@ember/runloop';
import { setupTransitionTest } from '../helpers/integration';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

function visibility(elt) {
  return window.getComputedStyle(elt).visibility;
}

module('Acceptance: Scenarios', function(hooks) {
  setupApplicationTest(hooks);
  setupTransitionTest(hooks);

  test('nested liquid-outlets wait for their ancestors to animate', async function(assert) {
    await visit('/scenarios/nested-outlets/middle/inner');

    // deliberately not waiting so we can observe during the transition
    visit('/scenarios/nested-outlets/middle2');

    later(function(){
      assert.dom('#inner-index').exists({ count: 1 }, "inner view exists during animation");
    }, 30);
  });

  test('inner nested liquid-outlets can animate', async function(assert) {
    await visit('/scenarios/nested-outlets/middle/inner');
    await visit('/scenarios/nested-outlets/middle');
    assert.ranTransition('fade');
  });

  test('liquid-outlet animate by outlet name', async function(assert) {
    await visit('/scenarios/in-test-outlet');
    assert.ranTransition('toLeft');
  });


  test('model-dependent transitions are matching correctly', async function(assert) {
    await visit('/scenarios/model-dependent-rule/1');
    assert.ranTransition('toLeft');
    await click([...document.querySelectorAll('a')].find(elt => elt.textContent.trim() === 'Previous'));
    assert.ranTransition('toRight');
  });

  test('nested transitions with explode properly hide children', async function(assert) {
    await visit('/scenarios/nested-explode-transition');
    click([...document.querySelectorAll('button')].find(elt => elt.textContent.trim() === 'Toggle One/Two'));
    later(function() {
      assert.dom('.child-one-a').exists({ count: 2 }, 'explode transition clones child-one');
      let [first, second] = [...document.querySelectorAll('.child-one-a')];
      assert.equal(visibility(first), 'hidden', 'even nested children are hidden');
      assert.equal(visibility(second), 'visible', 'nested children of clone are visible');

      let [twoFirst, twoSecond] = [...document.querySelectorAll('.child-two')];
      assert.dom('.child-two').exists({ count: 2 }, 'explode transition clones child-two');
      assert.equal(visibility(twoFirst), 'hidden', 'original child-two is hidden');
      assert.equal(visibility(twoSecond), 'visible', 'cloned child-two is visible');
    }, 50);
  });
});
