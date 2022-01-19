import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import { testingKick } from 'liquid-fire/mutation-observer';
import LiquidSpacer from 'liquid-fire/components/liquid-spacer';
import sinon from 'sinon';
import { hbs } from 'ember-cli-htmlbars';
import { ensureSafeComponent } from '@embroider/util';

let tmap;

module('Integration: liquid-spacer', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    tmap = this.owner.lookup('service:liquid-fire-transitions');
  });

  hooks.afterEach(function () {
    tmap = null;
  });

  test('it should animate', async function (assert) {
    assert.expect(1);

    let theSpacer;
    this.spacer = ensureSafeComponent(
      LiquidSpacer.extend({
        didInsertElement() {
          this._super(...arguments);
          theSpacer = this;
        },
      }),
      this
    );

    this.set('message', longMessage);
    await render(hbs`
                 <div style="width: 20em">
                 <this.spacer @id="my-spacer" @growDuration={{1}}>
                   {{this.message}}
                </this.spacer>
                 </div>
                `);

    sinon.spy(theSpacer, 'animateGrowth');
    this.set('message', shortMessage);
    testingKick();
    return tmap.waitUntilIdle().then(() => {
      let [, have, want] = theSpacer.animateGrowth.lastCall.args;
      assert.ok(
        want.height < have.height,
        `expected ${want.height} < ${have.height}`
      );
    });
  });

  ['content-box', 'border-box'].forEach(function (boxSizing) {
    test(`it should maintain size stability (${boxSizing})`, async function (assert) {
      this.set('message', longMessage);
      this.set('boxSizing', boxSizing);
      this.set('toggle', () => {
        if (this.message === longMessage) {
          this.set('message', shortMessage);
        } else {
          this.set('message', longMessage);
        }
      });
      await render(hbs`
                 <button {{action this.toggle}}>Toggle</button>
                 <style>
                  #my-spacer {
                    padding: 2px;
                    margin: 4px;
                    border: 1px solid black;
                    box-sizing: {{this.boxSizing}};
                 }
                 </style>
                 <div style="width: 20em">
                 {{#liquid-spacer id="my-spacer" growDuration=1 }}
                   {{this.message}}
                 {{/liquid-spacer}}
                 </div>
                 `);

      let initialWidth = this.element.querySelector('#my-spacer').offsetWidth;
      let initialHeight = this.element.querySelector('#my-spacer').offsetHeight;
      this.set('message', shortMessage);
      testingKick();
      await tmap.waitUntilIdle();
      this.set('message', longMessage);
      testingKick();
      await tmap.waitUntilIdle();
      assert.strictEqual(
        this.element.querySelector('#my-spacer').offsetWidth,
        initialWidth,
        'width'
      );
      assert.strictEqual(
        this.element.querySelector('#my-spacer').offsetHeight,
        initialHeight,
        'height'
      );
    });
  });

  test('it should not set width style if growWidth is false', async function (assert) {
    assert.expect(2);

    await render(hbs`
                 {{#liquid-spacer id="my-spacer" growWidth=false}}
                   Hi.
                 {{/liquid-spacer}}
                `);

    let style = findAll('#my-spacer')[0].style;

    assert.strictEqual(style.width, '', 'width style is unset');
    assert.ok(
      /^\d+px$/.test(style.height),
      'height style is set to ' + style.height
    );
  });

  test('it should not set height style if growHeight is false', async function (assert) {
    assert.expect(2);

    await render(hbs`
                 {{#liquid-spacer id="my-spacer" growHeight=false}}
                   Hi.
                 {{/liquid-spacer}}
                `);

    let style = findAll('#my-spacer')[0].style;

    assert.strictEqual(style.height, '', 'height style is unset');
    assert.ok(
      /^\d+px$/.test(style.width),
      'width style is set to ' + style.width
    );
  });

  test('it should set correct height when scaled', async function (assert) {
    assert.expect(1);

    await render(hbs`
                 <div style="transform: scale(0.5);">
                   {{#liquid-spacer id="my-spacer"}}
                     <div style="width:50px; height:50px; background-color:blue;"></div>
                   {{/liquid-spacer}}
                 </div>
                `);

    let style = findAll('#my-spacer')[0].style;

    let expectedHeight = 50;
    let height = parseFloat(style.height, 10);
    let tolerance = 0.1;
    assert.ok(
      Math.abs(height - expectedHeight) < tolerance,
      `height (${height}) is within ${tolerance} pixels of ${expectedHeight}`
    );
  });

  const shortMessage = 'Hi.';
  const longMessage =
    'This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. ';
});
