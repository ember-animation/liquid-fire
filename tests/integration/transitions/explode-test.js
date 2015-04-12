/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import QUnit from 'qunit';

var Promise = Ember.RSVP.Promise;
var tmap;

moduleForIntegration('Integration: explode transition', {
  setup: function() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
  },
  teardown: function() {
    tmap = null;
  }
});

test(`it doesn't runs parts with no matching elements`, function(assert) {
  expect(0);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        pick: '.nonexistent',
        use: function() {
          throw new Error("should not get here");
        }
      })
    );
  });
  this.render(`
              {{#liquid-if showBlue class="explode-transition-test"}}
              <div class="bluebox"></div>
              {{else}}
              <div class="redbox"></div>
              {{/liquid-if}}
              `);
  this.set('showBlue', true);
  return tmap.waitUntilIdle();
});

test("it matches the background", function(assert) {
  expect(2);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        use: function() {
          assert.ok(this.oldElement && this.oldElement.is('.liquid-child'));
          assert.ok(this.newElement && this.newElement.is('.liquid-child'));
          return Ember.RSVP.resolve();
        }
      })
    );
  });
  this.render(`
              {{#liquid-if showBlue class="explode-transition-test"}}
              <div class="bluebox"></div>
              {{else}}
              <div class="redbox"></div>
              {{/liquid-if}}
              `);
  this.set('showBlue', true);
  return tmap.waitUntilIdle();
});

test("it provides default visibility control for background", function(assert) {
  var liquidContainer;
  expect(2);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        pick: '.something',
        use: function() {
          return new Promise((resolve)=>{
            Ember.run.next(() => {
              assert.equal(liquidContainer.find('.liquid-child .bluebox').parent().css('visibility'), 'visible', 'new element');
              assert.equal(liquidContainer.find('.liquid-child .redbox').parent().css('visibility'), 'hidden', 'old element');
              resolve();
            });
          });
        }
      })
    );
  });
  this.render(`
              {{#liquid-if showBlue class="explode-transition-test"}}
              <div class="bluebox something"></div>
              {{else}}
              <div class="redbox something"></div>
              {{/liquid-if}}
              `);
  liquidContainer = this.$('.liquid-container');
  this.set('showBlue', true);
  return tmap.waitUntilIdle();
});


test("it can pick", function(assert) {
  expect(2);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        pick: 'h1',
        use: function() {
          assert.equal(this.oldElement && this.oldElement.text(), "Old Title");
          assert.equal(this.newElement && this.newElement.text(), "New Title");
          return Ember.RSVP.resolve();
        }
      })
    );
  });
  this.render(`
              {{#liquid-if otherMode class="explode-transition-test"}}
                <h1>New Title</h1>
              {{else}}
                <h1>Old Title</h1>
              {{/liquid-if}}
              `);
  this.set('otherMode', true);
  return tmap.waitUntilIdle();
});

test("it can use pickOld and pickNew together", function(assert) {
  expect(2);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        pickOld: 'h1',
        pickNew: 'h2',
        use: function() {
          assert.equal(this.oldElement && this.oldElement.text(), "Old Title");
          assert.equal(this.newElement && this.newElement.text(), "New Title");
          return Ember.RSVP.resolve();
        }
      })
    );
  });
  this.render(`
              {{#liquid-if otherMode class="explode-transition-test"}}
                <h2>New Title</h2>
              {{else}}
                <h1>Old Title</h1>
              {{/liquid-if}}
              `);
  this.set('otherMode', true);
  return tmap.waitUntilIdle();
});


test("it can pickOld by itself", function(assert) {
  expect(2);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        pickOld: 'h1',
        use: function() {
          assert.equal(this.oldElement && this.oldElement.text(), "Old Title");
          assert.ok(!this.newElement, "Should be no new element");
          return Ember.RSVP.resolve();
        }
      })
    );
  });
  this.render(`
              {{#liquid-if otherMode class="explode-transition-test"}}
                <h1>New Title</h1>
              {{else}}
                <h1>Old Title</h1>
              {{/liquid-if}}
              `);
  this.set('otherMode', true);
  return tmap.waitUntilIdle();
});

test("it can pickNew by itself", function(assert) {
  expect(2);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        pickNew: 'h1',
        use: function() {
          assert.equal(this.newElement && this.newElement.text(), "New Title");
          assert.ok(!this.oldElement, "Should be no old element");
          return Ember.RSVP.resolve();
        }
      })
    );
  });
  this.render(`
              {{#liquid-if otherMode class="explode-transition-test"}}
                <h1>New Title</h1>
              {{else}}
                <h1>Old Title</h1>
              {{/liquid-if}}
              `);
  this.set('otherMode', true);
  return tmap.waitUntilIdle();
});


