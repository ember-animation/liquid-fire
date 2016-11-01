import $ from 'jquery';

/*
  Our Transform type is always respresented relative to
  `transform-origin: 0px 0px`. This is different from the browser's
  own `transform` property, which will vary based on the present value
  of `transform-origin`, and which defaults to `50% 50%`. I am
  standardizing on zero because it disentangles our coordinate system
  from the size of the element, which can vary over time.

  Conceptually, each of our Transforms is an 2d affine transformation
  representd as a 3x3 matrix:

      a c tx
      b d ty
      0 0  1
*/

export class Transform {
  constructor(a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }
  serialize() {
    if (this.isIdentity()) {
      return 'none';
    }
    return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
  }
  isIdentity() {
    return this.a === 1 &&
      this.b === 0 &&
      this.c === 0 &&
      this.d === 1 &&
      this.tx === 0 &&
      this.ty === 0;
  }
  mult(other) {
    return new Transform(
      this.a * other.a + this.c * other.b,
      this.b * other.a + this.d * other.b,
      this.a * other.c + this.c * other.d,
      this.b * other.c + this.d * other.d,
      this.a * other.tx + this.c * other.ty + this.tx,
      this.b * other.tx + this.d * other.ty + this.ty
    );
  }
}

const identity = new Transform(1, 0, 0, 1, 0, 0);

export function parseTransform(matrixString) {
  let match = /matrix\((.*)\)/.exec(matrixString);
  if (!match) {
    return identity;
  }
  return new Transform(...match[1].split(',').map(parseFloat));
}

export function parseOrigin(originString) {
  return originString.split(' ').map(parseFloat);
}

function _ownTransform($elt) {
  let t = $elt.css('transform');
  if (t === 'none') {
    // This constant value is an optimization, and we rely on that in
    // cumulativeTransform
    return identity;
  }
  let matrix = parseTransform(t);
  if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
    // If there is any rotation, scaling, or skew we need to do it within the context of transform-origin.
    let [originX, originY] = parseOrigin($elt.css('transform-origin'));
    if (originX === 0 && originY === 0) {
      // transform origin is at 0,0 so it will have no effect, so we're done.
      return matrix;
    }

    return (new Transform(1, 0, 0, 1, -originX, -originY)).mult(matrix).mult(new Transform(1, 0, 0, 1, originX, originY));
  } else {
    // This case is an optimization for when there is only translation.
    return matrix;
  }
}

// I want the public interface for this module to be plain elements,
// not jQuery, so that we have the option of switching to a non-query
// implmentation.
export function ownTransform(elt) {
  return _ownTransform($(elt));
}

export function cumulativeTransform(elt) {
  let $elt = $(elt);
  let accumulator = null;
  while ($elt.length > 0 && $elt[0].nodeType === 1) {
    let transform = _ownTransform($elt);
    // Testing for equality with our constant `identity` is an
    // optimization for the common case where there is no transform at
    // all. Note that this is not exactly the same thing as
    // isIdentity(), which tests for a matrix that is present but
    // doesn't do anything (which you could get, for example, by
    // applying two transformations that cancel each other out).
    if (transform !== identity && !transform.isIdentity()) {
      if (accumulator) {
        accumulator = transform.mult(accumulator);
      } else {
        accumulator = transform;
      }
    }
    $elt = $elt.parent();
  }
  return accumulator || identity;
}
