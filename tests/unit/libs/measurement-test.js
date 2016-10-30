import { module, test } from 'qunit';
import { ownTransform } from 'liquid-fire/transform';
import Measurement from 'liquid-fire/measurement';
import $ from 'jquery';

let environment, offsetParent, target, innerContent;

module("Unit | Measurement", {
  beforeEach(assert) {
    assert.sameBounds = function(target, fn) {
      let before = bounds(target);
      fn();
      let after = bounds(target);
      assert.deepEqual(after, before, 'bounds should not change');
    };

    let fixture = $('#qunit-fixture');
    fixture.html('<div class="environment"><div class="offset-parent"><div class="target"><div class="inner-content"></div></div></div></div>');
    environment = fixture.find('.environment');
    offsetParent = fixture.find('.offset-parent');
    target = fixture.find('.target');
    innerContent = fixture.find('.inner-content');
    environment.width(600);
    offsetParent.css('position', 'relative');
    innerContent.height(400);
  },
  afterEach() {
    $('#qunit-fixture').empty();
  }
});

test('Simple case', function(assert) {
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Scaled ancestor', function(assert) {
  environment.css('transform', 'scale(0.5)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Translated ancestor', function(assert) {
  environment.css('transform', 'translateX(500px) translateY(500px)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Scaled offsetParent', function(assert) {
  offsetParent.css('transform', 'scale(0.5)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Translated offsetParent', function(assert) {
  offsetParent.css('transform', 'translateX(500px) translateY(500px)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Target translated', function(assert) {
  target.css('transform', 'translateX(500px) translateY(500px)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Target scaled', function(assert) {
  target.css('transform', 'scale(0.5)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Target rotated', function(assert) {
  target.css('transform', 'rotate(45deg)');
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Margins on target', function(assert) {
  addMargins(target);
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test('Margins on offsetParent', function(assert) {
  addMargins(offsetParent);
  let m = measure(target);
  assert.sameBounds(target, () => m.lock());
});

test("No leaked styles", function(assert) {
  let m = measure(target);
  m.lock();
  m.unlock();
  // TODO: we are clearing the styles, but we leave an empty attribute
  // behind. Seems likea jquery or browser bug.
  assert.equal(target.attr('style'), undefined);
});

test("Restores original styles", function(assert) {
  target.css({
    position: 'relative',
    top: '5px',
    left: '6px',
    width: '10px',
    height: '11px',
    transform: 'translateX(20px)'
  });
  let m = measure(target);
  m.lock();
  m.unlock();
  assert.equal(target.css('position'), 'relative', 'position');
  assert.equal(target.css('top'), '5px', 'top');
  assert.equal(target.css('left'), '6px', 'left');
  assert.equal(target.css('width'), '10px', 'width');
  assert.equal(target.css('height'), '11px', 'height');
  assert.equal(ownTransform(target[0]).tx, 20, 'translateX');
});

function bounds($elt) {
  return $elt[0].getBoundingClientRect();
}

function measure($elt) {
  return new Measurement($elt[0]);
}

function addMargins($elt) {
  $elt.css({
    marginTop: '4px',
    marginLeft: '5px',
    marginRight: '6px',
    marginBottom: '7px'
  });
}
