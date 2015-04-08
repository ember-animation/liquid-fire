/* global sinon */
import Ember from "ember";
import { test, moduleForComponent } from "ember-qunit";
import QUnit from 'qunit';
import { testingKick } from "liquid-fire/mutation-observer";

var tmap;

moduleForComponent('liquid-spacer', {
  integration: true,
  setup: function() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
  },
  teardown: function() {
    tmap = null;
  }
});

['content-box', 'border-box'].forEach(function(boxSizing) {
  test(`it should maintain size stability (${boxSizing})`, function(assert) {
    this.set('message', longMessage);
    this.render(`
               <button {{action "toggle"}}>Toggle</button>
               <style>
                #my-spacer {
                  padding: 2px;
                  margin: 4px;
                  border: 1px solid black;
                  box-sizing: ${boxSizing};
               }
               </style>
               {{#liquid-spacer id="my-spacer" growDuration=1 }}
                 {{message}}
               {{/liquid-spacer}}
               `);


    this.on('toggle', () => {
      if (this.get('message') === longMessage) {
        this.set('message', shortMessage);
      } else {
        this.set('message', longMessage);
      }
    });

    var initialWidth = this.$('#my-spacer').outerWidth();
    var initialHeight = this.$('#my-spacer').outerHeight();
    this.set('message', shortMessage);
    testingKick();
    return tmap.waitUntilIdle().then(() => {
      this.set('message', longMessage);
      testingKick();
      return tmap.waitUntilIdle();
    }).then(() => {
      assert.equal(this.$('#my-spacer').outerWidth(), initialWidth, 'width');
      assert.equal(this.$('#my-spacer').outerHeight(), initialHeight, 'height');
    });
  });
});



var shortMessage = "Hi.";
var longMessage = "This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. ";
