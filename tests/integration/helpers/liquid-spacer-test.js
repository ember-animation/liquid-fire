/* global sinon */
import { test, moduleForComponent } from "ember-qunit";
import { testingKick } from "liquid-fire/mutation-observer";
import LiquidSpacer from "liquid-fire/components/liquid-spacer";

var tmap;

moduleForComponent('Integration: liquid-spacer', {
  integration: true,
  beforeEach() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    $('#ember-testing').css('transform', 'none');
  },
  afterEach() {
    tmap = null;

    // TODO: our tests don't pass when we're inside a transformed
    // element. I think this is a legit bug in the implementation that
    // we should fix.
    $('#ember-testing').css('transform', '');
  }
});

test('it should animate', function(assert) {
  var theSpacer;
  this.registry.register('component:x-spacer', LiquidSpacer.extend({
    didInsertElement() {
      this._super();
      theSpacer = this;
    }
  }));
  this.set('message', longMessage);
  this.render(`
               {{#x-spacer id="my-spacer" growDuration=1 }}
                 {{message}}
               {{/x-spacer}}
              `);

  sinon.spy(theSpacer, 'animateGrowth');
  this.set('message', shortMessage);
  testingKick();
  return tmap.waitUntilIdle().then(() => {
    let [, have, want] = theSpacer.animateGrowth.lastCall.args;
    assert.ok(want.height < have.height, `expected ${want.height} < ${have.height}`);
  });
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

test('it should not set width style if growWidth is false', function(assert) {
  assert.expect(2);

  this.render(`
               {{#liquid-spacer id="my-spacer" growWidth=false}}
                 Hi.
               {{/liquid-spacer}}
              `);

  var style = this.$('#my-spacer').get(0).style;

  assert.equal(style.width, '', 'width style is unset');
  assert.ok(/^\d+px$/.test(style.height), 'height style is set to ' + style.height);
});

test('it should not set height style if growHeight is false', function(assert) {
  assert.expect(2);

  this.render(`
               {{#liquid-spacer id="my-spacer" growHeight=false}}
                 Hi.
               {{/liquid-spacer}}
              `);

  var style = this.$('#my-spacer').get(0).style;

  assert.equal(style.height, '', 'height style is unset');
  assert.ok(/^\d+px$/.test(style.width), 'width style is set to ' + style.width);
});


var shortMessage = "Hi.";
var longMessage = "This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. This is a long message. ";
