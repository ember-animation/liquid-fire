import { resolve } from 'rsvp';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import sinon from 'sinon';
import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';
import { modifier } from 'ember-modifier';

module('Integration: liquid-bind', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function (assert) {
    const done = assert.async();
    const tmap = this.owner.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  });

  test('it should render', async function (assert) {
    this.set('name', 'Tomster');
    await render(hbs`

        <span>Hello {{this.name}}</span>
    `);

    assert.dom('span').hasText('Hello Tomster');
    this.set('name', 'Edster');
    assert.dom('span').hasText('Hello Edster');
  });

  test('it should support a static class name', async function (assert) {
    this.set('name', 'unicorn');
    await render(hbs`<LiquidBind @value={{this.name}} @class="magical" />`);
    assert
      .dom('.liquid-container.magical')
      .exists({ count: 1 }, 'found static class');
  });

  test('it should support a dynamic class name', async function (assert) {
    this.set('name', 'unicorn');
    this.set('power', 'rainbow');
    await render(
      hbs`<LiquidBind @value={{this.name}} @class={{this.power}} />`,
    );
    assert
      .dom('.liquid-container.rainbow')
      .exists({ count: 1 }, 'found dynamic class');
  });

  test('it should update a dynamic class name', async function (assert) {
    this.set('name', 'unicorn');
    this.set('power', 'rainbow');
    await render(
      hbs`<LiquidBind @value={{this.name}} @class={{this.power}} />`,
    );
    this.set('power', 'sparkle');
    assert
      .dom('.liquid-container.sparkle')
      .exists({ count: 1 }, 'found updated class');
  });

  test('it should support element id', async function (assert) {
    await render(
      hbs`<LiquidBind @value={{this.something}} @containerId="foo" />`,
    );
    assert
      .dom('.liquid-container#foo')
      .exists({ count: 1 }, 'found element by id');
  });

  test('it should support `use` option with a name', async function (assert) {
    const tmap = this.owner.lookup('service:liquid-fire-transitions');
    sinon.spy(tmap, 'transitionFor');
    this.set('name', 'unicorn');
    await render(hbs`<LiquidBind @value={{this.name}} @use="fade" />`);
    this.set('name', 'other');
    await settled();
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.name,
      'fade',
    );
  });

  test('it should support `use` option with a function', async function (assert) {
    const transition = sinon.stub().returns(resolve());
    this.set('transition', transition);
    this.set('name', 'unicorn');
    await render(
      hbs`<LiquidBind @value={{this.name}} @use={{this.transition}} />`,
    );
    this.set('name', 'other');
    await settled();
    assert.ok(transition.called, 'expected my custom transition to be called');
  });

  test('it should support locally-scoped `rules`', async function (assert) {
    const transitionA = sinon.stub().returns(resolve());
    const transitionB = sinon.stub().returns(resolve());
    this.set('rules', function () {
      this.transition(
        this.toValue('other'),
        this.use(transitionA),
        this.reverse(transitionB),
      );
    });
    this.set('name', 'unicorn');
    await render(
      hbs`<LiquidBind @value={{this.name}} @rules={{this.rules}} />`,
    );
    this.set('name', 'other');
    await settled();
    assert.ok(transitionA.called, 'expected transitionA to run');
    assert.ok(transitionB.notCalled, 'expected transitionB to not run');
    transitionA.reset();
    transitionB.reset();
    this.set('name', 'unicorn');
    await settled();
    assert.ok(transitionB.called, 'expected transitionB to run on second set');
    assert.ok(
      transitionA.notCalled,
      'expected transitionA to not run on second set',
    );
  });

  test('if should match correct helper name', async function (assert) {
    const tmap = this.owner.lookup('service:liquid-fire-transitions');
    const dummyAnimation = function () {
      return resolve();
    };
    tmap.map(function () {
      this.transition(this.inHelper('liquid-bind'), this.use(dummyAnimation));
    });
    sinon.spy(tmap, 'transitionFor');
    await render(hbs`<LiquidBind @value={{this.foo}} />`);
    this.set('foo', 'bar');
    await settled();
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.handler,
      dummyAnimation,
    );
  });

  test('should render child even when false', async function (assert) {
    await render(hbs`<LiquidBind @value={{this.foo}} />`);
    assert.dom('.liquid-child').exists({ count: 1 });
  });

  test('should support containerless mode', async function (assert) {
    this.setup = modifier((element) => {
      this.containerElement = element;
    });
    await render(
      hbs`<div data-test-target {{this.setup}}><LiquidBind @value={{this.foo}} @containerless={{true}} @containerElement={{this.containerElement}} /></div>`,
    );
    assert.dom('.liquid-container').doesNotExist('no container');
    assert
      .dom('[data-test-target] > .liquid-child')
      .exists({ count: 1 }, 'direct liquid child');
  });

  test('should support `class` on liquid-children in containerless mode', async function (assert) {
    this.setup = modifier((element) => {
      this.containerElement = element;
    });
    await render(
      hbs`<div data-test-target {{this.setup}}><LiquidBind @value={{this.foo}} @class="bar" @containerless={{true}} @containerElement={{this.containerElement}} /></div>`,
    );
    assert.dom('.liquid-container').doesNotExist('no container');
    assert
      .dom('[data-test-target] > .liquid-child.bar')
      .exists({ count: 1 }, 'direct liquid with class');
  });
});
