import { run } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import Component from '@glimmer/component';
import { hbs } from 'ember-cli-htmlbars';
import { ensureSafeComponent } from '@embroider/util';
import { setComponentTemplate } from '@ember/component';

let sample, tmap, animationStarted;

module('Integration | Component | liquid sync', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    tmap = this.owner.lookup('service:liquid-fire-transitions');

    this.Sample = ensureSafeComponent(
      setComponentTemplate(
        hbs`<div class="sample">Sample</div>`,
        class CustomComponent extends Component {
          constructor() {
            super(...arguments);
            sample = this;
          }

          ready() {
            return this.args.ready();
          }
        },
      ),
      this,
    );

    animationStarted = false;
    this.owner.register('transition:spy', function () {
      animationStarted = true;
      return EmberPromise.resolve();
    });
  });

  test('it causes the transition to wait', async function (assert) {
    await render(hbs`
      {{#liquid-if predicate=this.activated use="spy"}}
        <LiquidSync as |sync|>
          <this.Sample @ready={{sync}} />
        </LiquidSync>
      {{else}}
        <div class="off">Off</div>
      {{/liquid-if}}
    `);

    assert.dom('.off').exists({ count: 1 }, 'Initially showing off');
    assert.dom('.sample').doesNotExist('Initially not showing sample');

    this.set('activated', true);

    assert.false(animationStarted, 'No animation yet');
    assert.dom('.off').exists({ count: 1 }, 'Found Off');
    assert.dom('.sample').exists({ count: 1 }, 'Found sample');

    run(() => sample.ready());

    await settled();

    assert.true(animationStarted, 'Animation started');
    return tmap.waitUntilIdle().then(() => {
      assert.dom('.sample').exists({ count: 1 }, 'Found sample');
      assert.dom('.off').doesNotExist('Off is gone');
    });
  });

  test('transition moves on if component is destroyed', async function (assert) {
    await render(hbs`
      {{#liquid-if predicate=this.activated use="spy"}}
        {{#if this.innerThing}}
           <div class="alt">Alt</div>
        {{else}}
          <LiquidSync as |sync|>
            <this.Sample @ready={{sync}} />
          </LiquidSync>
        {{/if}}
      {{else}}
        <div class="off">Off</div>
      {{/liquid-if}}
    `);

    assert.dom('.off').exists({ count: 1 }, 'Initially showing off');
    assert.dom('.sample').doesNotExist('Initially not showing sample');

    this.set('activated', true);

    assert.false(animationStarted, 'No animation yet');
    assert.dom('.off').exists({ count: 1 }, 'Found Off');
    assert.dom('.sample').exists({ count: 1 }, 'Found sample');

    this.set('innerThing', true);

    await settled();

    assert.true(animationStarted, 'Animation started');
    return tmap.waitUntilIdle().then(() => {
      assert.dom('.alt').exists({ count: 1 }, 'Found alt');
      assert.dom('.off').doesNotExist('Off is gone');
    });
  });

  test('it considers liquid-fire non-idle when waiting for liquid-sync to resolve', async function (assert) {
    await render(hbs`
      {{#liquid-if predicate=this.activated use="spy"}}
        <LiquidSync as |sync|>
          <this.Sample @ready={{sync}} />
        </LiquidSync>
      {{else}}
        <div class="off">Off</div>
      {{/liquid-if}}
    `);

    this.set('activated', true);

    assert.false(animationStarted, 'No animation yet');
    assert.ok(tmap.runningTransitions() > 0, "Isn't idle");
    run(() => sample.ready());
  });
});
