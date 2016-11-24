import { moduleForComponent, test, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('animated-container', 'Integration | Component | animated container', {
  integration: true,
  beforeEach() {
    let here = this;
    this.register('component:grab-container', Ember.Component.extend({
      didReceiveAttrs() {
        here.set('grabbed', this.get('cont'));
      }
    }));
  }
});

test('simple render', function(assert) {
  this.render(hbs`
    {{#animated-container as |container|}}
      <div class="inside">
        {{grab-container cont=container}}
      </div>
    {{/animated-container}}
  `);

  this.$('.inside').css({
    height: 210
  });

  let container = bounds(this.$('.animated-container'));
  let inside = bounds(this.$('.inside'));
  assert.equal(container.height, inside.height, 'takes height of content');

  this.$('.inside').css({
    height: 600
  });

  container = bounds(this.$('.animated-container'));
  let tallerInside = bounds(this.$('.inside'));
  assert.equal(container.height, tallerInside.height, 'adapts to height of content');
  assert.ok(tallerInside.height > inside.height, "inside content got taller");

});

skip('locks size', function(assert) {
  this.render(hbs`
    {{#animated-container as |container|}}
      <div class="inside">
        {{grab-container cont=container}}
      </div>
    {{/animated-container}}
  `);

  this.$('.inside').css({
    height: 210
  });

  let original = bounds(this.$('.animated-container'));

  this.get('grabbed.lock')();

  this.$('.inside').css({
    height: 600
  });

  let final = bounds(this.$('.animated-container'));

  assert.equal(final.height, original.height, 'height can be locked');
});

skip("Accounts for margin collapse between self and child");
skip("Accounts for margin collapse between own margins when becoming empty");

function bounds($elt) {
  return {
    width: $elt.outerWidth(),
    height: $elt.outerHeight()
  };
}
