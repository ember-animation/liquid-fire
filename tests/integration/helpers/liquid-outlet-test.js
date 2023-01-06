import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import { macroCondition, dependencySatisfies } from '@embroider/macros';
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
    let done = assert.async();
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(done);
  });

  test('it should render when state is set after insertion', async function (assert) {
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>{{liquid-outlet}}</this.SetRoute>`
    );
    this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
    assert.dom('h1').exists({ count: 1 });
  });

  test('it should render when state is set before insertion', async function (assert) {
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>A{{outlet}}B</this.SetRoute>`
    );
    let hello = this.makeRoute({ template: hbs`Hello{{liquid-outlet}}` });
    this.setState(hello);
    assert.dom().hasText('AHelloB');
    hello.setChild('main', { template: hbs`Goodbye` });
    this.setState(hello);
    assert.dom().hasText('AHelloGoodbyeB');
  });

  if (macroCondition(dependencySatisfies('ember-source', '<=3.26.0'))) {
    test('it should support an optional name', async function (assert) {
      await render(
        hbs`<this.SetRoute @outletState={{this.outletState}}>A{{outlet}}B</this.SetRoute>`
      );
      let hello = this.makeRoute({
        template: hbs`Hello{{liquid-outlet "other"}}`,
      });
      this.setState(hello);
      assert.dom().hasText('AHelloB');
      hello.setChild('other', { template: hbs`Goodbye` });
      this.setState(hello);
      assert.dom().hasText('AHelloGoodbyeB');
    });
  }

  test('it should support static class', async function (assert) {
    await render(hbs`{{liquid-outlet class="magical"}}`);
    assert
      .dom('.liquid-container.magical')
      .exists({ count: 1 }, 'found static class');
  });

  test('it should support dynamic class', async function (assert) {
    this.set('power', 'sparkly');
    await render(hbs`{{liquid-outlet class=this.power}}`);
    assert
      .dom('.liquid-container.sparkly')
      .exists({ count: 1 }, 'found dynamic class');
  });

  test('it should support element id', async function (assert) {
    await render(hbs`{{liquid-outlet containerId="foo"}}`);
    assert
      .dom('.liquid-container#foo')
      .exists({ count: 1 }, 'found element by id');
  });

  test('it should support `use` option', async function (assert) {
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    sinon.spy(tmap, 'transitionFor');
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>{{outlet}}</this.SetRoute>`
    );
    let routerState = this.makeRoute({
      template: hbs`{{liquid-outlet use="fade"}}`,
    });
    routerState.setChild('main', { template: hbs`hi` });
    this.setState(routerState);
    routerState.setChild('main', { template: hbs`byte` });
    this.setState(routerState);
    assert.ok(tmap.transitionFor.called, 'transitionFor should be called');
    assert.strictEqual(
      tmap.transitionFor.lastCall.returnValue.animation.name,
      'fade'
    );
    //return tmap.waitUntilIdle();
  });

  test('should support containerless mode', async function (assert) {
    await render(
      hbs`<div data-test-target><this.SetRoute @outletState={{this.outletState}}>{{liquid-outlet containerless=true}}</this.SetRoute></div>`
    );
    this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
    assert.dom('.liquid-container').doesNotExist('no container');
    assert
      .dom('[data-test-target] > .liquid-child')
      .exists({ count: 1 }, 'direct liquid child');
  });

  test('should support `class` on children in containerless mode', async function (assert) {
    await render(
      hbs`<div data-test-target><this.SetRoute @outletState={{this.outletState}}>{{liquid-outlet class="bar" containerless=true}}</this.SetRoute></div>`
    );
    this.setState(this.makeRoute({ template: hbs`<h1>Hello world</h1>` }));
    assert
      .dom('[data-test-target] > .liquid-child.bar')
      .exists({ count: 1 }, 'child class');
  });

  test('can see model-to-model transitions on the same route', async function (assert) {
    let controller = this.owner.lookup('controller:application');
    controller.set(
      'model',
      EmberObject.create({
        id: 1,
      })
    );
    let state = this.makeRoute({
      template: hbs`'<div class="content">{{this.model.id}}</div>`,
      controller,
    });
    let tmap = this.owner.lookup('service:liquid-fire-transitions');
    sinon.spy(tmap, 'transitionFor');
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>{{liquid-outlet watchModels=true }}</this.SetRoute>`
    );
    this.setState(state);
    assert.dom('.content').hasText('1');
    tmap.transitionFor.resetHistory();
    run(() => {
      controller.set(
        'model',
        EmberObject.create({
          id: 2,
        })
      );
    });
    this.setState(state);
    assert.dom('.content').hasText('2');
    assert.ok(tmap.transitionFor.called, 'transitionFor called');
  });

  test('tolerates empty content when parent outlet is stable', async function (assert) {
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>A{{liquid-outlet}}B</this.SetRoute>`
    );

    let state = this.makeRoute({
      template: hbs`C{{liquid-outlet}}DE`,
    });

    this.setState(state);
    assert.dom().hasText('ACDEB');
    state.setChild('main', { template: hbs`foo` });
    this.setState(state);
    assert.dom().hasText('ACfooDEB');
  });

  test('outlets inside {{liquid-bind}}', async function (assert) {
    this.set('thing', 'Goodbye');
    this.setState(this.makeRoute({ template: hbs`Hello` }));
    await render(
      hbs`<this.SetRoute @outletState={{this.outletState}}>{{#liquid-bind this.thing as |thingVersion|}}{{thingVersion}}{{outlet}}{{/liquid-bind}}</this.SetRoute>`
    );
    assert.dom().hasText('GoodbyeHello');
    this.set('thing', 'Other');
    this.setState(this.makeRoute({ template: hbs`Purple` }));
    assert.dom().hasText('OtherPurple');
  });
});
