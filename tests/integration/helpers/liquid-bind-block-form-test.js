import { resolve } from 'rsvp';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import { settled } from '@ember/test-helpers';

module('Integration: liquid-bind block form', function (hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function (assert) {
    let done = assert.async();
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  });

  test('it should render', async function (assert) {
    this.set('title', 'Mr');
    this.set('person', 'Tom');
    await render(
      hbs`{{#liquid-bind this.person as |p|}}{{this.title}}:{{p}}{{/liquid-bind}}`
    );
    assert.dom().hasText('Mr:Tom');
  });

  test('it should update', async function (assert) {
    this.set('person', 'Tom');
    await render(
      hbs`{{#liquid-bind this.person as |p|}}A{{p}}B{{/liquid-bind}}`
    );
    this.set('person', 'Yehua');
    assert.dom().hasText('AYehuaB');
  });

  test('it should support element id', async function (assert) {
    await render(
      hbs`{{#liquid-bind this.foo containerId="foo" as |bar|}} {{/liquid-bind}}`
    );
    assert
      .dom('.liquid-container#foo')
      .exists({ count: 1 }, 'found element by id');
  });

  test('it should animate after initially rendering empty', async function (assert) {
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    let dummyAnimation = function () {
      return resolve();
    };
    tmap.map(function () {
      this.transition(this.inHelper('liquid-bind'), this.use(dummyAnimation));
    });
    sinon.spy(tmap, 'transitionFor');
    await render(hbs`{{#liquid-bind this.foo as |bar|}} {{/liquid-bind}}`);
    assert.dom('.liquid-child').exists({ count: 1 }, 'initial child');
    assert.ok(tmap.transitionFor.calledOnce, 'initial transition');
    assert.notEqual(
      tmap.transitionFor.lastCall.returnValue.animation.handler,
      dummyAnimation
    );
    this.set('foo', 'hi');
    await settled();
    assert.dom('.liquid-child').exists({ count: 1 }, 'child rendered');
    assert.ok(tmap.transitionFor.calledTwice, 'second transition');
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.handler,
      dummyAnimation
    );
  });

  test('should support containerless mode', async function (assert) {
    this.set('foo', 'Hi');
    await render(
      hbs`<div data-test-target>{{#liquid-bind this.foo containerless=true as |bar| }}{{this.foo}}{{/liquid-bind}}</div>`
    );
    assert.dom('.liquid-container').doesNotExist('no container');
    assert
      .dom('[data-test-target ]> .liquid-child')
      .exists({ count: 1 }, 'direct liquid child');
  });

  test('should support `class` in containerless mode', async function (assert) {
    this.set('foo', 'Hi');
    await render(
      hbs`<div data-test-target>{{#liquid-bind this.foo class="bar" containerless=true as |bar| }}{{this.foo}}{{/liquid-bind}}</div>`
    );
    assert
      .dom('[data-test-target] > .liquid-child.bar')
      .exists({ count: 1 }, 'direct liquid child');
  });
});
