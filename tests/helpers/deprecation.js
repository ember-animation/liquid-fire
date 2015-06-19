import Ember from 'ember';
export function expectDeprecation(assert, pattern, func) {
  let orig = Ember.deprecate;
  let sawIt = false;
  Ember.deprecate = function(message, state) {
    if (!state || typeof state === 'function' && !state()) {
      assert.ok(pattern.test(message), `expected deprecation ${message} to match ${pattern}`);
      sawIt = true;
    }
  };
  try {
    return func();
  } finally {
    Ember.deprecate = orig;
    if (!sawIt) {
      assert.ok(false, `expected deprecation ${pattern} but didn't get any`);
    }
  }
}
