import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
// import { macroCondition, dependencySatisfies } from '@embroider/macros';
import { ensureSafeComponent } from '@embroider/util';
import {
  RouteBuilder,
  SetRouteComponent,
} from '../../helpers/ember-testing-internals';

module('Integration: liquid-outlet', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:route-builder', RouteBuilder);
    this.builder = this.owner.lookup('service:route-builder');
    this.SetRoute = ensureSafeComponent(SetRouteComponent, this);
    this.setState = function (routeInfo) {
      this.set('outletState', routeInfo.asTop());
    };
    this.makeRoute = function (args) {
      return this.builder.makeRoute(args);
    };
  });

  hooks.afterEach(function (assert) {
    const done = assert.async();
    const tmap = this.owner.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  });

  test('it should render when state is set after insertion', async function (assert) {
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}><LiquidOutlet /></this.SetRoute>`,
    );
    this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
    assert.dom('h1').exists({ count: 1 });
  });

  test('it should render when state is set before insertion', async function (assert) {
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>A{{outlet}}B</this.SetRoute>`,
    );
    const hello = this.makeRoute({ template: hbs`Hello<LiquidOutlet />` });
    this.setState(hello);
    assert.dom().hasText('AHelloB');
    hello.setChild('main', { template: hbs`Goodbye` });
    this.setState(hello);
    assert.dom().hasText('AHelloGoodbyeB');
  });

  test('it should support static class', async function (assert) {
    await render(hbs`<LiquidOutlet @class="magical" />`);
    assert
      .dom('.liquid-container.magical')
      .exists({ count: 1 }, 'found static class');
  });

  test('it should support dynamic class', async function (assert) {
    this.set('power', 'sparkly');
    await render(hbs`<LiquidOutlet @class={{this.power}} />`);
    assert
      .dom('.liquid-container.sparkly')
      .exists({ count: 1 }, 'found dynamic class');
  });

  test('it should support element id', async function (assert) {
    await render(hbs`<LiquidOutlet @containerId="foo" />`);
    assert
      .dom('.liquid-container#foo')
      .exists({ count: 1 }, 'found element by id');
  });

  test('it should support `use` option', async function (assert) {
    const tmap = this.owner.lookup('service:liquid-fire-transitions');
    sinon.spy(tmap, 'transitionFor');
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>{{outlet}}</this.SetRoute>`,
    );
    const routerState = this.makeRoute({
      template: hbs`<LiquidOutlet @use="fade" />`,
    });
    routerState.setChild('main', { template: hbs`hi` });
    this.setState(routerState);
    routerState.setChild('main', { template: hbs`byte` });
    this.setState(routerState);
    await settled();
    assert.ok(tmap.transitionFor.called, 'transitionFor should be called');
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.name,
      'fade',
    );
    //return tmap.waitUntilIdle();
  });

  test('should support containerless mode', async function (assert) {
    this.setup = (element) => {
      this.containerElement = element;
    };
    await render(
      hbs`<div data-test-target {{did-insert this.setup}}><this.SetRoute @outletState={{this.outletState}}><LiquidOutlet @containerless={{true}} @containerElement={{this.containerElement}} /></this.SetRoute></div>`,
    );
    this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
    await settled();
    assert.dom('.liquid-container').doesNotExist('no container');
    assert
      .dom('[data-test-target] > .liquid-child')
      .exists({ count: 1 }, 'direct liquid child');
  });

  test('should support `class` on children in containerless mode', async function (assert) {
    this.setup = (element) => {
      this.containerElement = element;
    };
    await render(
      hbs`<div data-test-target {{did-insert this.setup}}><this.SetRoute @outletState={{this.outletState}}><LiquidOutlet @class="bar" @containerless={{true}} @containerElement={{this.containerElement}} /></this.SetRoute></div>`,
    );
    this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
    await settled();
    assert
      .dom('[data-test-target] > .liquid-child.bar')
      .exists({ count: 1 }, 'child class');
  });

  test('can see model-to-model transitions on the same route', async function (assert) {
    const controller = this.owner.lookup('controller:application');
    controller.set(
      'model',
      EmberObject.create({
        id: 1,
      }),
    );
    const state = this.makeRoute({
      template: hbs`'<div class="content">{{this.model.id}}</div>`,
      controller,
    });
    const tmap = this.owner.lookup('service:liquid-fire-transitions');
    sinon.spy(tmap, 'transitionFor');
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}><LiquidOutlet @watchModels={{true}} /></this.SetRoute>`,
    );
    this.setState(state);
    assert.dom('.content').hasText('1');
    tmap.transitionFor.resetHistory();
    run(() => {
      controller.set(
        'model',
        EmberObject.create({
          id: 2,
        }),
      );
    });
    this.setState(state);
    assert.dom('.content').hasText('2');
    await settled();
    assert.ok(tmap.transitionFor.called, 'transitionFor called');
  });

  test('tolerates empty content when parent outlet is stable', async function (assert) {
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>A<LiquidOutlet />B</this.SetRoute>`,
    );

    const state = this.makeRoute({
      template: hbs`C<LiquidOutlet />DE`,
    });

    this.setState(state);
    assert.dom().hasText('ACDEB');
    state.setChild('main', { template: hbs`foo` });
    this.setState(state);
    assert.dom().hasText('ACfooDEB');
  });

  test('outlets inside <LiquidBind>', async function (assert) {
    this.set('thing', 'Goodbye');
    this.setState(this.makeRoute({ template: hbs`Hello` }));
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}><LiquidBind @value={{this.thing}} as |thingVersion|>{{thingVersion}}{{outlet}}</LiquidBind></this.SetRoute>`,
    );
    assert.dom().hasText('GoodbyeHello');
    this.set('thing', 'Other');
    this.setState(this.makeRoute({ template: hbs`Purple` }));
    await settled();
    assert.dom().hasText('OtherPurple');
  });
});
