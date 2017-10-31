import { Promise as EmberPromise } from 'rsvp';
import { test, moduleForComponent } from "ember-qunit";
import hbs from 'htmlbars-inline-precompile';

var tmap;

moduleForComponent('Integration: liquid-container', {
  integration: true,
  beforeEach() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
  },
  afterEach() {
    tmap = null;
  }
});

['content-box', 'border-box'].forEach(function(boxSizing) {
  test(`it should maintain size stability (${boxSizing})`, function(assert) {
    var initialSize;
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

test(`has liquid-animating class during animation`, function(assert) {
  var resolveAnimation;
  this.registry.register('transition:blocking', function() {
    return new EmberPromise(function(resolve) {
      resolveAnimation = resolve;
    });
  });

  this.render(hbs`
                {{#liquid-container class="test-container" growDuration=1 as |c|}}
                  {{#liquid-versions notify=c value=value use="blocking" as |valueVersion|}}
                    <div class={{valueVersion}}></div>
                  {{/liquid-versions}}
                {{/liquid-container}}
              `);

  assert.equal(this.$('.test-container').length, 1, "have test-container");
  assert.ok(!this.$('.test-container').is('.liquid-animating'), "it doesn't have liquid-animating class");

  this.set('value', 'new-value');

  assert.equal(this.$('.test-container.liquid-animating').length, 1, "found liquid-animating class");
  resolveAnimation();
  return tmap.waitUntilIdle().then(() => {
    assert.equal(this.$('.test-container').length, 1, "still have test-container");
    assert.ok(!this.$('.test-container').is('.liquid-animating'), "liquid-animating class was removed");
  });
});
