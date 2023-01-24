import { next } from '@ember/runloop';
import { Promise as EmberPromise, resolve } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ensureSafeComponent } from '@embroider/util';
import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';

let Promise = EmberPromise;
let tmap;

module('Integration: explode transition', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    tmap = this.owner.lookup('service:liquid-fire-transitions');

    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    document.querySelector('#ember-testing').style.transform = 'none';
  });

  hooks.afterEach(function () {
    tmap = null;

    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    document.querySelector('#ember-testing').style.transform = '';
  });

  test(`it doesn't runs parts with no matching elements`, async function (assert) {
    assert.expect(0);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pick: '.nonexistent',
          use: function () {
            throw new Error('should not get here');
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.showBlue class="explode-transition-test"}}
                <div class="bluebox"></div>
                {{else}}
                <div class="redbox"></div>
                {{/liquid-if}}
                `);
    this.set('showBlue', true);
    return tmap.waitUntilIdle();
  });

  test('it matches the background', async function (assert) {
    assert.expect(2);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          use: function () {
            assert.ok(this.oldElement?.classList?.contains('liquid-child'));
            assert.ok(this.newElement?.classList?.contains('liquid-child'));
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.showBlue class="explode-transition-test"}}
                <div class="bluebox"></div>
                {{else}}
                <div class="redbox"></div>
                {{/liquid-if}}
                `);
    this.set('showBlue', true);
    return tmap.waitUntilIdle();
  });

  test('it provides default visibility control for background', async function (assert) {
    let liquidContainer;
    assert.expect(2);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pick: '.something',
          use: function () {
            return new Promise((resolve) => {
              next(() => {
                assert.strictEqual(
                  getComputedStyle(
                    liquidContainer.querySelector('.liquid-child .bluebox')
                      .parentElement
                  ).visibility,
                  'visible',
                  'new element'
                );
                assert.strictEqual(
                  getComputedStyle(
                    liquidContainer.querySelector('.liquid-child .redbox')
                      .parentElement
                  ).visibility,
                  'hidden',
                  'old element'
                );
                resolve();
              });
            });
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.showBlue class="explode-transition-test"}}
                <div class="bluebox something"></div>
                {{else}}
                <div class="redbox something"></div>
                {{/liquid-if}}
                `);
    liquidContainer = this.element.querySelector('.liquid-container');
    this.set('showBlue', true);
    return tmap.waitUntilIdle();
  });

  test('it can pick', async function (assert) {
    assert.expect(2);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pick: 'h1',
          use: function () {
            assert.strictEqual(this.oldElement?.textContent, 'Old Title');
            assert.strictEqual(this.newElement?.textContent, 'New Title');
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <h1>New Title</h1>
                {{else}}
                  <h1>Old Title</h1>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('it can use pickOld and pickNew together', async function (assert) {
    assert.expect(2);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pickOld: 'h1',
          pickNew: 'h2',
          use: function () {
            assert.strictEqual(this.oldElement?.textContent, 'Old Title');
            assert.strictEqual(this.newElement?.textContent, 'New Title');
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <h2>New Title</h2>
                {{else}}
                  <h1>Old Title</h1>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('it can pickOld by itself', async function (assert) {
    assert.expect(2);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pickOld: 'h1',
          use: function () {
            assert.strictEqual(this.oldElement?.textContent, 'Old Title');
            assert.notOk(this.newElement, 'Should be no new element');
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <h1>New Title</h1>
                {{else}}
                  <h1>Old Title</h1>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('it can pickNew by itself', async function (assert) {
    assert.expect(2);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pickNew: 'h1',
          use: function () {
            assert.strictEqual(this.newElement?.textContent, 'New Title');
            assert.notOk(this.oldElement, 'Should be no old element');
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <h1>New Title</h1>
                {{else}}
                  <h1>Old Title</h1>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('it can matchBy data attribute', async function (assert) {
    assert.expect(6);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          matchBy: 'data-model-id',
          use: function () {
            let oldText = this.oldElement && this.oldElement.textContent;
            let newText = this.newElement && this.newElement.textContent;
            assert.ok(/Old/.test(oldText), 'old text');
            assert.ok(/New/.test(newText), 'new text');
            assert.strictEqual(oldText?.slice(4), newText?.slice(4));
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <div data-model-id=1>New One</div>
                  <div data-model-id=2>New Two</div>
                {{else}}
                  <div data-model-id=1>Old One</div>
                  <div data-model-id=2>Old Two</div>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('it can matchBy data elements whose value needs quotes', async function (assert) {
    assert.expect(4);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          matchBy: 'data-model-name',
          use: function () {
            let oldText = this.oldElement && this.oldElement.textContent;
            let newText = this.newElement && this.newElement.textContent;
            assert.ok(/Old/.test(oldText), 'old text');
            assert.ok(/New/.test(newText), 'new text');
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <div data-model-name="Smith, Granny">New One</div>
                  <div data-model-name="Appleseed, Johnny's">New Two</div>
                {{else}}
                  <div data-model-name="Smith, Granny">Old One</div>
                  <div data-model-name="Appleseed, Johnny's">Old Two</div>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('matchBy only animates when both sides match', async function (assert) {
    assert.expect(0);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          matchBy: 'data-model-id',
          use: function () {
            throw new Error('should not get here');
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <div data-model-id=2>New Two</div>
                {{else}}
                  <div data-model-id=1>Old One</div>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test("elements matched in earlier pieces don't also match later pieces", async function (assert) {
    assert.expect(4);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use(
          'explode',
          {
            pick: '.early',
            use: function () {
              assert.ok(
                this.oldElement,
                'expected old element with class=early'
              );
              assert.notOk(
                this.newElement,
                'expected no new element with class=early'
              );
              return resolve();
            },
          },
          {
            pick: '.late',
            use: function () {
              assert.notOk(
                this.oldElement,
                'expected old element with class=late to already match elsewhere'
              );
              assert.ok(
                this.newElement,
                'expected new element with class=late'
              );
              return resolve();
            },
          }
        )
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <div class="late">A</div>
                {{else}}
                  <div class="early late">B</div>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test("it doesn't throw an error if no match is found", async function (assert) {
    assert.expect(1);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          matchBy: 'data-model-id',
          use: function () {
            assert.ok(true);
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <div data-model-id=1>New One</div>
                  <div data-model-id=2>New Two</div>
                {{else}}
                  <div data-model-id=1>Old One</div>
                  <div data-model-id>Old Two</div>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  test('it can matchBy id', async function (assert) {
    assert.expect(6);
    tmap.map(function () {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pickNew: '.reducedScope',
          matchBy: 'id',
          use: function () {
            let oldText = this.oldElement && this.oldElement.textContent;
            let newText = this.newElement && this.newElement.textContent;
            assert.ok(/Old/.test(oldText), 'old text');
            assert.ok(/New/.test(newText), 'new text');
            assert.strictEqual(oldText?.slice(4), newText?.slice(4));
            return resolve();
          },
        })
      );
    });
    await render(hbs`
                {{#liquid-if this.otherMode class="explode-transition-test"}}
                  <div class='reducedScope'>
                    <div id='one'>New One</div>
                    <div id='two'>New Two</div>
                  </div>
                {{else}}
                  <div id='one'>Old One</div>
                  <div id='two'>Old Two</div>
                {{/liquid-if}}
                `);
    this.set('otherMode', true);
    return tmap.waitUntilIdle();
  });

  ['border-box', 'content-box'].forEach(function (boxSizing) {
    test(`it avoids a jump at start of animation, with absolutely positioned elements (${boxSizing})`, async function (assert) {
      assert.expect(9);

      let didTransition = false;
      tmap.map(function () {
        this.transition(
          this.hasClass('explode-transition-test'),
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

              // the explode transition actually animates a copy of the
              // original oldElement, which we can still find inside a
              // liquid-child (the copy is not inside a liquid-child, that
              // is part of the point of explode).
              let realOldElement = this.oldElement.parentElement.querySelector(
                '.liquid-child .redbox'
              );
              assert.true(!!realOldElement, 'found actual old element');
              assert.strictEqual(realOldElement.style.visibility, 'hidden');
              assert.deepEqual(
                getOffset(realOldElement),
                getOffset(this.oldElement),
                "element didn't jump"
              );
              assert.strictEqual(
                realOldElement.offsetWidth,
                this.oldElement.offsetWidth,
                'same width'
              );
              assert.strictEqual(
                realOldElement.offsetHeight,
                this.oldElement.offsetHeight,
                'same height'
              );
              didTransition = true;
              return resolve();
            },
          })
        );
      });
      this.set('boxSizing', boxSizing);

      this.styles = ensureSafeComponent(stylesheet(), this);
      await render(hbs`
                  <this.styles @boxSizing={{this.boxSizing}} />
                  {{#liquid-if this.showBlue class="explode-transition-test"}}
                  <div class="bluebox"></div>
                  {{else}}
                  <div class="redbox"></div>
                  {{/liquid-if}}
                  `);

      this.set('showBlue', true);
      await tmap.waitUntilIdle();
      assert.ok(didTransition, 'didTransition');
    });

    test(`it avoids a jump at start of animation, with statically positioned elements (${boxSizing})`, async function (assert) {
      assert.expect(9);

      let didTransition = false;
      tmap.map(function () {
        this.transition(
          this.hasClass('explode-transition-test'),
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

              // the explode transition actually animates a copy of the
              // original oldElement, which we can still find inside a
              // liquid-child (the copy is not inside a liquid-child, that
              // is part of the point of explode).
              let realOldElement = this.oldElement.parentElement.querySelector(
                '.liquid-child .greenbox'
              );
              assert.true(!!realOldElement, 'found actual old element');
              assert.strictEqual(realOldElement.style.visibility, 'hidden');
              assert.deepEqual(
                getOffset(realOldElement),
                getOffset(this.oldElement),
                "element didn't jump"
              );
              assert.strictEqual(
                realOldElement.offsetWidth,
                this.oldElement.offsetWidth,
                'same width'
              );
              assert.strictEqual(
                realOldElement.offsetHeight,
                this.oldElement.offsetHeight,
                'same height'
              );
              didTransition = true;
              return resolve();
            },
          })
        );
      });
      this.set('boxSizing', boxSizing);
      this.styles = ensureSafeComponent(stylesheet(), this);
      await render(hbs`
                  <this.styles @boxSizing={{this.boxSizing}} />
                  {{#liquid-if this.showYellow class="explode-transition-test"}}
                  <div class="yellowbox"></div>
                  {{else}}
                  <div class="greenbox"></div>

                  {{/liquid-if}}
                  `);

      this.set('showYellow', true);
      await tmap.waitUntilIdle();
      assert.ok(didTransition, 'didTransition');
    });

    test('deduplicate element ids from cloned explode DOM', async function (assert) {
      // SEE: https://github.com/ember-animation/liquid-fire/issues/643
      assert.expect(2);
      tmap.map(function () {
        this.transition(
          this.hasClass('explode-transition-test'),
          this.use('explode', {
            pick: 'h1',
            use: function () {
              assert.strictEqual(
                document.querySelectorAll('#unique-parent-id').length,
                1,
                'cloned top level DOM element does not have duplicated id attribute'
              );
              assert.strictEqual(
                document.querySelectorAll('#unique-child-id').length,
                1,
                'any cloned child DOM does not have duplicate id attributes'
              );
              return resolve();
            },
          })
        );
      });
      await render(hbs`
        {{#liquid-if this.showTitleOne class="explode-transition-test"}}
          <div>
            <h1>Title 1</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio error vitae consequuntur quasi, pariatur odit ea itaque libero repudiandae dolor nam minus assumenda, blanditiis natus sit unde illo quibusdam quos.</p>
          </div>
        {{else}}
        <div>
            <h1 id="unique-parent-id">Title 2 <input id="unique-child-id" type="text"></h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio error vitae consequuntur quasi, pariatur odit ea itaque libero repudiandae dolor nam minus assumenda, blanditiis natus sit unde illo quibusdam quos.</p>
          </div>
        {{/liquid-if}}
      `);
      this.set('showTitleOne', true);
      return tmap.waitUntilIdle();
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
      .explode-transition-test {
        width: 600px;
        height: 400px;
        padding: 7px;
      }
      .bluebox {
        background-color: blue;
        position: absolute;
        top: 0px;
        left: 0px;
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
        top: 200px;
        left: 100px;
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
