import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import '@ember/test-helpers';
import $ from 'jquery';
import hbs from 'htmlbars-inline-precompile';

let tmap;

module('Integration: fly-to transition', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.aftrEach = function() {
      tmap = null;

      // TODO: our tests don't pass when we're inside a transformed
      // element. I think this is a legit bug in the implementation that
      // we should fix.
      $('#ember-testing').css('transform', '');
    };
  });

  hooks.beforeEach(function() {
    tmap = this.owner.lookup('service:liquid-fire-transitions');

    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    $('#ember-testing').css('transform', 'none');
  });

  ['border-box', 'content-box'].forEach(function(boxSizing) {
    test(`it avoids a jump at end of animation, with absolutely positioned elements (${boxSizing})`, async function(assert) {
      assert.expect(6);
      tmap.map(function() {
        this.transition(
          this.hasClass('fly-to-test'),
          this.use('explode', {
            pickOld: '.redbox',
            pickNew: '.bluebox',
            use: function() {
              // sanity checks
              assert.equal(this.oldElement && this.oldElement.length, 1, 'found old element');
              assert.equal(this.newElement && this.newElement.length, 1, 'found new element');
              assert.equal(this.oldElement && this.oldElement.css('background-color'), "rgb(255, 0, 0)");

              return this.lookup('fly-to').call(this, { duration: 0 }).then(() => {
                assert.deepEqual(this.newElement.offset(), this.oldElement.offset(), "element didn't jump");
                assert.equal(this.newElement.outerWidth(), this.oldElement.outerWidth(), "same width");
                assert.equal(this.newElement.outerHeight(), this.oldElement.outerHeight(), "same height");
              });
            }
          })
        );
      });

      this.set('boxSizing', boxSizing);
      this.owner.register('template:components/my-stylesheet', stylesheet());
      await this.render(hbs`
                  {{my-stylesheet boxSizing=boxSizing}}
                  {{#liquid-if showBlue class="fly-to-test"}}
                  <div class="bluebox"></div>
                  {{else}}
                  <div class="redbox"></div>
                  {{/liquid-if}}
                  `);

      this.set('showBlue', true);
      await tmap.waitUntilIdle();
    });

    test(`it avoids a jump at end of animation, with statically positioned elements (${boxSizing})`, async function(assert) {
      assert.expect(6);
      tmap.map(function() {
        this.transition(
          this.hasClass('fly-to-test'),
          this.use('explode', {
            pickOld: '.greenbox',
            pickNew: '.yellowbox',
            use: function() {
              // sanity checks
              assert.equal(this.oldElement && this.oldElement.length, 1, 'found old element');
              assert.equal(this.newElement && this.newElement.length, 1, 'found new element');
              assert.equal(this.oldElement && this.oldElement.css('background-color'), "rgb(0, 128, 0)");

              return this.lookup('fly-to').call(this, { duration: 0 }).then(() => {
                assert.deepEqual(this.newElement.offset(), this.oldElement.offset(), "element didn't jump");
                assert.equal(this.newElement.outerWidth(), this.oldElement.outerWidth(), "same width");
                assert.equal(this.newElement.outerHeight(), this.oldElement.outerHeight(), "same height");
              });
            }
          })
        );
      });
      this.set('boxSizing', boxSizing);
      this.owner.register('template:components/my-stylesheet', stylesheet());
      await this.render(hbs`
                  {{my-stylesheet boxSizing=boxSizing}}
                  {{#liquid-if showYellow class="fly-to-test"}}
                  <div class="yellowbox"></div>
                  {{else}}
                  <div class="greenbox"></div>
                  {{/liquid-if}}
                  `);

      this.set('showYellow', true);
      await tmap.waitUntilIdle();
    });



  });

  function stylesheet() {
    return hbs`
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
        box-sizing: {{boxSizing}};
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
        box-sizing: {{boxSizing}};
      }
      .yellowbox {
        background-color: yellow;
        margin-top: 1px;
        margin-left: 1px;
        width: 20px;
        height: 25px;
        padding: 2px;
        border: 1px solid black;
        box-sizing: {{boxSizing}};
      }
      .greenbox {
        background-color: green;
        margin-top: 200px;
        margin-left: 100px;
        width: 25px;
        height: 30px;
        padding: 4px;
        border: 2px solid black;
        box-sizing: {{boxSizing}};
      }
                </style>

      `;
  }
});
