import { module, test } from 'qunit';
import { setupRenderingTest } from "ember-qunit";
import { render, triggerEvent } from '@ember/test-helpers';
import sinon from 'sinon';
import hbs from 'htmlbars-inline-precompile';

module('Integration: liquid-measured', function(hooks) {
  setupRenderingTest(hooks);

  test('it should update measurements when window is resized', async function(assert) {
    assert.expect(2);

    let didMeasureSpy = sinon.spy();
    this.set('didMeasureSpy', didMeasureSpy);
    let template = hbs`{{#liquid-measured didMeasure=didMeasureSpy}}hello{{/liquid-measured}}`;
    await render(template);

    assert.equal(didMeasureSpy.callCount, 1);
    await triggerEvent(window, 'resize');
    assert.equal(didMeasureSpy.callCount, 2);
  });
});
