/* global sinon */
import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import QUnit from 'qunit';

var tmap;

moduleForIntegration('Integration: liquid-spacer', {
  setup: function() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
  },
  teardown: function() {
    tmap = null;
  }
});

['content-box', 'border-box'].forEach(function(boxSizing) {
  test(`it should maintain size stability (${boxSizing})`, function(assert) {
    this.set('shortMessage', "Hi.");
    this.set('longMessage', longMessage);
    this.set('showLongMessage', true);
    this.render(`
               <style>
                #my-spacer {
                  padding: 2px;
                  margin: 3px;
                  border: 1px solid black;
                  box-sizing: ${boxSizing};
               }
               </style>
               {{#liquid-spacer id="my-spacer" growDuration=1 finishedGrowing="finished"}}
                 {{#if showLongMessage}}
                   {{longMessage}}
                 {{else}}
                   {{shortMessage}}
                 {{/if}}
               {{/liquid-spacer}}
               `);


    var initialWidth = this.$('#my-spacer').outerWidth();
    var initialHeight = this.$('#my-spacer').outerHeight();
    console.log('setting to false');
    this.set('showLongMessage', false);
    return new Ember.RSVP.Promise((resolve) => {
      this.on('finished', resolve);
    }).then(() => {
      console.log('setting to true');
      this.set('showLongMessage', true);
      return new Ember.RSVP.Promise((resolve) => {
        this.on('finished', resolve);
      });
    }).then(() => {
      console.log('asserting');
      assert.equal(this.$('#my-spacer').outerWidth(), initialWidth);
      assert.equal(this.$('#my-spacer').outerHeight(), initialHeight);
    });
  });
});




var longMessage = "This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. ";
