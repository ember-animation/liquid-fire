import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import QUnit from 'qunit';
import $ from 'jquery';

moduleForComponent('liquid-each', 'Integration | Component | animated each', {
  integration: true,
  beforeEach(assert) {
    assert.listContents = function( $elts, expected, message ) {
      let values = $elts.toArray().map(e => $(e).text().trim());
      this.pushResult({
        result: QUnit.equiv(values, expected),
        actual: values,
        expected: expected,
        message: message
      });
    };
  }
});

skip('it renders', function(assert) {
  this.set('items', ['a', 'b', 'c']);
  this.render(hbs`
    {{#animated-each items as |item|}}
      <div class="test-child">{{item}}</div>
    {{/animated-each}}
  `);

  assert.listContents(this.$('.test-child'), ['a', 'b', 'c']);
});

skip('re-integrate or remove matchReplacements');
