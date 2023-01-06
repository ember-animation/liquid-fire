import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ensureSafeComponent } from '@embroider/util';
import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';

let tmap;

module('Integration: fly-to transition', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.aftrEach = function () {
      tmap = null;

      // TODO: our tests don't pass when we're inside a transformed
      // element. I think this is a legit bug in the implementation that
      // we should fix.
      document.querySelector('#ember-testing').style.transform = '';
    };
  });

  hooks.beforeEach(function () {
    tmap = this.owner.lookup('service:liquid-fire-transitions');

    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    document.querySelector('#ember-testing').style.transform = 'none';
  });

  ['border-box', 'content-box'].forEach(function (boxSizing) {
    test(`it avoids a jump at end of animation, with absolutely positioned elements (${boxSizing})`, async function (assert) {
      assert.expect(6);
      tmap.map(function () {
        this.transition(
          this.hasClass('fly-to-test'),
          this.use('explode', {
            pickOld: '.redbox',
            pickNew: '.bluebox',
            use: function () {
              // sanity checks
              assert.true(!!this.oldElement, 'found old element');
              assert.true(!!this.newElement, 'found new element');
              assert.strictEqual(
                getComputedStyle(this.oldElement).backgroundColor,
                'rgb(255, 0, 0)'
              );

              return this.lookup('fly-to')
                .call(this, { duration: 0 })
                .then(() => {
                  assert.deepEqual(
                    getOffset(this.newElement),
                    getOffset(this.oldElement),
                    "element didn't jump"
                  );
                  assert.strictEqual(
                    this.newElement.offsetWidth,
                    this.oldElement.offsetWidth,
                    'same width'
                  );
                  assert.strictEqual(
                    this.newElement.offsetHeight,
                    this.oldElement.offsetHeight,
                    'same height'
                  );
                });
            },
          })
        );
      });

      this.set('boxSizing', boxSizing);
      this.styles = ensureSafeComponent(stylesheet(), this);
      await render(hbs`
                  <this.styles @boxSizing={{this.boxSizing}} />
                  {{#liquid-if this.showBlue class="fly-to-test"}}
                  <div class="bluebox"></div>
                  {{else}}
                  <div class="redbox"></div>
                  {{/liquid-if}}
                  `);

      this.set('showBlue', true);
      await tmap.waitUntilIdle();
    });

    test(`it avoids a jump at end of animation, with statically positioned elements (${boxSizing})`, async function (assert) {
      assert.expect(6);
      tmap.map(function () {
        this.transition(
          this.hasClass('fly-to-test'),
          this.use('explode', {
            pickOld: '.greenbox',
            pickNew: '.yellowbox',
            use: function () {
              // sanity checks
              assert.true(!!this.oldElement, 'found old element');
              assert.true(!!this.newElement, 'found new element');
              assert.strictEqual(
                getComputedStyle(this.oldElement).backgroundColor,
                'rgb(0, 128, 0)'
              );

              return this.lookup('fly-to')
                .call(this, { duration: 0 })
                .then(() => {
                  assert.deepEqual(
                    getOffset(this.newElement),
                    getOffset(this.oldElement),
                    "element didn't jump"
                  );
                  assert.strictEqual(
                    this.newElement.offsetWidth,
                    this.oldElement.offsetWidth,
                    'same width'
                  );
                  assert.strictEqual(
                    this.newElement.offsetHeight,
                    this.oldElement.offsetHeight,
                    'same height'
                  );
                });
            },
          })
        );
      });
      this.set('boxSizing', boxSizing);
      this.styles = ensureSafeComponent(stylesheet(), this);
      await render(hbs`
                  <this.styles @boxSizing={{this.boxSizing}} />
                  {{#liquid-if this.showYellow class="fly-to-test"}}
                  <div class="yellowbox"></div>
                  {{else}}
                  <div class="greenbox"></div>
                  {{/liquid-if}}
                  `);

      this.set('showYellow', true);
      await tmap.waitUntilIdle();
    });
  });

  function getOffset(ele) {
    const rect = ele.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
  }

  function stylesheet() {
    return setComponentTemplate(
      hbs`
      <style>
      .fly-to-test {
        width: 600px;
        height: 400px;
        padding: 7px;
      }
      .bluebox {
        background-color: blue;
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 25px;
        padding: 2px;
        margin: 4px;
        border: 1px solid black;
        box-sizing: {{this.boxSizing}};
      }
      .redbox {
        background-color: red;
        position: absolute;
        top: 200;
        left: 100;
        width: 25px;
        height: 30px;
        padding: 4px;
        margin: 6px;
        border: 2px solid black;
        box-sizing: {{this.boxSizing}};
      }
      .yellowbox {
        background-color: yellow;
        margin-top: 1px;
        margin-left: 1px;
        width: 20px;
        height: 25px;
        padding: 2px;
        border: 1px solid black;
        box-sizing: {{this.boxSizing}};
      }
      .greenbox {
        background-color: green;
        margin-top: 200px;
        margin-left: 100px;
        width: 25px;
        height: 30px;
        padding: 4px;
        border: 2px solid black;
        box-sizing: {{this.boxSizing}};
      }
                </style>

      `,
      templateOnlyComponent()
    );
  }
});
