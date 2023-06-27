import { guidFor } from '@ember/object/internals';
import { isArray, A } from '@ember/array';
import constrainables from './constrainables';

// Every rule constraint has a target and either `keys` or
// `predicate`. key-based constraints are cheaper because we can check
// them with O(1) lookups, whereas predicates must be searched O(n).
export default class Constraint {
  constructor(target, matcher) {
    // targets are the properties of a transition that we can
    // constrain
    this.target = target;
    if (arguments.length === 1) {
      return;
    }
    if (matcher instanceof RegExp) {
      this.predicate = function (value) {
        return matcher.test(value);
      };
    } else if (typeof matcher === 'function') {
      this.predicate = matcher;
    } else if (typeof matcher === 'boolean') {
      this.predicate = function (value) {
        return matcher ? value : !value;
      };
    } else {
      this.keys = constraintKeys(matcher);
    }
  }

  invert() {
    if (!constrainables[this.target].reversesTo) {
      return this;
    }
    let inverse = new this.constructor(constrainables[this.target].reversesTo);
    inverse.predicate = this.predicate;
    inverse.keys = this.keys;
    return inverse;
  }
}

export const EMPTY = '__liquid_fire_EMPTY__';
export const ANY = '__liquid_fire_ANY__';

export function constraintKeys(matcher) {
  if (typeof matcher === 'undefined' || matcher === null) {
    matcher = [EMPTY];
  } else if (!isArray(matcher)) {
    matcher = [matcher];
  }
  return A(matcher).map((elt) => {
    if (typeof elt === 'string') {
      return elt;
    } else {
      return guidFor(elt);
    }
  });
}
