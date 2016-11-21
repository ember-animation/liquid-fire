export function equalBounds(value, expected, message) {
  this.pushResult({
    // Tolerate errors less than a quarter pixels. This prevents any invisible rounding errors from failing our tests.
    result: ['bottom', 'height', 'left', 'right', 'top', 'width'].every(field => Math.abs(value[field] - expected[field]) < 0.25),
    actual: value,
    expected: expected,
    message: message
  });
}

export function sameBounds(target, fn) {
  let before = target[0].getBoundingClientRect();
  fn();
  let after = target[0].getBoundingClientRect();
  equalBounds.call(this, after, before, 'bounds should not change');
}

export function equalTransform(value, expected, message) {
  this.pushResult({
    result: ['a', 'b', 'c', 'd', 'tx', 'ty'].every(field => Math.abs(value[field] - expected[field]) < 0.01),
    actual: value,
    expected: expected,
    message: message
  });
}
