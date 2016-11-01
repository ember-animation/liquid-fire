import { module, test } from 'qunit';
import {
  ownTransform,
  cumulativeTransform,
  Transform
} from 'liquid-fire/transform';
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

test('Rotate on center of element', function(assert) {
  let s = Math.sin(30 * Math.PI / 180);
  let c = Math.cos(30 * Math.PI / 180);
  target.css('transform', 'rotate(30deg)');
  assert.sameTransform(ownTransform(target), new Transform(c, s, -s, c, c*WIDTH/2-s*HEIGHT/2-WIDTH/2, s*WIDTH/2+c*HEIGHT/2-HEIGHT/2));
});

test('Rotate and translate', function(assert) {
  let s = Math.sin(45 * Math.PI / 180);
  target.css('transform', 'translateX(123px) rotate(45deg)');
  assert.sameTransform(ownTransform(target), new Transform(s, s, -s, s, WIDTH*(2*s-1)/2 + 123,  HEIGHT/2));
});


test('Rotate and translate (origin top left)', function(assert) {
  let s = Math.sin(45 * Math.PI / 180);
  target.css('transform', 'translateX(123px) rotate(45deg)');
  target.css('transform-origin', '0px 0px');
  assert.sameTransform(ownTransform(target), new Transform(s, s, -s, s, 123, 0));
});

[
  'translateX(100px) translateY(200px)',
  'rotate(30deg)'
].forEach(function(transform){
  test(`Adjusts transform-origin correctly for ${transform}, real transform origin at top left`, function(assert) {
    target.css('transform', transform);
    target.css('transform-origin', '0px 0px');
    let withDefaultOrigin = ownTransform(target);

    target.css('transform', `translateX(-50%) translateY(-50%) ${transform} translateX(50%) translateY(50%)`);
    target.css('transform-origin', '50% 50%');
    let withTopLeftOrigin = ownTransform(target);

    assert.sameTransform(withTopLeftOrigin, withDefaultOrigin);
  });

  test(`Adjusts transform-origin correctly for ${transform}, real transform origin at center`, function(assert) {
    target.css('transform', transform);
    target.css('transform-origin', '50% 50%');
    let withDefaultOrigin = ownTransform(target);

    target.css('transform', `translateX(50%) translateY(50%) ${transform} translateX(-50%) translateY(-50%)`);
    target.css('transform-origin', '0px 0px');
    let withTopLeftOrigin = ownTransform(target);

    assert.sameTransform(withTopLeftOrigin, withDefaultOrigin);
  });

});
