import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import sinon from 'sinon';
import { hbs } from 'ember-cli-htmlbars';

module('Integration: liquid-measured', function (hooks) {
  setupRenderingTest(hooks);

  test('it should update measurements when window is resized', async function (assert) {
    assert.expect(2);

    const didMeasureSpy = sinon.spy();
    this.set('didMeasureSpy', didMeasureSpy);
    const template = hbs`<LiquidMeasured @didMeasure={{this.didMeasureSpy}}>hello</LiquidMeasured>`;
    await render(template);

    assert.strictEqual(didMeasureSpy.callCount, 1);
    await triggerEvent(window, 'resize');
    assert.strictEqual(didMeasureSpy.callCount, 2);
  });
});
