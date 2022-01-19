import { resolve } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import sinon from 'sinon';
import { hbs } from 'ember-cli-htmlbars';

module('Integration: liquid-if', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function (assert) {
    let done = assert.async();
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  });

  test('it should render', async function (assert) {
    this.set('person', 'Tom');
    await render(hbs`
      {{#liquid-if this.isReady}}
        {{this.person}} is ready
      {{else}}
        {{this.person}} is not ready
      {{/liquid-if}}
    `); // }}`)

    assert.dom().hasText('Tom is not ready');
    this.set('person', 'Yehuda');
    assert.dom().hasText('Yehuda is not ready');
    this.set('isReady', true);
    assert.dom().hasText('Yehuda is ready');
  });

  test('it should work without else block', async function (assert) {
    await render(hbs`{{#liquid-if this.isReady}}Hi{{/liquid-if}}`);
    assert.dom('.liquid-child').doesNotExist();
    this.set('isReady', true);
    assert.dom('.liquid-child').exists({ count: 1 });
    assert.dom().hasText('Hi');
  });

  test('it should support static class name', async function (assert) {
    await render(hbs`{{#liquid-if this.isReady class="foo"}}hi{{/liquid-if}}`);
    assert.dom('.liquid-container.foo').exists({ count: 1 }, 'found class foo');
  });

  test('it should support dynamic class name', async function (assert) {
    this.set('foo', 'bar');
    await render(
      hbs`{{#liquid-if this.isReady class=this.foo}}hi{{/liquid-if}}`
    );
    assert.dom('.liquid-container.bar').exists({ count: 1 }, 'found class bar');
  });

  test('it should update dynamic class name', async function (assert) {
    this.set('foo', 'bar');
    await render(
      hbs`{{#liquid-if this.isReady class=this.foo}}hi{{/liquid-if}}`
    );
    this.set('foo', 'bar2');
    assert
      .dom('.liquid-container.bar2')
      .exists({ count: 1 }, 'found class bar2');
  });

  test('it should support element id', async function (assert) {
    await render(
      hbs`{{#liquid-if this.isReady containerId="foo"}}hi{{/liquid-if}}`
    );
    assert
      .dom('.liquid-container#foo')
      .exists({ count: 1 }, 'found element by id');
  });

  test('it should support liquid-unless', async function (assert) {
    this.set('isReady', true);
    await render(
      hbs`{{#liquid-unless this.isReady}}A{{else}}B{{/liquid-unless}}`
    );
    assert.dom().hasText('B');
    this.set('isReady', false);
    assert.dom().hasText('A');
  });

  test('liquid-unless should have no content when true and there is no else block', async function (assert) {
    this.set('isReady', true);
    await render(hbs`{{#liquid-unless this.isReady }}hi{{/liquid-unless}}`);
    assert.dom('.liquid-container').exists({ count: 1 }, 'have container');
    assert.dom('.liquid-child').doesNotExist('no child');
  });

  test('liquid-unless should have no content when true and there is no else block in containerless mode', async function (assert) {
    this.set('isReady', true);
    await render(
      hbs`{{#liquid-unless this.isReady containerless=true }}hi{{/liquid-unless}}`
    );
    assert.dom('.liquid-container').doesNotExist('no container');
    assert.dom('.liquid-child').doesNotExist('no child');
  });

  test('liquid-if should match correct helper name', async function (assert) {
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    let dummyAnimation = function () {
      return resolve();
    };
    tmap.map(function () {
      this.transition(this.inHelper('liquid-if'), this.use(dummyAnimation));
    });
    sinon.spy(tmap, 'transitionFor');
    await render(hbs`{{#liquid-if this.isReady}}A{{else}}B{{/liquid-if}}`);
    this.set('isReady', true);
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.handler,
      dummyAnimation
    );
  });

  test('liquid-unless should match correct helper name', async function (assert) {
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    let dummyAnimation = function () {
      return resolve();
    };
    tmap.map(function () {
      this.transition(this.inHelper('liquid-unless'), this.use(dummyAnimation));
    });
    sinon.spy(tmap, 'transitionFor');
    await render(
      hbs`{{#liquid-unless this.isReady}}A{{else}}B{{/liquid-unless}}`
    );
    this.set('isReady', true);
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.handler,
      dummyAnimation
    );
  });

  test('it should have no content when false and there is no else block', async function (assert) {
    await render(hbs`{{#liquid-if this.isReady }}hi{{/liquid-if}}`);
    assert.dom('.liquid-container').exists({ count: 1 }, 'have container');
    assert.dom('.liquid-child').doesNotExist('no child');
  });

  test('it should have no content when false and there is no else block in containerless mode', async function (assert) {
    await render(
      hbs`{{#liquid-if this.isReady containerless=true }}hi{{/liquid-if}}`
    );
    assert.dom('.liquid-container').doesNotExist('no container');
    assert.dom('.liquid-child').doesNotExist('no child');
  });

  test('it should support containerless mode', async function (assert) {
    this.set('isReady', true);
    await render(
      hbs`<div data-test-target> {{#liquid-if this.isReady containerless=true}}hi{{/liquid-if}}</div>`
    );
    assert.dom('.liquid-container').doesNotExist('no container');
    assert
      .dom('[data-test-target] > .liquid-child')
      .exists({ count: 1 }, 'direct child');
    assert.dom('[data-test-target] > .liquid-child').hasText('hi');
  });

  test('should support `class` on liquid-children in containerless mode', async function (assert) {
    this.set('isReady', true);
    await render(
      hbs`<div data-test-target>{{#liquid-if this.isReady class="bar" containerless=true}}hi{{/liquid-if}}</div>`
    );
    assert
      .dom('[data-test-target] > .liquid-child.bar')
      .exists({ count: 1 }, 'child with class');
  });

  test('it should support locally-scoped `rules`', async function (assert) {
    let transitionA = sinon.stub().returns(resolve());
    let transitionB = sinon.stub().returns(resolve());
    this.set('rules', function () {
      this.transition(
        this.toValue(true),
        this.use(transitionA),
        this.reverse(transitionB)
      );
    });
    this.set('predicate', false);
    await render(
      hbs`{{#liquid-if this.predicate rules=this.rules}}hi{{/liquid-if}}`
    );
    this.set('predicate', true);
    assert.ok(transitionA.called, 'expected transitionA to run');
    assert.ok(transitionB.notCalled, 'expected transitionB to not run');
    transitionA.reset();
    transitionB.reset();
    this.set('predicate', false);
    assert.ok(transitionB.called, 'expected transitionB to run on second set');
    assert.ok(
      transitionA.notCalled,
      'expected transitionA to not run on second set'
    );
  });
});
