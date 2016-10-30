import { module, test } from 'qunit';
import { cumulativeTransform, Transform } from 'liquid-fire/transform';
import $ from 'jquery';

let environment, parent, target;
const WIDTH = 601;
const HEIGHT = 402;

module("Unit | Transform", {
  beforeEach(assert) {
    assert.sameTransform = function(value, expected, message) {
      this.pushResult({
        result: ['a', 'b', 'c', 'd', 'tx', 'ty'].every(field => value[field] - expected[field] < 0.00001),
        actual: value,
        expected: expected,
        message: message
      });
    };

    let fixture = $('#qunit-fixture');
    fixture.html('<div class="environment"><div class="parent"><div class="target"></div></div></div>');
    environment = fixture.find('.environment');
    parent = fixture.find('.parent');
    target = fixture.find('.target');
    environment.width(WIDTH);
    target.height(HEIGHT);
  },
  afterEach() {
    $('#qunit-fixture').empty();
  }
});

test('Degenerate case', function(assert) {
  assert.sameTransform(cumulativeTransform(target), new Transform(1, 0, 0, 1, 0, 0));
});

test('Scale x', function(assert) {
  target.css('transform', 'scaleX(0.5)');
  assert.sameTransform(cumulativeTransform(target), new Transform(0.5, 0, 0, 1, WIDTH * (0.5 - 1) / 2, 0));
});

test('Scale x (origin top left)', function(assert) {
  target.css('transform', 'scaleX(0.5)');
  target.css('transform-origin', '0px 0px');
  assert.sameTransform(cumulativeTransform(target), new Transform(0.5, 0, 0, 1, 0, 0));
});

test('Scale y', function(assert) {
  target.css('transform', 'scaleY(2.5)');
  assert.sameTransform(cumulativeTransform(target), new Transform(1, 0, 0, 2.5, 0, HEIGHT * (2.5 - 1) / 2));
});

test('Scale both', function(assert) {
  target.css('transform', 'scale(1.2)');
  assert.sameTransform(cumulativeTransform(target), new Transform(1.2, 0, 0, 1.2, WIDTH * (1.2 - 1) / 2, HEIGHT * (1.2 - 1)/ 2));
});

test('Scale both nonuniform', function(assert) {
  target.css('transform', 'scaleX(2.5) scaleY(0.7)');
  assert.sameTransform(cumulativeTransform(target), new Transform(2.5, 0, 0, 0.7, WIDTH * (2.5 - 1) / 2, HEIGHT * (0.7 - 1)/ 2));
});

test('Translation', function(assert) {
  target.css('transform', 'translateX(123px) translateY(456px)');
  assert.sameTransform(cumulativeTransform(target), new Transform(1, 0, 0, 1, 123, 456));
});

test('Scale then translate', function(assert) {
  target.css('transform', 'scaleX(0.5) scaleY(0.7) translateX(123px) translateY(456px)');
  assert.sameTransform(cumulativeTransform(target), new Transform(0.5, 0, 0, 0.7, WIDTH * (0.5 - 1)/2 + 123*0.5, HEIGHT * (0.7 - 1)/2 + 456*0.7));
});

test('Translate then scale', function(assert) {
  target.css('transform', 'translateX(123px) translateY(456px) scaleX(0.5) scaleY(0.7)');
  assert.sameTransform(cumulativeTransform(target), new Transform(0.5, 0, 0, 0.7, 123, 456));
});

test('Scale then translate (origin top left)', function(assert) {
  target.css('transform', 'scaleX(0.5) scaleY(0.7) translateX(123px) translateY(456px)');
  target.css('transform-origin', '0px 0px');
  assert.sameTransform(cumulativeTransform(target), new Transform(0.5, 0, 0, 0.7, 123/2, 456*0.7));
});

test('Translate then scale (origin top left)', function(assert) {
  target.css('transform', 'translateX(123px) translateY(456px) scaleX(0.5) scaleY(0.7)');
  target.css('transform-origin', '0px 0px');
  assert.sameTransform(cumulativeTransform(target), new Transform(0.5, 0, 0, 0.7, 123, 456));
});

test('Stacked transforms', function(assert) {
  parent.css('transform', 'translateX(-50px) translateY(-20px)');
  target.css('transform', 'translateX(123px) translateY(456px)');
  target.css('transform-origin', '0px 0px');
  assert.sameTransform(cumulativeTransform(target), new Transform(1, 0, 0, 1, 123-50, 456-20));
});

test('Stacked transforms (origin top left)', function(assert) {
  parent.css('transform', 'translateX(-50px) translateY(-20px)');
  parent.css('transform-origin', '0px 0px');
  target.css('transform', 'translateX(123px) translateY(456px)');
  target.css('transform-origin', '0px 0px');
  assert.sameTransform(cumulativeTransform(target), new Transform(1, 0, 0, 1, 123-50, 456-20));
});
