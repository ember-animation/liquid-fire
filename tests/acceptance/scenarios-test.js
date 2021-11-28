import { click, findAll, visit, waitUntil } from '@ember/test-helpers';
import { setupTransitionTest } from '../helpers/integration';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { macroCondition, dependencySatisfies } from '@embroider/macros';

module('Acceptance: Scenarios', function (hooks) {
  setupApplicationTest(hooks);
  setupTransitionTest(hooks);

  test('nested liquid-outlets wait for their ancestors to animate', async function (assert) {
    await visit('/scenarios/nested-outlets/middle/inner');

    // deliberately not waiting so we can observe during the transition
    visit('/scenarios/nested-outlets/middle2');

    assert
      .dom('#inner-index')
      .exists({ count: 1 }, 'inner view exists during animation');
  });

  test('inner nested liquid-outlets can animate', async function (assert) {
    await visit('/scenarios/nested-outlets/middle/inner');
    await visit('/scenarios/nested-outlets/middle');
    assert.ranTransition('fade');
  });

  // named outlets are deprecated in ember starting at 3.27.
  if (macroCondition(dependencySatisfies('ember-source', '<=3.26.0'))) {
    test('liquid-outlet animate by outlet name', async function (assert) {
      await visit('/scenarios/in-test-outlet');
      assert.ranTransition('toLeft');
    });
  }

  test('model-dependent transitions are matching correctly', async function (assert) {
    await visit('/scenarios/model-dependent-rule/1');
    await click(
      [...document.querySelectorAll('a')].find(
        (elt) => elt.textContent.trim() === 'Previous'
      )
    );
    assert.ranTransition('toRight');
  });

  test('nested transitions with explode properly hide children', async function (assert) {
    await visit('/scenarios/nested-explode-transition');

    click(
      [...document.querySelectorAll('button')].find(
        (elt) => elt.textContent.trim() === 'Toggle One/Two'
      )
    );

    await waitUntil(
      function () {
        let twos = findAll('.child-two');
        return (
          twos.length === 2 &&
          twos.filter((elt) => getComputedStyle(elt).visibility === 'visible')
            .length === 1
        );
      },
      { timeout: 2000 }
    );

    assert
      .dom('.child-one-a')
      .exists({ count: 2 }, 'explode transition clones child-one');

    let [first, second] = [...document.querySelectorAll('.child-one-a')];
    assert
      .dom(first)
      .hasStyle({ visibility: 'hidden' }, 'even nested children are hidden');
    assert
      .dom(second)
      .hasStyle(
        { visibility: 'visible' },
        'nested children of clone are visible'
      );

    let [twoFirst, twoSecond] = [...document.querySelectorAll('.child-two')];
    assert
      .dom('.child-two')
      .exists({ count: 2 }, 'explode transition clones child-two');
    assert
      .dom(twoFirst)
      .hasStyle({ visibility: 'hidden' }, 'original child-two is hidden');
    assert
      .dom(twoSecond)
      .hasStyle({ visibility: 'visible' }, 'cloned child-two is visible');
  });
});
