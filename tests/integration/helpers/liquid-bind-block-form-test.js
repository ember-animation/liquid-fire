import { resolve } from 'rsvp';
import Ember from "ember";
import { setupRenderingTest } from "ember-qunit";
import { render, findAll, find } from '@ember/test-helpers';
import { module, skip, test } from "qunit";
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration: liquid-bind block form', function(hooks) {
  setupRenderingTest(hooks);

  hooks.afterEach(function(assert) {
    let done = assert.async();
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  });

  test('it should render', async function(assert) {
    this.set('title', 'Mr');
    this.set('person', 'Tom');
    await render(hbs`{{#liquid-bind person as |p|}}{{title}}:{{p}}{{/liquid-bind}}`);
    assert.dom('*').hasText('Mr:Tom');
  });

  test('it should update', async function(assert) {
    this.set('person', 'Tom');
    await render(hbs`{{#liquid-bind person as |p|}}A{{p}}B{{/liquid-bind}}`);
    this.set('person', 'Yehua');
    assert.dom('*').hasText('AYehuaB');
  });

  test('it should support element id', async function(assert) {
    await render(hbs`{{#liquid-bind foo containerId="foo" as |bar|}} {{/liquid-bind}}`);
    assert.dom('.liquid-container#foo').exists({ count: 1 }, "found element by id");
  });

  test('it should animate after initially rendering empty', async function(assert) {
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    let dummyAnimation = function(){ return resolve(); };
    tmap.map(function() {
      this.transition(
        this.inHelper('liquid-bind'),
        this.use(dummyAnimation)
      );
    });
    sinon.spy(tmap, 'transitionFor');
    await render(hbs`{{#liquid-bind foo as |bar|}} {{/liquid-bind}}`);
    assert.dom('.liquid-child').exists({ count: 1 }, "initial child");
    assert.ok(tmap.transitionFor.calledOnce, "initial transition");
    assert.notEqual(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
    this.set('foo', 'hi');
    assert.dom('.liquid-child').exists({ count: 1 }, "child rendered");
    assert.ok(tmap.transitionFor.calledTwice, "second transition");
    assert.equal(tmap.transitionFor.lastCall.returnValue.animation.handler, dummyAnimation);
  });

  test('should support containerless mode', async function(assert) {
    this.set('foo', 'Hi');
    await render(hbs`{{#liquid-bind foo containerless=true as |bar| }}{{foo}}{{/liquid-bind}}`);
    assert.dom('.liquid-container').doesNotExist("no container");
    assert.dom(' > .liquid-child').exists({ count: 1 }, "direct liquid child");
  });

  test('should support `class` in containerless mode', async function(assert) {
    this.set('foo', 'Hi');
    await render(hbs`{{#liquid-bind foo class="bar" containerless=true as |bar| }}{{foo}}{{/liquid-bind}}`);
    assert.dom(' > .liquid-child.bar').exists({ count: 1 }, "direct liquid child");
  });

  skip('should pass container arguments through', function(assert) {
    this.set('foo', 'Hi');
    this.render(hbs`{{#liquid-bind foo enableGrowth=false as |bar|}}{{foo}}{{/liquid-bind}}`);
    let containerElement = this.$(' > .liquid-container');
    let container = Ember.View.views[containerElement.attr('id')];
    assert.equal(container.get('enableGrowth'), false, 'liquid-container enableGrowth');
  });
});
