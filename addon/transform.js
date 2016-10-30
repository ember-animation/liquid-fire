import $ from 'jquery';

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

function ownTransform($elt) {
  let t = $elt.css('transform');
  if (t === 'none') {
    return  null;
  }
  let matrix = parseTransform(t);
  if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
    // If there is any rotation or scaling we need to do it within the context of transform-origin.
    let [x, y] = parseOrigin($elt.css('transform-origin'));
    return (new Transform(1, 0, 0, 1, -x, -y)).mult(matrix).mult(new Transform(1, 0, 0, 1, x, y));
  } else {
    // This case is an optimization for when there is only translation.
    return matrix;
  }
}

export function currentTransform(elt) {
  let $elt = $(elt);
  let accumulator = null;
  while ($elt.length > 0 && $elt[0].nodeType === 1) {
    let transform = ownTransform($elt);
    if (transform) {
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
