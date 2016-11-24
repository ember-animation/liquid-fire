import { module, test } from 'qunit';
import { ownTransform } from 'liquid-fire/transform';
import Sprite from 'liquid-fire/sprite';
import $ from 'jquery';
import { visuallyConstant } from '../../helpers/assertions';

let environment, offsetParent, target, innerContent;

module("Unit | Sprite", {
  beforeEach(assert) {
    assert.visuallyConstant = visuallyConstant;

    let fixture = $('#qunit-fixture');
    fixture.html(`
<div class="environment">
  <div class="offset-parent">
    <div class="sibling"></div>
    <div class="target">
      <div class="inner-content"></div>
    </div>
    <div class="sibling"></div>
  </div>
</div>
`);
    environment = fixture.find('.environment');
    offsetParent = fixture.find('.offset-parent');
    target = fixture.find('.target');
    innerContent = fixture.find('.inner-content');
    environment.width(600);
    offsetParent.css({
      position: 'relative'
    });
    innerContent.height(400);

    // These siblings are a necessary part of the test
    // environment. They are preventing offsetParent from collapsing
    // its top and bottom margins together when .target gets
    // absolutely positioned. It's not the responsibility of
    // Sprite to guard its surroundings from moving. In a
    // real app you would use animated-container for that.
    fixture.find('.sibling').height(10);
  },
  afterEach() {
    $('#qunit-fixture').empty();
  }
});

test('Simple case', function(assert) {
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Scaled ancestor', function(assert) {
  environment.css('transform', 'scale(0.5)');
  environment.css('transform-origin', '0 0');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Translated ancestor', function(assert) {
  environment.css('transform', 'translateX(500px) translateY(500px)');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Scaled offsetParent', function(assert) {
  offsetParent.css('transform', 'scale(0.5)');
  offsetParent.css('transform-origin', '0 0');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Translated offsetParent', function(assert) {
  offsetParent.css('transform', 'translateX(500px) translateY(500px)');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Target translated', function(assert) {
  target.css('transform', 'translateX(500px) translateY(500px)');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Target scaled', function(assert) {
  target.css('transform', 'scale(0.5)');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Target rotated', function(assert) {
  target.css('transform', 'rotate(30deg)');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Margins on target', function(assert) {
  addMargins(target);
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Margins on offsetParent', function(assert) {
  addMargins(offsetParent);
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Padding on offsetParent', function(assert) {
  addPadding(offsetParent);
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test('Border on target', function(assert) {
  target.css('border', '2px solid blue');
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test("No leaked styles", function(assert) {
  let m = animated(target);
  m.lock();
  m.unlock();
  // TODO: we are clearing the styles, but we leave an empty attribute
  // behind. Seems like a jquery or browser bug.
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
  let m = animated(target);
  m.lock();
  m.unlock();
  assert.equal(target.css('position'), 'relative', 'position');
  assert.equal(target.css('top'), '5px', 'top');
  assert.equal(target.css('left'), '6px', 'left');
  assert.equal(target.css('width'), '10px', 'width');
  assert.equal(target.css('height'), '11px', 'height');
  assert.equal(ownTransform(target[0]).tx, 20, 'translateX');
});

test("within scrolling contexts", function(assert) {
  environment.css({
    overflowY: 'scroll',
    height: 400
  });
  offsetParent.css({
    marginTop: 200,
    height: 600
  });
  environment.scrollTop(300);
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test("target absolutely positioned", function(assert) {
  target.css({
    position: 'absolute',
    top: 100,
    left: 200
  });
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

test("target fixed positioned", function(assert){
  target.css({
    position: 'fixed',
    top: 100,
    left: 200
  });
  let m = animated(target);
  assert.visuallyConstant(target, () => m.lock());
});

function animated($elt) {
  return new Sprite($elt[0]);
}

function addMargins($elt) {
  $elt.css({
    marginTop: '40px',
    marginLeft: '50px',
    marginRight: '60px',
    marginBottom: '70px'
  });
}

function addPadding($elt) {
  $elt.css({
    paddingTop: '8px',
    paddingLeft: '9px',
    paddingRight: '10px',
    paddingBottom: '11px'
  });
}
