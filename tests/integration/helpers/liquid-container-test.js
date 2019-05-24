import { Promise as EmberPromise } from 'rsvp';
import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let tmap;

module('Integration: liquid-container', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    tmap = this.owner.lookup('service:liquid-fire-transitions');
  });

  hooks.afterEach(function() {
    tmap = null;
  });

  ['content-box', 'border-box'].forEach(function(boxSizing) {
    test(`it should maintain size stability (${boxSizing})`, function(assert) {
      let initialSize;
      this.set('value', 'first-value');
      this.set('boxSizing', boxSizing);
      this.render(hbs`
                  <style>
                    .test-container {
                      margin: 5px;
                      border: 2px solid black;
                      padding: 3px;
                      float: left;
                      box-sizing: {{boxSizing}}
                    }
                    .first-value {
                      width: 200px;
                      height: 200px;
                      margin: 4px;
                      border: 1px solid black;
                      padding: 2px;
                      box-sizing: {{boxSizing}}
                    }
                    .second-value {
                      width: 100px;
                      height: 100px;
                      margin: 2px;
                      border: 2px solid black;
                      padding: 6px;
                      box-sizing: {{boxSizing}}
                    }

                  </style>
                  <button {{action this.toggle}}>Toggle</button>
                  {{#liquid-container class="test-container" growDuration=1 as |c|}}
                    {{#liquid-versions notify=c value=value as |valueVersion|}}
                      <div class={{valueVersion}}></div>
                    {{/liquid-versions}}
                  {{/liquid-container}}
                  `);
      this.set('toggle', () => {
        if (this.get('value') === 'first-value') {
          this.set('value', 'second-value');
        } else {
          this.set('value', 'first-value');
        }
      });
      return tmap.waitUntilIdle().then(async () => {
        initialSize = {
          width: this.element.querySelector('.test-container').offsetWidth,
          height: this.element.querySelector('.test-container').offsetHeight,
        };
        await click('button');
        return tmap.waitUntilIdle();
      }).then(async () => {
        let newSize = {
          width: this.element.querySelector('.test-container').offsetWidth,
          height: this.element.querySelector('.test-container').offsetHeight,
        };
        assert.notEqual(newSize.width, initialSize.width);
        assert.notEqual(newSize.height, initialSize.height);
        await click('button');
        return tmap.waitUntilIdle();
      }).then(() => {
        let newSize = {
          width: this.element.querySelector('.test-container').offsetWidth,
          height: this.element.querySelector('.test-container').offsetHeight,
        };
        assert.deepEqual(newSize, initialSize);
      });
    });
  });

  test(`has liquid-animating class during animation`, async function(assert) {
    let resolveAnimation;
    this.owner.register('transition:blocking', function() {
      return new EmberPromise(function(resolve) {
        resolveAnimation = resolve;
      });
    });

    await render(hbs`
                  {{#liquid-container class="test-container" growDuration=1 as |c|}}
                    {{#liquid-versions notify=c value=value use="blocking" as |valueVersion|}}
                      <div class={{valueVersion}}></div>
                    {{/liquid-versions}}
                  {{/liquid-container}}
                `);

    assert.dom('.test-container').exists({ count: 1 }, "have test-container");
    assert.ok(!this.element.querySelector('.test-container').classList.contains('liquid-animating'), "it doesn't have liquid-animating class");

    this.set('value', 'new-value');

    assert.dom('.test-container.liquid-animating').exists({ count: 1 }, "found liquid-animating class");
    resolveAnimation();
    return tmap.waitUntilIdle().then(() => {
      assert.dom('.test-container').exists({ count: 1 }, "still have test-container");
      assert.ok(!this.element.querySelector('.test-container').classList.contains('liquid-animating'), "liquid-animating class was removed");
    });
  });
});
