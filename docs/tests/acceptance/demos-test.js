import { click, currentRouteName, visit, fillIn } from '@ember/test-helpers';

import { later } from '@ember/runloop';
import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { classFound, setupTransitionTest } from '../helpers/integration';

module('Acceptance: Demos', function (hooks) {
  setupApplicationTest(hooks);
  setupTransitionTest(hooks);

  test('visit every link in sidebar', async function (assert) {
    let lastRouteName = 'transitions.primitives.index';
    assert.expect(1);
    await visit('/');
    for (;;) {
      let forward = document.querySelector('.page-item.forward a');
      if (forward) {
        await click('.page-item.forward a');
      } else {
        // eslint-disable-next-line qunit/no-conditional-assertions
        assert.strictEqual(currentRouteName(), lastRouteName);
        break;
      }
    }
  });

  test('liquid outlet demo', async function (assert) {
    await visit('/helpers/liquid-outlet');
    assert.strictEqual(
      currentRouteName(),
      'helpers-documentation.liquid-outlet.index'
    );
    assert.dom('.demo-container a').hasText('Click me!');
    assert.noTransitionsYet();
    await click('.demo-container a');
    assert.strictEqual(
      currentRouteName(),
      'helpers-documentation.liquid-outlet.other'
    );
    assert.dom('.demo-container a').hasText('Go back!');
    assert.ranTransition('toLeft');
    await click('.demo-container a');
    assert.strictEqual(
      currentRouteName(),
      'helpers-documentation.liquid-outlet.index'
    );
    assert.dom('.demo-container a').hasText('Click me!');
    assert.ranTransition('toRight');
  });

  test('liquid bind block-form demo', async function (assert) {
    await visit('/helpers/liquid-bind-block');
    assert.ok(
      /\b1\b/.test(document.querySelector('.demo-container').textContent),
      'Has 1'
    );
    assert.noTransitionsYet();
    await click('.demo-container button');
    assert.ranTransition('rotateBelow');
    assert.ok(
      /\b2\b/.test(document.querySelector('.demo-container').textContent),
      'Has 2'
    );
  });

  test('liquid bind demo', async function (assert) {
    assert.expect(4);

    let first, second;
    function clock() {
      let m = /(\d\d)\s*:\s*(\d\d)\s*:\s*(\d\d)/.exec(
        document.querySelector('#liquid-bind-demo').textContent
      );
      assert.ok(m, 'Read the clock');
      return parseInt(m[3]);
    }

    await visit('/helpers/liquid-bind');
    first = clock();
    await click('#force-tick');
    second = clock();
    assert.notEqual(
      first,
      second,
      'clock readings differ, ' + first + ', ' + second
    );
    assert.ranTransition('toUp');
  });

  test('liquid if demo', async function (assert) {
    await visit('/helpers/liquid-if');
    assert.noTransitionsYet();
    assert
      .dom('#liquid-box-demo input[type=checkbox]')
      .exists({ count: 1 }, 'found checkbox');
    assert
      .dom('#liquid-box-demo input[type=text]')
      .doesNotExist('no text input');
    let select = document.querySelector('select');
    await fillIn(select, 'car');
    assert.ranTransition('toLeft');
    assert
      .dom('#liquid-box-demo input[type=checkbox]')
      .doesNotExist('no more checkbox');
    assert
      .dom('#liquid-box-demo input[type=text]')
      .exists({ count: 1 }, 'has text input');
    await fillIn(select, 'bike');
    assert.ranTransition('crossFade');
  });

  test('interruption demo, normal transition', async function (assert) {
    assert.expect(3);

    await visit('/transitions/primitives');
    assert.noTransitionsYet();
    classFound(assert, 'one');
    await click(document.querySelectorAll('#interrupted-fade-demo a')[1]);

    assert.ranTransition('fade');
    classFound(assert, 'two');
  });

  skip('interruption demo, early interruption', async function (assert) {
    await visit('/transitions/primitives');
    classFound(assert, 'one');
    click('#interrupted-fade-demo a', 'Two');
    later(function () {
      isPartiallyOpaque(assert, '.one');
      click('#interrupted-fade-demo a', 'Three');
      later(function () {
        isTransparent(assert, '.one');
        isHidden(assert, '.two');
        isPartiallyOpaque(assert, '.three');
      }, 50);
    }, 50);
    classFound(assert, 'three');
  });

  skip('interruption demo, two early interruptions', async function (assert) {
    await visit('/transitions/primitives');
    classFound(assert, 'one');
    click('#interrupted-fade-demo a', 'Two');
    click('#interrupted-fade-demo a', 'Three');
    later(function () {
      isPartiallyOpaque(assert, '.one');
      isHidden(assert, '.two');
      isHidden(assert, '.three');
      later(function () {
        isTransparent(assert, '.one');
        isHidden(assert, '.two');
        isPartiallyOpaque(assert, '.three');
      }, 100);
    }, 40);
    classFound(assert, 'three');
  });

  skip('interruption demo, late interruption', async function (assert) {
    await visit('/transitions/primitives');
    classFound(assert, 'one');
    click('#interrupted-fade-demo a', 'Two');
    later(function () {
      isPartiallyOpaque(assert, '.two');
      click('#interrupted-fade-demo a', 'Three');
      later(function () {
        isTransparent(assert, '.one');
        isTransparent(assert, '.two');
        isPartiallyOpaque(assert, '.three');
      }, 100);
    }, 150);
    classFound(assert, 'three');
  });

  skip('interruption demo, two late interruptions', async function (assert) {
    await visit('/transitions/primitives');
    classFound(assert, 'one');
    click('#interrupted-fade-demo a', 'Two');
    later(function () {
      isPartiallyOpaque(assert, '.two');
      click('#interrupted-fade-demo a', 'Three');
      later(function () {
        isPartiallyOpaque(assert, '.three');
        click('#interrupted-fade-demo a', 'One');
        later(function () {
          isTransparent(assert, '.three');
          isTransparent(assert, '.two');
          isPartiallyOpaque(assert, '.one');
        }, 100);
      }, 100);
    }, 150);
    classFound(assert, 'one');
  });

  test('explode demo 1', async function (assert) {
    await visit('/transitions/explode');
    let welcome = [...document.querySelectorAll('h3')].find(
      (elt) => elt.textContent.trim() === 'Welcome'
    );
    assert.ok(welcome, 'first state');
    await click(
      [...document.querySelectorAll('button')].find(
        (elt) => elt.textContent.trim() === 'Toggle Detail View'
      )
    );
    let detail = [...document.querySelectorAll('h3')].find(
      (elt) => elt.textContent.trim() === 'Details'
    );
    assert.ok(detail, 'second state');
    assert.ranTransition('explode');
  });

  test('explode demo 2', async function (assert) {
    let ids;
    await visit('/transitions/explode');
    ids = [...document.querySelectorAll('#explode-demo-2 img')].map(
      (elt) => elt.dataset.photoId
    );
    await click(
      [...document.querySelectorAll('button')].find(
        (elt) => elt.textContent.trim() === 'Shuffle'
      )
    );
    let newIds = [...document.querySelectorAll('#explode-demo-2 img')].map(
      (elt) => elt.dataset.photoId
    );
    assert.notDeepEqual(ids, newIds);
    assert.deepEqual(ids.sort(), newIds.sort());
    assert.ranTransition('explode');
  });
});

function isPartiallyOpaque(assert, selector) {
  let opacity = parseFloat(
    getComputedStyle(document.querySelector(selector).parentElement)['opacity']
  );
  assert.ok(
    opacity > 0 && opacity < 1,
    `${selector} opacity: ${opacity} should be partially opaque`
  );
}

function isTransparent(assert, selector) {
  let opacity = parseFloat(
    getComputedStyle(document.querySelector(selector).parentElement)['opacity']
  );
  assert.ok(opacity === 0, `${selector} opacity: ${opacity} should be 0`);
}

function isHidden(assert, selector) {
  assert.strictEqual(
    getComputedStyle(document.querySelector(selector).parentElement)[
      'visibility'
    ],
    'hidden',
    `${selector} hidden`
  );
}
