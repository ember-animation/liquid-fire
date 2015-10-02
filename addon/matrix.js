class Matrix {
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
    return new Matrix(
      this.a * other.a + this.c * other.b,
      this.b * other.a + this.d * other.b,
      this.a * other.c + this.c * other.d,
      this.b * other.c + this.d * other.d,
      this.a * other.tx + this.c * other.ty + this.tx,
      this.b * other.tx + this.d * other.ty + this.ty
    );
  }
}

function identity() {
  return new Matrix(1, 0, 0, 1, 0, 0);
}

export function parseMatrix(matrixString) {
  let match = /matrix\((.*)\)/.exec(matrixString);
  if (!match) { return identity(); }
  return new Matrix(...match[1].split(',').map(parseFloat));
}

export function parseOrigin(originString) {
  let [x, y] =  originString.split(' ').map(parseFloat);
  return new Matrix(1, 0, 0, 1, -x, -y);
}

export function currentTransform($elt) {
  if (!$elt || $elt.length === 0) {
    return identity;
  }
  let matrix = parseMatrix($elt.css('transform'));
  let origin = parseOrigin($elt.css('transform-origin'));
  return origin.mult(matrix);
}
