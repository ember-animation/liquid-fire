import Ember from "ember";
import moduleForIntegration from "../../helpers/module-for-integration";
import { test } from "ember-qunit";
import QUnit from 'qunit';

var tmap;

moduleForIntegration('Integration: liquid-container', {
  setup: function() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
  },
  teardown: function() {
    tmap = null;
  }
});

['content-box', 'border-box'].forEach(function(boxSizing) {
  test(`it should maintain size stability (${boxSizing})`, function(assert) {
    var initialSize;
    this.set('value', 'first-value');
    this.render(`
                <style>
                  .test-container {
                    margin: 5px;
                    border: 2px solid black;
                    padding: 3px;
                    float: left;
                    box-sizing: ${boxSizing}
                  }
                  .first-value {
                    width: 200px;
                    height: 200px;
                    margin: 4px;
                    border: 1px solid black;
                    padding: 2px;
                    box-sizing: ${boxSizing}
                  }
                  .second-value {
                    width: 100px;
                    height: 100px;
                    margin: 2px;
                    border: 2px solid black;
                    padding: 6px;
                    box-sizing: ${boxSizing}
                  }

                </style>
                <button {{action "toggle"}}>Toggle</button>
                {{#liquid-container class="test-container" growDuration=1 as |c|}}
                  {{#liquid-versions notify=c value=value as |valueVersion|}}
                    <div class={{valueVersion}}></div>
                  {{/liquid-versions}}
                {{/liquid-container}}
                `);
    this.on('toggle', () => {
      if (this.get('value') === 'first-value') {
        this.set('value', 'second-value');
      } else {
        this.set('value', 'first-value');
      }
    });
    return tmap.waitUntilIdle().then(() => {
      initialSize = {
        width: this.$('.test-container').outerWidth(),
        height: this.$('.test-container').outerHeight()
      };
      this.$('button').click();
      return tmap.waitUntilIdle();
    }).then(() => {
      var newSize = {
        width: this.$('.test-container').outerWidth(),
        height: this.$('.test-container').outerHeight()
      };
      assert.notEqual(newSize.width, initialSize.width);
      assert.notEqual(newSize.height, initialSize.height);
      this.$('button').click();
      return tmap.waitUntilIdle();
    }).then(() => {
      var newSize = {
        width: this.$('.test-container').outerWidth(),
        height: this.$('.test-container').outerHeight()
      };
      assert.deepEqual(newSize, initialSize);
    });
  });
});
