/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import QUnit from 'qunit';

moduleForIntegration('Integration: explode transition', {
  teardown: function() {
    QUnit.stop();
    var tmap = this.container.lookup('service:liquid-fire-transitions');
    tmap.waitUntilIdle().then(QUnit.start);
  }
});

test("it doesn't runs parts with no matching elements", function(assert) {
  expect(0);
  this.container.lookup('service:liquid-fire-transitions').map(function() {
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
});

test("it matches the background", function(assert) {
  expect(2);
  this.container.lookup('service:liquid-fire-transitions').map(function() {
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
});


test('it avoids a jump at start of animation, with absolutely position elements', function(assert) {
  var didTransition = false;
  this.container.lookup('service:liquid-fire-transitions').map(function() {
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
  this.render(stylesheet + `
              {{#liquid-if showBlue class="explode-transition-test"}}
                <div class="bluebox"></div>
              {{else}}
                <div class="redbox"></div>
              {{/liquid-if}}
  `);

  this.set('showBlue', true);
  assert.ok(didTransition, 'didTransition');
});



test('it avoids a jump at start of animation, with statically positions elements', function(assert) {
  var didTransition = false;
  this.container.lookup('service:liquid-fire-transitions').map(function() {
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
  this.render(stylesheet + `
              {{#liquid-if showYellow class="explode-transition-test"}}
                <div class="yellowbox"></div>
              {{else}}
                <div class="greenbox"></div>

              {{/liquid-if}}
  `);

  this.set('showYellow', true);
  assert.ok(didTransition, 'didTransition');
});


var stylesheet = `
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
      box-sizing: content-box;
      margin: 4px;
      border: 1px solid black;
    }
    .redbox {
      background-color: red;
      position: absolute;
      top: 200;
      left: 100;
      width: 25px;
      height: 30px;
      padding: 4px;
      box-sizing: content-box;
      margin: 6px;
      border: 2px solid black;
    }
    .yellowbox {
      background-color: yellow;
      margin-top: 1px;
      margin-left: 1px;
      width: 20px;
      height: 25px;
      padding: 2px;
      box-sizing: content-box;
      border: 1px solid black;
    }
    .greenbox {
      background-color: green;
      margin-top: 200px;
      margin-left: 100px;
      width: 25px;
      height: 30px;
      padding: 4px;
      box-sizing: content-box;
      border: 2px solid black;
    }
              </style>

`;