test("it can matchBy", function(assert) {
  expect(6);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        matchBy: 'data-model-id',
        use: function() {
          var oldText = this.oldElement && this.oldElement.text();
          var newText = this.newElement && this.newElement.text();
          assert.ok(/Old/.test(oldText), "old text");
          assert.ok(/New/.test(newText), "new text");
          assert.equal(oldText && oldText.slice(4), newText && newText.slice(4));
          return Ember.RSVP.resolve();
        }
      })
    );
  });
  this.render(`
              {{#liquid-if otherMode class="explode-transition-test"}}
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

test("matchBy only animates when both sides match", function(assert) {
  expect(0);
  tmap.map(function() {
    this.transition(
      this.hasClass('explode-transition-test'),
      this.use('explode', {
        matchBy: 'data-model-id',
        use: function() {
          throw new Error("should not get here");
        }
      })
    );
  });
  this.render(`
              {{#liquid-if otherMode class="explode-transition-test"}}
                <div data-model-id=2>New Two</div>
              {{else}}
                <div data-model-id=1>Old One</div>
              {{/liquid-if}}
              `);
  this.set('otherMode', true);
  return tmap.waitUntilIdle();
});


['border-box', 'content-box'].forEach(function(boxSizing) {

  test(`it avoids a jump at start of animation, with absolutely positioned elements (${boxSizing})`, function(assert) {
    var didTransition = false;
    tmap.map(function() {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pickOld: '.redbox',
          pickNew: '.bluebox',
          use: function() {
            // sanity checks
            assert.equal(this.oldElement && this.oldElement.length, 1, 'found old element');
            assert.equal(this.newElement && this.newElement.length, 1, 'found new element');
            assert.equal(this.oldElement && this.oldElement.css('background-color'), "rgb(255, 0, 0)");

            // the explode transition actually animates a copy of the
            // original oldElement, which we can still find inside a
            // liquid-child (the copy is not inside a liquid-child, that
            // is part of the point of explode).
            var realOldElement = this.oldElement.parent().find('.liquid-child .redbox');
            assert.equal(realOldElement.length, 1, 'found actual old element');
            assert.equal(realOldElement.css('visibility'), 'hidden');
            assert.deepEqual(realOldElement.offset(), this.oldElement.offset(), "element didn't jump");
            assert.equal(realOldElement.outerWidth(), this.oldElement.outerWidth(), "same width");
            assert.equal(realOldElement.outerHeight(), this.oldElement.outerHeight(), "same height");
            didTransition = true;
            return Ember.RSVP.resolve();
          }
        })
      );
    });
    this.render(stylesheet(boxSizing) + `
                {{#liquid-if showBlue class="explode-transition-test"}}
                <div class="bluebox"></div>
                {{else}}
                <div class="redbox"></div>
                {{/liquid-if}}
                `);

    this.set('showBlue', true);
    return tmap.waitUntilIdle().then(() => {
      assert.ok(didTransition, 'didTransition');
    });
  });



  test(`it avoids a jump at start of animation, with statically positioned elements (${boxSizing})`, function(assert) {
    var didTransition = false;
    tmap.map(function() {
      this.transition(
        this.hasClass('explode-transition-test'),
        this.use('explode', {
          pickOld: '.greenbox',
          pickNew: '.yellowbox',
          use: function() {
            // sanity checks
            assert.equal(this.oldElement && this.oldElement.length, 1, 'found old element');
            assert.equal(this.newElement && this.newElement.length, 1, 'found new element');
            assert.equal(this.oldElement && this.oldElement.css('background-color'), "rgb(0, 128, 0)");

            // the explode transition actually animates a copy of the
            // original oldElement, which we can still find inside a
            // liquid-child (the copy is not inside a liquid-child, that
            // is part of the point of explode).
            var realOldElement = this.oldElement.parent().find('.liquid-child .greenbox');
            assert.equal(realOldElement.length, 1, 'found actual old element');
            assert.equal(realOldElement.css('visibility'), 'hidden');
            assert.deepEqual(realOldElement.offset(), this.oldElement.offset(), "element didn't jump");
            assert.equal(realOldElement.outerWidth(), this.oldElement.outerWidth(), "same width");
            assert.equal(realOldElement.outerHeight(), this.oldElement.outerHeight(), "same height");
            didTransition = true;
            return Ember.RSVP.resolve();
          }
        })
      );
    });
    this.render(stylesheet(boxSizing) + `
                {{#liquid-if showYellow class="explode-transition-test"}}
                <div class="yellowbox"></div>
                {{else}}
                <div class="greenbox"></div>

                {{/liquid-if}}
                `);

    this.set('showYellow', true);
    return tmap.waitUntilIdle().then(() => {
      assert.ok(didTransition, 'didTransition');
    });
  });

});

function stylesheet(boxSizing) {
  return `
    <style>
    .explode-transition-test {
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
      box-sizing: ${boxSizing};
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
      box-sizing: ${boxSizing};
    }
    .yellowbox {
      background-color: yellow;
      margin-top: 1px;
      margin-left: 1px;
      width: 20px;
      height: 25px;
      padding: 2px;
      border: 1px solid black;
      box-sizing: ${boxSizing};
    }
    .greenbox {
      background-color: green;
      margin-top: 200px;
      margin-left: 100px;
      width: 25px;
      height: 30px;
      padding: 4px;
      border: 2px solid black;
      box-sizing: ${boxSizing};
    }
              </style>

    `;
}
